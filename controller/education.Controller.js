// Import
import Education from "../models/education.Model.js";
import { ErrorHandler } from "../middleware/errorHandler.js";

// Create Education
export const createEducation = async (req, res, next) => {
  try {
    const {
      school,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      location,
      grade,
    } = req.body;
    const education = await Education.create({
      userId: req.user,
      school,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      location,
      grade,
    });
    res.status(201).json({
      success: true,
      message: "Education created successfully",
      education,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Educations
export const getAllEducations = async (req, res, next) => {
  try {
    const educations = await Education.find({}).sort({ createdAt: -1 });
    if (!educations) {
      return next(new ErrorHandler("No educations found", 404));
    }
    res.status(200).json({
      success: true,
      educations,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Education
export const deleteEducation = async (req, res, next) => {
  try {
    const education = await Education.findById(req.params.id);
    if (!education) {
      return next(new ErrorHandler("Education not found", 404));
    }
    await Education.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
