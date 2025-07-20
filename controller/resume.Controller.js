// Imports
import Resume from "../models/resume.Model.js";
import { ErrorHandler } from "../middleware/errorHandler.js";
import dotenv from "dotenv";
dotenv.config();

// User ID
const PUNEET_USER_ID = process.env.PUNEET_USER_ID;

// Create Resume
export const createResume = async (req, res, next) => {
  try {
    const userId = PUNEET_USER_ID;

    const existingResume = await Resume.findOne({ userId });
    if (existingResume) {
      return next(new ErrorHandler("Resume already exists", 400));
    }

    const newResume = new Resume({
      userId,
      ...req.body,
    });

    const savedResume = await newResume.save();

    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      data: savedResume,
    });
  } catch (error) {
    next(error);
  }
};

// Update Resume
export const updateResume = async (req, res, next) => {
  try {
    const userId = PUNEET_USER_ID;

    const existingResume = await Resume.findOne({ userId });
    if (!existingResume) {
      return next(
        new ErrorHandler("No resume found. Please create one first.", 404)
      );
    }

    const updatedResume = await Resume.findOneAndUpdate({ userId }, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      data: updatedResume,
    });
  } catch (error) {
    next(error);
  }
};

// Get Resume
export const getMyResume = async (req, res, next) => {
  try {
    const userId = PUNEET_USER_ID;

    const resume = await Resume.findOne({ userId });
    if (!resume) {
      return next(new ErrorHandler("No resume found for this user.", 404));
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};
