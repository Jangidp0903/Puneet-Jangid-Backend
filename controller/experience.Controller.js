// Import
import Experience from "../models/experience.Model.js";
import { ErrorHandler } from "../middleware/errorHandler.js";

// Create Experience
export const createExperience = async (req, res, next) => {
  try {
    const {
      company,
      position,
      employmentType,
      startDate,
      endDate,
      isCurrent,
      location,
      technologies,
      achievements,
      description,
    } = req.body;
    const experience = await Experience.create({
      userId: req.user,
      company,
      position,
      employmentType,
      startDate,
      endDate,
      isCurrent,
      location,
      technologies,
      achievements,
      description,
    });
    res.status(201).json({
      success: true,
      message: "Experience created successfully",
      experience,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Experiences
export const getAllExperiences = async (req, res, next) => {
  try {
    const experiences = await Experience.find({});
    if (!experiences) {
      return next(new ErrorHandler("No experiences found", 404));
    }
    res.status(200).json({
      success: true,
      experiences,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Experience
export const deleteExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return next(new ErrorHandler("Experience not found", 404));
    }
    await Experience.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update Experience
export const updateExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return next(new ErrorHandler("Experience not found", 404));
    }
    experience.company = req.body.company || experience.company;
    experience.position = req.body.position || experience.position;
    experience.employmentType =
      req.body.employmentType || experience.employmentType;
    experience.startDate = req.body.startDate || experience.startDate;
    experience.endDate = req.body.endDate || experience.endDate;
    experience.isCurrent =
      req.body.isCurrent !== undefined
        ? req.body.isCurrent
        : experience.isCurrent;
    experience.location = req.body.location || experience.location;
    experience.technologies = req.body.technologies || experience.technologies;
    experience.achievements = req.body.achievements || experience.achievements;
    experience.description = req.body.description || experience.description;
    await experience.save();
    res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      experience,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Experience Controller
export const getSingleExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return next(new ErrorHandler("Experience not found", 404));
    }
    res.status(200).json({
      success: true,
      experience,
    });
  } catch (error) {
    next(error);
  }
};

// Get Total Experience Duration Count
// Get Total Experience Duration Count
export const getTotalExperienceDuration = async (req, res, next) => {
  try {
    const experiences = await Experience.find({ userId: req.user });

    if (!experiences || experiences.length === 0) {
      return res.status(200).json({
        success: true,
        totalMonths: 0,
        totalYears: 0,
        formattedExperience: "0 months",
        message: "No experience records found",
      });
    }

    let totalMonths = 0;

    experiences.forEach((exp) => {
      const startDate = new Date(exp.startDate);
      // Use current date for current positions, otherwise use the end date
      const endDate = exp.isCurrent ? new Date() : new Date(exp.endDate);

      // Calculate difference in months
      const monthDiff =
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());

      totalMonths += monthDiff;
    });

    // Convert to years and months for better readability
    const totalYears = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;

    // Format experience based on years and months
    let formattedExperience = "";
    if (totalYears > 0) {
      formattedExperience = `${totalYears} years`;
    } else {
      formattedExperience = `${remainingMonths} months`;
    }

    res.status(200).json({
      success: true,
      totalMonths,
      totalYears,
      remainingMonths,
      formattedExperience,
    });
  } catch (error) {
    next(error);
  }
};
