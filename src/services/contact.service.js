import Contact from "../models/contact.model.js";

const getContactMessages = async () => {
  return await Contact.find({}).sort({ createdAt: -1 });
};

const submitContactForm = async (name, email, message) => {
  await Contact.create({ name, email, message });
};

export default { getContactMessages, submitContactForm };