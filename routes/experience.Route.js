// Import
import express from "express";
import {
  createExperience,
  deleteExperience,
  getAllExperiences,
  getSingleExperience,
  getTotalExperienceDuration,
  updateExperience,
} from "../controller/experience.Controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Router
const experienceRouter = express.Router();

// Create Experience
experienceRouter.post("/create", authMiddleware, createExperience);

// Get All Experiences
experienceRouter.get("/all", getAllExperiences);

// Delete Experience
experienceRouter.delete("/delete/:id", authMiddleware, deleteExperience);

// Update Experience
experienceRouter.patch("/update/:id", authMiddleware, updateExperience);

// Get Single Experience
experienceRouter.get("/single/:id", getSingleExperience);

// Experience Duration Count
experienceRouter.get("/duration", authMiddleware, getTotalExperienceDuration);

// Export
export default experienceRouter;
