import mongoose from "mongoose";
import Book from "./book.model.js";

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    trim: true,
  },
  user_email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  user_password: {
    type: String,
    required: true,
    trim: true,
  },
  user_role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  user_reading_books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  }],
  user_liked_books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  }],
  user_saved_books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  }],
  user_rated_books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  }],
}, { timestamps: true });

export default mongoose.model("User", userSchema);