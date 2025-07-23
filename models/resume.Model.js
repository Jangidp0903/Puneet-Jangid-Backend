// Import
import mongoose from "mongoose";

// Create Resume Schema
const resumeSchema = new mongoose.Schema(
  {
    // Link to the user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Personal Details
    personalDetails: {
      fullName: { type: String },
      title: { type: String },
      summary: { type: String },
      email: { type: String },
      phone: { type: String },
      address: { type: String },
      github: { type: String },
      linkedin: { type: String },
      portfolioUrl: { type: String },
    },

    // Skills
    skills: [
      {
        category: { type: String }, // e.g., frontend
        name: { type: String }, // e.g., JavaScript
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
        },
      },
    ],

    // Education
    education: [
      {
        degree: { type: String }, // e.g., BCA
        institution: { type: String },
        startDate: { type: Date },
        endDate: { type: Date }, // nullable for ongoing
        grade: { type: String },
        description: { type: String },
      },
    ],

    // Work Experience
    experience: [
      {
        company: { type: String },
        position: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        location: { type: String },
        description: { type: String },
        achievements: [String],
      },
    ],

    // Projects
    projects: [
      {
        title: { type: String },
        description: { type: String },
        link: { type: String },
        technologies: [String],
      },
    ],

    // Certifications
    certifications: [
      {
        name: { type: String },
        issuer: { type: String },
        date: { type: Date },
      },
    ],

    // Awards & Achievements
    awards: [
      {
        title: { type: String },
        issuer: { type: String },
        date: { type: Date },
        description: { type: String },
      },
    ],

    // Languages
    languages: [
      {
        name: { type: String }, // e.g., English
        proficiency: {
          type: String,
          enum: ["Beginner", "Intermediate", "Fluent", "Native"],
        },
      },
    ],

    // Interests / Hobbies
    interests: [
      {
        name: { type: String }, // e.g., Photography
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Resume
const Resume = mongoose.model("Resume", resumeSchema);

// Export
export default Resume;
