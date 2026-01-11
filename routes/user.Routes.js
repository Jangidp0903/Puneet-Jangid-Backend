// Import
import express from "express";
import {
  forgotPassword,
  getUser,
  loginUser,
  logoutUser,
  refreshToken,
  resetPassword,
  updatePassword,
  updateUser,
} from "../controller/user.Controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadUserAssets } from "../middleware/uploadMiddleware.js";

const userRouter = express.Router();

// Login User
userRouter.post("/login", loginUser);

// Logout User
userRouter.post("/logout", logoutUser);

// Refresh Token
userRouter.post("/refresh-token", refreshToken);

// Get User
userRouter.get("/me", getUser);

// Update Password
userRouter.patch("/update-password", authMiddleware, updatePassword);

// Update User
userRouter.patch("/update", authMiddleware, uploadUserAssets, updateUser);

// Forgot Password
userRouter.post("/forgot-password", forgotPassword);

// Reset Password
userRouter.put("/reset-password/:token", resetPassword);

// Export
export default userRouter;
