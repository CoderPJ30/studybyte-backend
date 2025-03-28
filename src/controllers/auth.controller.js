import authSerivce from "../services/auth.serivce.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const { data, token } = await authSerivce.register({ fullName, email, password });
    successResponse({ res, data, token, message: "User registered successfully" });
  } catch (error) {
    errorResponse(req, res, error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, token } = await authSerivce.login({ email, password });
    successResponse({ res, data, token, message: "User logged in successfully" });
  } catch (error) {
    errorResponse(req, res, error);
  }
};

export default { register, login };