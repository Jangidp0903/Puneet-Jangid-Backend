import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Cloudinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req, file) => {
    const folder = "Puneet-Jangid";

    const fileExtension = path.extname(file.originalname); // .pdf or .jpg etc
    const fileNameWithoutExt = path.basename(file.originalname, fileExtension);

    const isPDF = file.mimetype === "application/pdf";
    const resourceType = isPDF ? "raw" : "image"; // Ensure it's set as 'raw' for PDFs

    // fix: add extension manually for PDFs
    const publicId = isPDF
      ? `${file.fieldname}_${Date.now()}_${fileNameWithoutExt}${fileExtension}`
      : `${file.fieldname}_${Date.now()}_${fileNameWithoutExt}`;

    return {
      folder,
      public_id: publicId,
      resource_type: resourceType, // Ensure 'raw' is set for PDFs
      access_mode: "public", // This makes the file publicly accessible
    };
  },
});

// File Filter for Images and PDFs
const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith("image/");
  const isPDF = file.mimetype === "application/pdf";

  if (isImage || isPDF) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only images and PDFs are allowed!"),
      false
    );
  }
};

// Multer Setup
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// User Image and Resume Upload
export const uploadUserAssets = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);

// Project Image Upload
export const uploadProjects = upload.fields([
  { name: "projectImage", maxCount: 1 },
]);
