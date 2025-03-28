import userControllers from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const userRoutes = (api) => {
  api.get('/user/profile', verifyToken, userControllers.getUserProfile);
  api.get('/user/books', verifyToken, userControllers.getUserBooks);

  api.post('/user/book/:bookId/like', verifyToken, userControllers.likeBook);
  api.post('/user/book/:bookId/bookmark', verifyToken, userControllers.bookmarkBook);
  api.post('/user/book/:bookId/rate', verifyToken, userControllers.rateBook);

  api.put('/user/update', verifyToken, userControllers.updateUserProfile);
}

export default userRoutes;