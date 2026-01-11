// Import
import jwt from "jsonwebtoken";

// Generate Access Tokens
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1m",
  });
};

// Generate Refresh Tokens
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "2m",
  });
};
