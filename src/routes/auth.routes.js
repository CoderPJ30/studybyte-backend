import authControllers from '../controllers/auth.controllers.js';

const authRoutes = (api) => {
  api.post('/auth/register', authControllers.register);
  api.post('/auth/login', authControllers.login);
}

export default authRoutes;