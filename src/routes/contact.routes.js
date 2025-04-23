import contactControllers from '../controllers/contact.controller.js';
import { verifyToken, roleValidator } from '../middlewares/auth.middleware.js';

const contactRoutes = (api) => {
  api.get('/contact', verifyToken, roleValidator(['admin']), contactControllers.getContactMessages);

  api.post('/contact', verifyToken, contactControllers.submitContactForm);
}

export default contactRoutes;