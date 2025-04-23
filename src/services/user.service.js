import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import Cart from "../models/cart.model.js";

const getUserProfile = async (userId) => {
  return await User.findById(userId).select("-user_password");
};

const getUserBooks = async (userId, query) => {
  const user = await User.findById(userId);
  if (!user) throw { type: "DATA_NOT_FOUND", customMessage: "User not found" };

  let books = null;

  if (query?.section === "Liked") {
    books = user.user_liked_books;
  } else if (query?.section === "Saved") {
    books = user.user_saved_books;
  } else if (query?.section === "Rated") {
    books = user.user_rated_books;
  } else if (query?.section === "Reading") {
    books = user.user_reading_books.map((b) => b.book).concat(user.user_purchased_books);
  } else {
    books = [];
  }

  return await Book.find({ _id: { $in: books } });
};

const likeBook = async (userId, bookId) => {
  const user = await User.findById(userId);
  if (!user) throw { type: "DATA_NOT_FOUND", customMessage: "User not found" };

  if (user.user_liked_books.includes(bookId)) {
    user.user_liked_books = user.user_liked_books.filter((b) => b.toString() !== bookId);
  } else {
    user.user_liked_books.push(bookId);
  }

  await user.save();
};

const bookmarkBook = async (userId, bookId) => {
  const user = await User.findById(userId);
  if (!user) throw { type: "DATA_NOT_FOUND", customMessage: "User not found" };

  if (user.user_saved_books.includes(bookId)) {
    user.user_saved_books = user.user_saved_books.filter((b) => b.toString() !== bookId);
  } else {
    user.user_saved_books.push(bookId);
  }

  await user.save();
};

const rateBook = async (userId, bookId, rating) => {
  const user = await User.findById(userId);
  if (!user) throw { type: "DATA_NOT_FOUND", customMessage: "User not found" };

  const book = await Book.findById(bookId);
  if (!book) throw { type: "DATA_NOT_FOUND", customMessage: "Book not found" };

  if (rating < 0 || rating > 5) throw { type: "BAD_REQUEST", customMessage: "Rating must be between 0 and 5" };

  const bookIndex = user.user_rated_books.findIndex((b) => b.book.toString() === bookId);


  let rating_total = book.book_rating * book.book_rating_count;

  if (bookIndex === -1) {
    user.user_rated_books.push({ book: bookId, rating });
    book.book_rating_count += 1;
    rating_total += rating;
  } else if (rating === 0) {
    rating_total -= user.user_rated_books[bookIndex].rating
    book.book_rating_count -= 1;
    user.user_rated_books.splice(bookIndex, 1);
  } else {
    const previousRating = user.user_rated_books[bookIndex].rating;
    rating_total = rating_total - previousRating + rating;
    user.user_rated_books[bookIndex].rating = rating;
  }

  book.book_rating = book.book_rating_count > 0 ? rating_total / book.book_rating_count : 0;

  await book.save();
  await user.save();
};

const updateUserProfile = async (userId, userData) => {
  const user = await User.findById(userId);
  if (!user) throw { type: "DATA_NOT_FOUND", customMessage: "User not found" };

  const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
  return updatedUser;
};

const getUserCart = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate(
    "books", "book_title book_author book_price book_cover"
  );
  if (!cart) throw { type: "DATA_NOT_FOUND", customMessage: "Cart not found" };

  return cart.books;
}

const addBookToCart = async (userId, bookId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return await Cart.create({ userId, books: [bookId] });
  }

  if (!cart.books.includes(bookId)) {
    cart.books.push(bookId);
  }

  await cart.save();
}

const removeBookFromCart = async (userId, bookId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw { type: "DATA_NOT_FOUND", customMessage: "User not found" };

  cart.books = cart.books.filter((b) => b.toString() !== bookId);
  await cart.save();
}


export default {
  getUserProfile,
  getUserBooks,
  likeBook,
  bookmarkBook,
  rateBook,
  updateUserProfile,
  getUserCart,
  addBookToCart,
  removeBookFromCart,
};