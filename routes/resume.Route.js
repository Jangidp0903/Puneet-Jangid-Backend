// Imports
import express from "express";
import dotenv from "dotenv";
import {
  createResume,
  getFullResume,
  getMyResume,
  updateResume,
} from "../controller/resume.Controller.js";
import { ErrorHandler } from "../middleware/errorHandler.js";

// Configure dotenv
dotenv.config();

// Create Router
const resumeRouter = express.Router();

// Secret Key from Environment
const SECRET_KEY = process.env.CLIENT_SECRET;

// Middleware: Verify Secret Key
const verifySecretKey = (req, res, next) => {
  const clientSecret = req.headers["x-client-secret"];
  if (!clientSecret || clientSecret !== SECRET_KEY) {
    return next(new ErrorHandler("Access denied. Invalid secret key.", 403));
  }
  next();
};

// Create Resume
resumeRouter.post("/create-resume", verifySecretKey, createResume);

// Update Resume
resumeRouter.patch("/update-resume", verifySecretKey, updateResume);

// Get Resume
resumeRouter.get("/get-resume", verifySecretKey, getMyResume);

// Get Full Resume
resumeRouter.get("/get-full-resume/:userId", verifySecretKey, getFullResume);

// Export Router
export default resumeRouter;
