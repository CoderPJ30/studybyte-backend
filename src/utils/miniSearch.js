import MiniSearch from "minisearch";
import Book from "../models/book.model.js";

const miniSearch = new MiniSearch({
  fields: ["book_title", "book_author", "book_genre"],
  storeFields: ["_id", "book_title", "book_author", "book_genre", "book_cover"],
  idField: "_id",
});

const loadBooks = async () => {
  try {
    const books = await Book.find({}, "_id book_title book_author book_genre book_cover");
    miniSearch.removeAll(); // Clear previous index
    miniSearch.addAll(books.map(book => book.toObject())); // Add books to index
  } catch (error) {
    console.error("Error loading books into MiniSearch:", error);
  }
};

export { miniSearch, loadBooks };
