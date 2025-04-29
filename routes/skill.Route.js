// Import
import express from "express";
import { uploadSkills } from "../middleware/uploadMiddleware.js";
import {
  createSkill,
  deleteSkill,
  getAllSkills,
  getSkillsCount,
  updateSkill,
} from "../controller/skill.Controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Router
const skillRouter = express.Router();

// Create Skill
skillRouter.post("/create", authMiddleware, uploadSkills, createSkill);

// Get All Skills
skillRouter.get("/all", getAllSkills);

// Update Skill
skillRouter.patch("/update/:id", uploadSkills, updateSkill);

// Delete Skill
skillRouter.delete("/delete/:id", deleteSkill);

// Skill Count
skillRouter.get("/count", authMiddleware, getSkillsCount);

// Export
export default skillRouter;
