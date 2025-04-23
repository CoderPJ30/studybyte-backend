import userService from "../services/user.service.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userService.getUserProfile(userId);
    successResponse({ res, data: user, message: "User profile fetched successfully." });
  } catch (error) {
    errorResponse(req, res, error);
  }
}

const getUserBooks = async (req, res) => {
  try {
    const userId = req.user._id;
    const query = req.query;
    const books = await userService.getUserBooks(userId, query);
    successResponse({ res, data: books, message: "User books fetched successfully." });
  } catch (error) {
    errorResponse(req, res, error);
  }
}

const likeBook = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.bookId;
    await userService.likeBook(userId, bookId);
    successResponse({ res, message: "Book liked/unliked successfully." });
  } catch (error) {
    errorResponse(req, res, error);
  }
}

const bookmarkBook = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.bookId;
    await userService.bookmarkBook(userId, bookId);
    successResponse({ res, message: "Book bookmarked/unbookmarked successfully." });
  } catch (error) {
    errorResponse(req, res, error);
  }
}

const rateBook = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.bookId;
    const rating = req.body.rating;
    await userService.rateBook(userId, bookId, rating);
    successResponse({ res, message: "Book rated successfully." });
  } catch (error) {
    errorResponse(req, res, error);
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const userData = req.body;
    await userService.updateUserProfile(userId, userData);
    successResponse({ res, message: "User profile updated successfully." });
  } catch (error) {
    errorResponse(req, res, error);
  }
}

const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await userService.getUserCart(userId);
    successResponse({ res, data: cart, message: "User cart fetched successfully." });
  } catch (error) {
    errorResponse(req, res, error);
  }
}

const addBookToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.bookId;
    await userService.addBookToCart(userId, bookId);
    successResponse({ res, message: "Book added to cart successfully." });
  } catch (error) {
    errorResponse(req, res, error);
  }
}

const removeBookFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.bookId;
    await userService.removeBookFromCart(userId, bookId);
    successResponse({ res, message: "Book removed from cart successfully." });
  } catch (error) {
    errorResponse(req, res, error);
  }
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
