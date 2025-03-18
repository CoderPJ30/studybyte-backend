import mongoose from "mongoose";
import Book from "./book.model.js";
import jwt from "jsonwebtoken";
import bcyptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
  user_fullname: {
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
  user_purchased_books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: Book,
  }],
  user_reading_books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: Book,
  }],
  user_liked_books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: Book,
  }],
  user_saved_books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: Book,
  }],
  user_rated_books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: Book,
  }],
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("user_password")) return next();
  this.user_password = await bcyptjs.hash(this.user_password, 10);
  next();
})

userSchema.methods.verifyPassword = async function (password) {
  return await bcyptjs.compare(password, this.user_password);
}

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      user_fullname: this.user_fullname,
      user_email: this.user_email
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },)
}

export default mongoose.model("User", userSchema);