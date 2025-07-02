import express from "express";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import cors from "cors";
import cloudinary from "cloudinary"; // Import cloudinary for image deletion
import {
  errorResponserHandler,
  invalidPathHandler,
} from "./middleware/errorHandler.js";
import upload from "./middleware/uploadPictureMiddleware.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userExperienceRoutes from "./routes/userExperienceRoutes.js";
import userPostRoutes from "./routes/userPostRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import postCategoriesRoutes from "./routes/postCategoriesRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import importRoutes from "./routes/importRoutes.js";

dotenv.config();
connectDB();

const app = express();

// 🎯 CRITICAL: Railway needs PORT from environment
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 🌐 Updated CORS for Railway (includes production domains)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      // 🚀 Add Railway domains (update these after deployment)
      process.env.FRONTEND_URL,
      "https://your-app-name.railway.app", // Replace with your actual Railway URL
      // Add your custom domain when you set it up
      // "https://yourapp.com"
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
    optionsSuccessStatus: 200,
  })
);

// 🏠 Enhanced root route for Railway
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Travel Experience API is running!",
    status: "healthy",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    endpoints: {
      users: "/api/users",
      posts: "/api/posts",
      experiences: "/api/experiences",
      itineraries: "/api/itineraries",
      favorites: "/api/favorites",
      notifications: "/api/notifications",
      health: "/health",
    },
  });
});

// 📊 Health check endpoint for Railway monitoring
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
});

// 🛣️ API Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/user-experiences", userExperienceRoutes);
app.use("/api/user-posts", userPostRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/post-categories", postCategoriesRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/import", importRoutes);

// 📌 Upload Image Route
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    imageUrl: req.file.path,
    message: "Image uploaded successfully",
  });
});

// 🗺️ Google Places API Routes
const GOOGLE_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY || process.env.REACT_APP_GOOGLE_API_KEY;

app.get("/api/places", async (req, res) => {
  const { lat, lng } = req.query;

  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ error: "Google API key not configured" });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50&key=${GOOGLE_API_KEY}&language=es&region=jp`
    );

    if (!response.ok) {
      throw new Error(`Google API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching places:", error.message);
    res.status(500).json({ error: "Error fetching places" });
  }
});

app.get("/api/place-details", async (req, res) => {
  const { placeId } = req.query;

  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ error: "Google API key not configured" });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,price_level,address_components,editorial_summary&key=${GOOGLE_API_KEY}&language=es&region=jp`
    );

    if (!response.ok) {
      throw new Error(`Google API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching place details:", error.message);
    res.status(500).json({ error: "Error fetching place details" });
  }
});

// 📌 Enhanced Remove Image Route with better error handling
app.delete("/remove", async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: "No image URL provided" });
  }

  try {
    // Extract the public ID from Cloudinary URL
    const publicId = imageUrl.split("/").pop().split(".")[0];

    // Delete image from Cloudinary
    const result = await cloudinary.uploader.destroy(`uploads/${publicId}`);

    if (result.result === "ok") {
      res.json({ message: "Image deleted successfully" });
    } else {
      res.status(404).json({ error: "Image not found or already deleted" });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

// 📁 Serve static files in production (if you have a frontend build)
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // Catch-all handler for frontend routes (except API routes)
  app.get("*", (req, res) => {
    // Don't serve frontend for API routes
    if (req.originalUrl.startsWith("/api")) {
      return res
        .status(404)
        .json({ message: `API route ${req.originalUrl} not found` });
    }
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  });
}

// Error handling middleware
app.use(invalidPathHandler);
app.use(errorResponserHandler);

// 🚀 Start server with enhanced logging
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📡 API available at: http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);

  // Log important environment variables (without showing secrets)
  console.log(
    `🗄️  Database: ${
      process.env.MONGODB_URI ? "✅ Connected" : "❌ Not configured"
    }`
  );
  console.log(
    `☁️  Cloudinary: ${
      process.env.CLOUDINARY_CLOUD_NAME ? "✅ Configured" : "❌ Not configured"
    }`
  );
  console.log(
    `🗺️  Google Maps: ${GOOGLE_API_KEY ? "✅ Configured" : "❌ Not configured"}`
  );
});

export default app;
