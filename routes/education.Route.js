// Import
import express from "express";
import {
  createEducation,
  deleteEducation,
  getAllEducations,
} from "../controller/education.Controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Router
const educationRouter = express.Router();

// Create Education
educationRouter.post("/create", authMiddleware, createEducation);

// Get All Educations
educationRouter.get("/all", getAllEducations);

// Delete Education
educationRouter.delete("/delete/:id", authMiddleware, deleteEducation);

// Export
export default educationRouter;
