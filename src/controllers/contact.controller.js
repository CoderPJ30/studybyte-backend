import contactService from "../services/contact.service.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const getContactMessages = async (req, res) => {
  try {
    const messages = await contactService.getContactMessages();
    successResponse({ res, data: messages, message: "Contact messages fetched successfully." });
  } catch (error) {
    errorResponse(req, res, error);
  }
};

const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await contactService.submitContactForm(name, email, message);
    successResponse({ res, message: "Contact form submitted successfully." });
  } catch (error) {
    errorResponse(req, res, error);
  }
};

export default { getContactMessages, submitContactForm };