import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinaryConfig.js"; // Import Cloudinary

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Folder name in Cloudinary
    format: async (req, file) => "jpg", // Convert all uploads to JPG
    public_id: (req, file) => Date.now() + "-" + file.originalname, // Unique file name
  },
});

const upload = multer({ storage });

export default upload;
