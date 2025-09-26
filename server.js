// 1. Load Environment Variables
import dotenv from "dotenv";
dotenv.config();

// 2. Import Dependencies
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// 3. Import Custom Modules
import connectDB from "./config/DB.js";
import userRouter from "./routes/user.Routes.js";
import { errorMiddleware } from "./middleware/errorHandler.js";
import skillRouter from "./routes/skill.Route.js";
import socialRouter from "./routes/social.Route.js";
import educationRouter from "./routes/education.Route.js";
import experienceRouter from "./routes/experience.Route.js";
import contactRouter from "./routes/contact.Route.js";
import projectRouter from "./routes/project.Route.js";
import resumeRouter from "./routes/resume.Route.js";

// 4. Initialize App
const app = express();

// 5. CORS Configuration
const allowedOrigins = [
  process.env.DASHBOARD_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);
const corsOptions = {
  origin: function (origin, callback) {
    // allow non-browser requests (Postman, server-to-server) when origin is undefined
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS not allowed by server"), false);
  },
  credentials: true,
};

// 6. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// 7. Routes
app.use("/api/user", userRouter);
app.use("/api/skill", skillRouter);
app.use("/api/social", socialRouter);
app.use("/api/education", educationRouter);
app.use("/api/experience", experienceRouter);
app.use("/api/contact", contactRouter);
app.use("/api/project", projectRouter);
app.use("/api/resume", resumeRouter);

app.use(errorMiddleware);

// 8. Port and Server Start
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server Started on Local Port : ${PORT}`)
    );
  })
  .catch((err) => console.log(err));
