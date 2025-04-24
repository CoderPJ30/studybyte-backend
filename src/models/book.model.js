import mongoose from "mongoose";

const genres = ['Fiction', 'Non-Fiction', 'Fantasy', 'Mystery', 'Thriller',
  'Romance', 'Horror', 'Science Fiction', 'Biography', 'Autobiography',
  'Self-Help', 'Cookbooks', 'Travel', 'History', 'Science', 'Poetry', 'Drama',
  'Humor', 'Art', 'Children', 'Young Adult', 'Comics', 'Manga', 'Graphic Novels', 'Other', 'Education',
  'Textbook', 'Reference', 'Business', 'Finance', 'Health', 'Fitness', 'Religion', 'Spirituality',
];

const bookSchema = new mongoose.Schema({
  book_title: {
    type: String,
    required: true,
    trim: true,
  },
  book_author: {
    type: String,
    required: true,
    trim: true,
  },
  book_desc: {
    type: String,
    trim: true,
  },
  book_rating: {
    type: Number,
    default: 0,
  },
  book_rating_count: {
    type: Number,
    default: 0,
  },
  book_genre: {
    type: String,
    enum: genres,
    trim: true,
  },
  book_cover: {
    type: String,  // Cloudinary URL
    trim: true,
  },
  book_file_url: {
    type: String,  // Cloudinary URL (for free books)
    trim: true,
  },
  book_file_id: {
    type: mongoose.Schema.Types.ObjectId,  // GridFS file ID (for paid books)
    trim: true,
  },
  book_isPaid: {
    type: Boolean,
    default: false,
  },
  book_price: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

export default mongoose.model("Book", bookSchema);
