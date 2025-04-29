// Import
import mongoose from "mongoose";

// Create Project Schema
const ProjectSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    techStack: {
      type: [String],
    },
    liveUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    projectImage: {
      type: String,
    },
    role: {
      type: String,
    },
    duration: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
    },
  },
  { timestamps: true }
);

// Project
const Project = mongoose.model("Project", ProjectSchema);

export default Project;
