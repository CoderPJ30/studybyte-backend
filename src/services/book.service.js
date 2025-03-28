import Book from "../models/book.model.js";
import User from "../models/user.model.js";
import { miniSearch } from "../utils/miniSearch.js";
import { uploadFile } from "../utils/uploadFile.js";
import { getFileFromGridFS } from "../utils/gridfs.js";

const searchBooks = (query) => {
  if (!query) return [];

  return miniSearch.search(query, { fuzzy: 0.2, prefix: true });
};

const getBooks = async (query) => {
  let matchStage = {};
  if (query?.genre) matchStage.book_genre = query.genre;

  let sortStage = {};
  if (query?.section) {
    switch (query.section) {
      case "topbooks":
        sortStage = { rating: -1 }; // High-rated books first
        break;
      case "newlyadded":
        sortStage = { createdAt: -1 }; // Most recently added books first
        break;
      default:
        sortStage = { _id: -1 }; // Default sorting (recently added)
    }
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skipIndex = (page - 1) * limit;

  const result = await Book.aggregate([
    { $match: matchStage }, // Filter books by genre if provided
    { $sort: sortStage }, // Sort based on section
    { $skip: skipIndex }, // Skip previous pages
    { $limit: limit }, // Limit the number of results
    {
      $project: {
        book_file_url: 0,
        book_file_id: 0
      }
    },
    {
      $facet: {
        books: [],
        total: [{ $count: "count" }]
      }
    }
  ]);

  const books = result[0].books || [];
  const totalBooks = result[0].total.length > 0 ? result[0].total[0].count : 0;
  const hasMore = page * limit < totalBooks;

  return { books, hasMore };
};

const getBookById = async (bookId) => {
  return await Book.findById(bookId, '-book_file_url -book_file_id');
};

const getUserBooksBySection = async (section, userId) => {
  const validSections = ["purchased", "reading", "liked", "saved", "rated"];

  if (!validSections.includes(section)) {
    throw { type: "BAD_REQUEST", customMessage: "Invalid section" };
  }

  const user = await User.findById(userId)
    .select(`user_${section}_books`);

  if (!user) throw { type: "DATA_NOT_FOUND", customMessage: "User not found" };

  const books = await Book.find({ _id: { $in: user[`user_${section}_books`] } })
    .select('-book_file_url -book_file_id');

  return books;
};

const readBook = async (bookId, userId) => {
  const book = await Book.findById(bookId);
  if (!book) throw { type: "DATA_NOT_FOUND", customMessage: "Book not found" };

  const user = await User.findById(userId);
  if (!user) throw { type: "DATA_NOT_FOUND", customMessage: "User not found" };

  // Add book to reading list if not already present
  if (!user.user_reading_books.find((b) => b.book.toString() === bookId)) {
    user.user_reading_books.push({ book: bookId });
    await user.save();
  }

  // Get last read page (default to 0 if not found)
  const readingData = user.user_reading_books.find((b) => b.book.toString() === bookId);
  const lastPage = readingData ? readingData.progress : 0;

  // If book is free, return file URL with last page
  if (!book.book_isPaid) return { fileUrl: `${book.book_file_url}#page=${lastPage}`, lastPage };

  // Check if user has purchased the book
  if (!user.user_purchased_books.includes(bookId)) {
    throw { type: "UNAUTHORIZED", customMessage: "You need to purchase the book to read it" };
  }

  // Fetch from GridFS (Paid book)
  if (!book.book_file_id) throw { type: "DATA_NOT_FOUND", customMessage: "Book file not found" };

  const fileStream = await getFileFromGridFS(book.book_file_id);
  return { fileStream };
};

const uploadBook = async (bookData, files) => {
  const {
    book_title, book_author, book_desc, book_genre,
    book_price
  } = bookData;

  const book_isPaid = bookData.book_isPaid === "true";

  // Check if book already exists (case-insensitive)
  const existingBook = await Book.findOne({ book_title: { $regex: book_title, $options: "i" } });
  if (existingBook) {
    throw { type: "ALREADY_EXISTS", customMessage: "Book with a similar name already exists." };
  }

  // Upload book cover to Cloudinary
  let uploadedCover = null;
  if (files.cover && files.cover.length > 0) {
    uploadedCover = await uploadFile(files.cover[0].buffer, "book_covers");
  }

  // Upload the file (Paid → GridFS, Free → Cloudinary)
  let book_file_id = null;
  let book_file_url = null;

  if (files.file) {
    const fileBuffer = files.file[0].buffer;

    if (book_isPaid) {
      // Upload to GridFS
      book_file_id = await uploadFile(fileBuffer, "books", true);
    } else {
      // Upload to Cloudinary
      const uploadedFile = await uploadFile(fileBuffer, "books", false);
      book_file_url = uploadedFile;
    }
  }

  // Create a new book entry
  const newBook = new Book({
    book_title,
    book_author,
    book_desc,
    book_genre,
    book_price,
    book_isPaid,
    book_cover: uploadedCover,
    book_file_id, // GridFS ID for paid books
    book_file_url, // Cloudinary URL for free books
  });

  await newBook.save();
  return newBook;
};

const updateBook = async (bookId, bookData) => {
  return await Book.findByIdAndUpdate(bookId, bookData, { new: true });
};

const deleteBook = async (bookId) => {
  return await Book.findByIdAndDelete(bookId);
};

export default {
  searchBooks,
  getBooks,
  getBookById,
  getUserBooksBySection,
  readBook,
  uploadBook,
  updateBook,
  deleteBook,
};