import Candidate from "../models/Candidate.js";

// Add a candidate
export const addCandidate = async (req, res) => {
  const { name } = req.body;
  try {
    const existing = await Candidate.findOne({ name });
    if (existing) return res.status(400).json({ message: "Candidate already exists" });

    const candidate = new Candidate({ name });
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all candidates
export const getCandidatesAdmin = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a candidate
export const deleteCandidate = async (req, res) => {
  const { id } = req.params;
  try {
    await Candidate.findByIdAndDelete(id);
    res.json({ message: "Candidate deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update candidate
export const updateCandidate = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Candidate.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Candidate not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

