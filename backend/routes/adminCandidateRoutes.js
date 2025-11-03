import express from "express";
import multer from "multer";
import Candidate from "../models/Candidate.js";
import authMiddleware from "../middleware/authMiddleware.js"; // JWT auth

const router = express.Router();

// --------------------
// Multer config
// --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

// --------------------
// POST /api/admin/candidates
// --------------------
router.post("/", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    // Only admin can add candidates
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { name, position, department, yearOfStudy, bio } = req.body;

    // Required fields check
    if (!name || !position || !department || !yearOfStudy) {
      return res.status(400).json({ message: "Name, position, department, and yearOfStudy are required" });
    }

    // Photo URL (optional)
    const photoUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : "";

    const candidate = new Candidate({
      name,
      position,
      department,
      yearOfStudy,
      bio: bio || "",
      photo: photoUrl,
    });

    await candidate.save();

    res.json({ message: "Candidate added successfully", candidate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while adding candidate" });
  }
});

export default router;
