import Student from "../models/Student.js";
import Candidate from "../models/Candidate.js";

// Get all candidates
export const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cast vote
export const castVote = async (req, res) => {
  const { studentId, candidateId } = req.body;
  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (student.hasVoted) return res.status(400).json({ message: "You have already voted" });

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    student.hasVoted = true;
    candidate.votes += 1;

    await student.save();
    await candidate.save();

    res.json({ message: `Vote cast for ${candidate.name}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
