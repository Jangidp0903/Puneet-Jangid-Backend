// Import
import mongoose from "mongoose";

// Create Social Schema
const SocialSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    platform: {
      type: String,
    },
    link: {
      type: String,
    },
  },
  { timestamps: true }
);

// Social
const Social = mongoose.model("Social", SocialSchema);

export default Social;
