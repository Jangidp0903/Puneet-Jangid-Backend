// Import
import express from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectCount,
  getSingleProject,
  updateProject,
} from "../controller/project.Controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadProjects } from "../middleware/uploadMiddleware.js";

// Router
const projectRouter = express.Router();

// Create Project
projectRouter.post("/create", authMiddleware, uploadProjects, createProject);

// Get All Projects
projectRouter.get("/all", getAllProjects);

// Get Single Project
projectRouter.get("/single/:id", getSingleProject);

// Update Project
projectRouter.patch(
  "/update/:id",
  authMiddleware,
  uploadProjects,
  updateProject
);

// Delete Project
projectRouter.delete("/delete/:id", authMiddleware, deleteProject);

// Project Count
projectRouter.get("/count", authMiddleware, getProjectCount);

// Export
export default projectRouter;
