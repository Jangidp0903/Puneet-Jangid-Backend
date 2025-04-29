// Import
import Social from "../models/social.Model.js";
import { ErrorHandler } from "../middleware/errorHandler.js";

// Create Social
export const createSocial = async (req, res, next) => {
  try {
    const { platform, link } = req.body;
    const social = await Social.create({ userId: req.user, platform, link });
    res.status(201).json({
      success: true,
      message: "Social created successfully",
      social,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Socials
export const getAllSocials = async (req, res, next) => {
  try {
    const socials = await Social.find({});
    if (!socials) {
      return next(new ErrorHandler("No socials found", 404));
    }
    res.status(200).json({
      success: true,
      socials,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Social
export const deleteSocial = async (req, res, next) => {
  try {
    const social = await Social.findById(req.params.id);
    if (!social) {
      return next(new ErrorHandler("Social not found", 404));
    }
    await Social.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Social deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
