import userControllers from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const userRoutes = (api) => {
  api.get('/user/profile', verifyToken, userControllers.getUserProfile);
  api.get('/user/books', verifyToken, userControllers.getUserBooks);
  api.get('/user/cart', verifyToken, userControllers.getUserCart);

  api.post('/user/book/:bookId/like', verifyToken, userControllers.likeBook);
  api.post('/user/book/:bookId/bookmark', verifyToken, userControllers.bookmarkBook);
  api.post('/user/book/:bookId/rate', verifyToken, userControllers.rateBook);
  api.post('/user/cart/book/:bookId', verifyToken, userControllers.addBookToCart);

  api.put('/user/update', verifyToken, userControllers.updateUserProfile);

  api.delete('/user/cart/book/:bookId', verifyToken, userControllers.removeBookFromCart);
}

export default userRoutes;