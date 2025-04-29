// Import
import mongoose from "mongoose";

// Create Education Schema
const EducationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    school: {
      type: String,
    },
    degree: {
      type: String,
    },
    fieldOfStudy: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    grade: {
      type: String,
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

// Education Model
const Education = mongoose.model("Education", EducationSchema);

export default Education;
