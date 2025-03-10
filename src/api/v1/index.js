import express from 'express';

// auth routes import
import authRoutes from './auth.routes.js';

export const createApi = () => {
  const api = express.Router();

  // auth routes
  authRoutes(api);

  return api;
};