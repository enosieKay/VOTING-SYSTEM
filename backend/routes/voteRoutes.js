import express from "express";
import Vote from "../models/Vote.js";
import Candidate from "../models/Candidate.js";
import Student from "../models/Student.js";

const router = express.Router();

// ----------------------
// DEMO: Create sample candidates and students
// ----------------------
router.post("/demo-setup", async (req, res) => {
  try {
    // Prevent duplicates
    const existingStudents = await Student.find();
    const existingCandidates = await Candidate.find();

    if (existingStudents.length > 0 || existingCandidates.length > 0) {
      return res.status(400).json({ message: "Demo data already exists." });
    }

    // Create demo students
    const students = await Student.insertMany([
      { name: "Alice", department: "Computer Science", year: 2 },
      { name: "Bob", department: "Mathematics", year: 3 },
      { name: "Charlie", department: "Engineering", year: 1 },
    ]);

    // Create demo candidates
    const candidates = await Candidate.insertMany([
      { name: "John Doe", position: "President", department: "Computer Science", yearOfStudy: 2 },
      { name: "Jane Smith", position: "Vice President", department: "Mathematics", yearOfStudy: 3 },
    ]);

    res.status(201).json({ message: "Demo setup complete.", students, candidates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during demo setup." });
  }
});

// ----------------------
// GET all candidates
// ----------------------
router.get("/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    if (!candidates || candidates.length === 0) {
      return res.status(200).json({ message: "No candidates available yet." });
    }
    res.status(200).json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching candidates." });
  }
});

// ----------------------
// CAST A VOTE
// ----------------------
router.post("/vote", async (req, res) => {
  try {
    const { studentId, candidateId } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found." });

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: "Candidate not found." });

    const existingVote = await Vote.findOne({ student: studentId });
    if (existingVote) return res.status(400).json({ message: "Student has already voted." });

    const vote = await Vote.create({ student: studentId, candidate: candidateId });
    res.status(201).json({ message: "Vote cast successfully.", vote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error casting vote." });
  }
});

// ----------------------
// GET votes for a candidate
// ----------------------
router.get("/votes/:candidateId", async (req, res) => {
  try {
    const { candidateId } = req.params;
    const votes = await Vote.find({ candidate: candidateId }).populate("student", "name department year");
    res.status(200).json({ candidateId, totalVotes: votes.length, votes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching votes." });
  }
});

export default router; // ✅ Must export router, not StudentDashboard
