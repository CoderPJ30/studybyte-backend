import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/apiResponse.js";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return errorResponse(req, res, { type: "AUTH_NOT_FOUND" });

  const token = authHeader.split("Bearer ")[1];
  if (!token) return errorResponse(req, res, { type: "INVALID_TOKEN" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedData) => {
    if (err) {
      const errorType =
        err.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "INVALID_TOKEN";
      return errorResponse(req, res, { type: errorType });
    }

    req.user = decodedData;
    next();
  });
};

const roleValidator = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      return errorResponse(req, res, { type: "FORBIDDEN" });
    }
  }
}

export { verifyToken, roleValidator };
