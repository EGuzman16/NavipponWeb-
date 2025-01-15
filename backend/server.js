import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url"; // For ES module __dirname resolution
import connectDB from "./config/db.js";
import cors from "cors";
import {
  errorResponserHandler,
  invalidPathHandler,
} from "./middleware/errorHandler.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import userExperienceRoutes from "./routes/userExperienceRoutes.js";
import userPostRoutes from "./routes/userPostRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import postCategoriesRoutes from "./routes/postCategoriesRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";

dotenv.config();
connectDB();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3001", // Frontend URL
  methods: "GET, POST, PUT, DELETE", // Allowed methods
  allowedHeaders: "Content-Type, Authorization", // Allowed headers
};
app.use(cors(corsOptions)); // Enable CORS with configuration

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/user-experiences", userExperienceRoutes);
app.use("/api/user-posts", userPostRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/post-categories", postCategoriesRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/itineraries", itineraryRoutes);

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(invalidPathHandler);
app.use(errorResponserHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`El servidor está corriendo en puerto ${PORT}`));
