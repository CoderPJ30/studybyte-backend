import bookService from "../services/book.service.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const searchBooks = async (req, res) => {
  try {
    const query = req.query?.s;
    const books = bookService.searchBooks(query);
    successResponse({ res, data: books, message: "Books found successfully" });
  } catch (error) {
    errorResponse(req, res, error);
  }
};

const getBooks = async (req, res) => {
  try {
    const query = req.query;
    const { books, hasMore } = await bookService.getBooks(query);
    successResponse({ res, data: { books, hasMore }, message: "Books fetched successfully" });
  } catch (error) {
    errorResponse(req, res, error);
  }
};

const getAllBooks = async (req, res) => {
  try {
    const query = req.query;
    const response = await bookService.getAllBooks(query);
    successResponse({ res, data: response, message: "Books fetched successfully" });
  } catch (error) {
    errorResponse(req, res, error);
  }
};

const getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await bookService.getBookById(bookId);
    successResponse({ res, data: book, message: "Book details fetched successfully" });
  } catch (error) {
    errorResponse(req, res, error);
  }
};

const getBooksByIds = async (req, res) => {
  try {
    const { bookIds } = req.body;
    const books = await bookService.getBooksByIds(bookIds);
    successResponse({ res, data: books, message: "Books fetched successfully" });
  } catch (error) {
    errorResponse(req, res, error);
  }
};

const getUserBooksBySection = async (req, res) => {
  try {
    const section = req.params.section;
    const userId = req.user._id;
    const books = await bookService.getUserBooksBySection(section, userId);
    successResponse({ res, data: books, message: "Books fetched successfully" });
  } catch (error) {
    errorResponse(req, res, error);
  }
}

const readBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;
    const book = await bookService.readBook(bookId, userId);
    successResponse({ res, data: book, message: "Book fetched successfully" });
  } catch (error) {
    errorResponse(req, res, error);
  }
};

const uploadBook = async (req, res) => {
  try {
    const bookData = req.body;
    const files = req.files;
    const book = await bookService.uploadBook(bookData, files);
    successResponse({ res, data: book, message: "Book added successfully" });
  } catch (error) {
    errorResponse(req, res, error);
  }
};

const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const bookData = req.body;
    const updatedBook = await bookService.updateBook(bookId, bookData);
    successResponse({ res, data: updatedBook, message: "Book updated successfully" });
  } catch (error) {
    errorResponse(req, res, error);
  }
};

const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    await bookService.deleteBook(bookId);
    successResponse({ res, message: "Book deleted successfully" });
  } catch (error) {
    errorResponse(req, res, error);
  }
};

export default {
  searchBooks,
  getBooks,
  getAllBooks,
  getBookById,
  getBooksByIds,
  getUserBooksBySection,
  readBook,
  uploadBook,
  updateBook,
  deleteBook,
};
