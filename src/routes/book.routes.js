import bookController from '../controllers/book.controller.js';
import { verifyToken, roleValidator, upload } from '../middlewares/index.js';

const bookRoutes = (app) => {
  app.get('/books', verifyToken, bookController.getBooks);
  app.get('/books/all', verifyToken, bookController.getAllBooks);
  app.get('/books/search', verifyToken, bookController.searchBooks);
  app.get('/books/:id', verifyToken, bookController.getBookById);
  app.get('/books/user-section/:section', verifyToken, bookController.getUserBooksBySection);
  app.get('/books/:id/read', verifyToken, bookController.readBook);

  app.post('/books/ids', verifyToken, bookController.getBooksByIds);
  app.post('/books/upload',
    verifyToken,
    roleValidator(["admin"]),
    upload.fields([{ name: "cover", maxCount: 1 }, { name: "file", maxCount: 1 }]),
    bookController.uploadBook
  );

  app.put('/books/update/:id', verifyToken, roleValidator(["admin"]), bookController.updateBook);

  app.delete('/books/:id', verifyToken, roleValidator(["admin"]), bookController.deleteBook);
};

export default bookRoutes;