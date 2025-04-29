// Import
import express from "express";
import {
  createSocial,
  deleteSocial,
  getAllSocials,
} from "../controller/social.Controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Router
const socialRouter = express.Router();

// Create Social
socialRouter.post("/create", authMiddleware, createSocial);

// Get All Socials
socialRouter.get("/all", getAllSocials);

// Delete Social
socialRouter.delete("/delete/:id", authMiddleware, deleteSocial);

// Export
export default socialRouter;
