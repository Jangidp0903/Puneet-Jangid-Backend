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

    // Helper to convert "DD-MM-YYYY" → Date object
    const convertDate = (dateStr) => {
      if (!dateStr || typeof dateStr !== "string") return null;
      const parts = dateStr.split("-");
      if (parts.length !== 3) return null;
      return new Date(parts.reverse().join("-")); // to YYYY-MM-DD
    };

    // Fix education dates
    if (Array.isArray(req.body.education)) {
      req.body.education = req.body.education.map((item) => ({
        ...item,
        startDate: convertDate(item.startDate),
        endDate: convertDate(item.endDate),
      }));
    }

    // Fix experience dates
    if (Array.isArray(req.body.experience)) {
      req.body.experience = req.body.experience.map((item) => ({
        ...item,
        startDate: convertDate(item.startDate),
        endDate: convertDate(item.endDate),
      }));
    }

    // Fix certifications dates
    if (Array.isArray(req.body.certifications)) {
      req.body.certifications = req.body.certifications.map((item) => ({
        ...item,
        date: convertDate(item.date),
      }));
    }

    // Fix awards dates
    if (Array.isArray(req.body.awards)) {
      req.body.awards = req.body.awards.map((item) => ({
        ...item,
        date: convertDate(item.date),
      }));
    }

    const updatedResume = await Resume.findOneAndUpdate(
      { userId },
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      }
    );

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

    // Find resume and return only personalDetails
    const resume = await Resume.findOne({ userId }, "personalDetails");

    if (!resume) {
      return next(new ErrorHandler("No resume found for this user.", 404));
    }

    res.status(200).json({
      success: true,
      data: resume.personalDetails,
    });
  } catch (error) {
    next(error);
  }
};

// Get full resume data
export const getFullResume = async (req, res, next) => {
  try {
    const { userId } = req.params;

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
