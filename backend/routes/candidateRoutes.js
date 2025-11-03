import express from "express";
import Candidate from "../models/Candidate.js";

const router = express.Router();

// Helper function to validate image URL
const isValidImageUrl = (url) => {
  return /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

// ----------------------
// Register a candidate
// POST /api/candidates/register
// ----------------------
router.post("/register", async (req, res) => {
  try {
    const { name, position, department, yearOfStudy, manifesto, photo } = req.body;

    // Validate photo URL if provided
    if (photo && !isValidImageUrl(photo)) {
      return res.status(400).json({ message: "Invalid photo URL. Must be a valid image URL." });
    }

    const candidate = new Candidate({
      name,
      position,
      department,
      yearOfStudy,
      manifesto,
      photo,
    });

    await candidate.save();
    res.status(201).json({ message: "Candidate registered successfully", candidate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ----------------------
// Get all candidates
// GET /api/candidates
// ----------------------
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------
// Get a candidate by ID
// GET /api/candidates/:id
// ----------------------
router.get("/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
