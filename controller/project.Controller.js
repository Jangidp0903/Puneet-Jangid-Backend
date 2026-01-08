// Import
import Project from "../models/project.Model.js";
import { ErrorHandler } from "../middleware/errorHandler.js";

// Create Project Controller
export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      techStack,
      liveUrl,
      githubUrl,
      category,
      duration,
      role,
    } = req.body;

    // Normalize githubUrl to array
    const githubUrls = Array.isArray(githubUrl)
      ? githubUrl
      : githubUrl
      ? [githubUrl]
      : [];

    const project = await Project.create({
      title,
      description,
      techStack,
      liveUrl,
      githubUrl: githubUrls,
      projectImage: req.files.projectImage[0].path,
      category,
      duration,
      role,
      userId: req.user,
    });
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Projects Controller
export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    if (!projects) {
      return next(new ErrorHandler("No projects found", 404));
    }
    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Project Controller
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(new ErrorHandler("Project not found", 404));
    }
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update Project Controller
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(new ErrorHandler("Project not found", 404));
    }

    // Handle all fields that can be updated
    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.techStack = req.body.techStack || project.techStack;
    project.liveUrl = req.body.liveUrl || project.liveUrl;
    project.role = req.body.role || project.role;
    project.category = req.body.category || project.category;
    project.duration = req.body.duration || project.duration;

    // Handle githubUrl - normalize to array if updated
    if (req.body.githubUrl !== undefined) {
      const githubUrls = Array.isArray(req.body.githubUrl)
        ? req.body.githubUrl
        : req.body.githubUrl
        ? [req.body.githubUrl]
        : [];
      project.githubUrl = githubUrls;
    }

    // Handle featured status - check if it's explicitly set in the request
    if (req.body.featured !== undefined) {
      project.featured = req.body.featured;
    }

    // Update image only if uploaded
    if (req.files?.projectImage?.[0]) {
      project.projectImage = req.files.projectImage[0].path;
    }

    await project.save();
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Project Controller
export const getSingleProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(new ErrorHandler("Project not found", 404));
    }
    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectCount = async (req, res, next) => {
  try {
    const count = await Project.countDocuments({ userId: req.user });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    next(error);
  }
};
