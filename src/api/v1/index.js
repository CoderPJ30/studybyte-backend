import express from 'express';

// auth routes import
import authRoutes from '../../routes/auth.routes.js';

// book routes import
import bookRoutes from '../../routes/book.routes.js';

// user routes import
import userRoutes from '../../routes/user.routes.js';

const createApi = () => {
  const api = express.Router();

  // auth routes
  authRoutes(api);

  // book routes
  bookRoutes(api);

  // user routes
  userRoutes(api);

  return api;
};

export default createApi;