import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  }]
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);