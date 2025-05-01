// import
import Skill from "../models/skill.Model.js";
import { ErrorHandler } from "../middleware/errorHandler.js";

// Create Skill
export const createSkill = async (req, res, next) => {
  try {
    const { name, category, proficiency, yearsOfExperience } = req.body;
    // Check for uploaded file
    if (!req.files || !req.files.skillImage || !req.files.skillImage[0]) {
      return next(new ErrorHandler("Skill image is required", 400));
    }
    const skill = await Skill.create({
      name,
      category,
      proficiency,
      yearsOfExperience,
      skillImage: req.files.skillImage[0].path,
      userId: req.user,
    });
    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      skill,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Skills
export const getAllSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find({}).sort({ createdAt: -1 });

    if (!skills) {
      return next(new ErrorHandler("No skills found", 404));
    }
    res.status(200).json({
      success: true,
      skills,
    });
  } catch (error) {
    next(error);
  }
};

// Update Skill
export const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return next(new ErrorHandler("Skill not found", 404));
    }
    skill.name = req.body.name || skill.name;
    skill.category = req.body.category || skill.category;
    skill.proficiency = req.body.proficiency || skill.proficiency;
    skill.yearsOfExperience =
      req.body.yearsOfExperience || skill.yearsOfExperience;

    // Update skillImage only if file is uploaded
    if (req.files?.skillImage?.[0]) {
      skill.skillImage = req.files.skillImage[0].path;
    }
    await skill.save();
    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Skill
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return next(new ErrorHandler("Skill not found", 404));
    }
    await Skill.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get Skills Count Controller
export const getSkillsCount = async (req, res, next) => {
  try {
    const count = await Skill.countDocuments({ userId: req.user });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    next(error);
  }
};
