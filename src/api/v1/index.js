import express from 'express';

// auth routes import
import authRoutes from '../../routes/auth.routes.js';

const createApi = () => {
  const api = express.Router();

  // auth routes
  authRoutes(api);

  return api;
};

export default createApi;