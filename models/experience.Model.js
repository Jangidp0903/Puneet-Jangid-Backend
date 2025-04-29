// Import
import mongoose from "mongoose";

// Create Experience Schema
const ExperienceSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    company: {
      type: String,
    },
    position: {
      type: String,
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Freelance", "Contract"],
      default: "Full-time",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
    },
    technologies: [
      {
        type: String,
      },
    ],
    achievements: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

// Experience
const Experience = mongoose.model("Experience", ExperienceSchema);

export default Experience;
