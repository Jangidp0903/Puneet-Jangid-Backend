// Import
import mongoose from "mongoose";

// Create User Schema
const UserSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
    },
    designation: {
      type: String,
    },
    aboutMe: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    resume: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// User Model
const User = mongoose.model("User", UserSchema);

// Export
export default User;
