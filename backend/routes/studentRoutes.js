import express from "express";
import Student from "../models/Student.js";
import bcrypt from "bcryptjs"; // if you are hashing passwords (optional)

const router = express.Router();

// ----------------------
// Student Registration (for demo or signup)
// ----------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, department, year } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists." });
    }

    // Hash password (optional)
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      department,
      year,
    });

    res.status(201).json({ message: "Student registered successfully.", student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error registering student." });
  }
});

// ----------------------
// Student Login
// ----------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // If passwords are hashed
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    // ✅ Return student data (frontend will save it)
    res.status(200).json({ message: "Login successful.", student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error logging in student." });
  }
});

export default router;
