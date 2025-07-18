import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    // User ID
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Personal Details
    personalDetails: {
      name: { type: String, required: true },
      title: { type: String, required: true },
      summary: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String },
      website: { type: String },
      github: { type: String },
      linkedin: { type: String },
    },

    // Skills
    skills: [
      {
        type: String,
      },
    ],

    // Education
    education: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        startYear: { type: String, required: true },
        endYear: { type: String, required: true },
        grade: { type: String }, // Optional
      },
    ],

    // Work Experience
    experience: [
      {
        company: { type: String, required: true },
        position: { type: String, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],

    // Projects
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        link: { type: String },
        technologies: [String],
      },
    ],

    // Certifications
    certifications: [
      {
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        year: { type: String, required: true },
      },
    ],

    // Languages
    languages: [
      {
        name: { type: String, required: true },
        proficiency: { type: String, required: true },
      },
    ],

    // Interests
    interests: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Resume", resumeSchema);
