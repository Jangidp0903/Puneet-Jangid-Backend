// Import
import jwt from 'jsonwebtoken';
import { ErrorHandler } from './errorHandler.js';

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return next(new ErrorHandler('No access token. Redirect to login or refresh', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (!decoded) {
      return next(new ErrorHandler('Unauthorized: Invalid token', 401));
    }
    req.user = decoded.id;
    next();
  } catch {
    return next(new ErrorHandler('Access token invalid/expired.', 401));
  }
};

// Export
export default authMiddleware;
