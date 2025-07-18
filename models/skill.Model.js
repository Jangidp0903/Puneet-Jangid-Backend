// Import
import mongoose from "mongoose";

// Create Skill Schema
const SkillSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    category: {
      type: String,
      enum: [
        "Frontend",
        "Backend",
        "Database",
        "DevOps",
        "Tools & Technologies",
      ],
    },
    proficiency: {
      type: String,
      enum: ["Beginner", "Intermediate", "Expert"],
    },
    yearsOfExperience: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Skill
const Skill = mongoose.model("Skill", SkillSchema);

// Export
export default Skill;
