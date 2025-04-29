// Import
import jwt from "jsonwebtoken";
import { ErrorHandler } from "./errorHandler.js";

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return next(new ErrorHandler("Unauthorized: No token provided", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new ErrorHandler("Unauthorized: Invalid token", 401));
    }
    req.user = decoded.id;
    next();
  } catch (error) {
    return next(new ErrorHandler("Unauthorized: Invalid token", 401));
  }
};

// Export
export default authMiddleware;
