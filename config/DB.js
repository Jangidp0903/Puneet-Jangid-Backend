// Import
import mongoose from "mongoose";

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(`Failed to connect to database ${error}`);
    process.exit(1);
  }
};

// Export
export default connectDB;
