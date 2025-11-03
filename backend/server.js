// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Database
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";        // Student registration/login
import voteRoutes from "./routes/voteRoutes.js";        // Voting routes
import adminRoutes from "./routes/adminRoutes.js";      // Admin login
import candidateRoutes from "./routes/candidateRoutes.js"; // Candidate management

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// ✅ MIDDLEWARES
app.use(cors());
app.use(express.json()); // 👈 Required to fix "Candidate validation failed"

// Handle static uploads folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve uploaded files (images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ ROUTES
app.use("/api/auth", authRoutes);               // Student auth
app.use("/api/votes", voteRoutes);              // Voting system
app.use("/api/admin", adminRoutes);             // Admin login
app.use("/api/candidates", candidateRoutes);    // Candidate registration & management

// ✅ DEFAULT ROUTE
app.get("/", (req, res) => {
  res.send("🎉 University Voting System Backend is running...");
});

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT} - server.js:51`)
);
