export const addCandidate = async (req, res) => {
  const { name, university, school, department, year, position, photo } = req.body;

  // Validate photo URL if provided
  const isValidImageUrl = (url) => /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i.test(url);

  if (photo && !isValidImageUrl(photo)) {
    return res.status(400).json({ message: "Invalid photo URL. Must be a valid image URL." });
  }

  try {
    const existing = await Candidate.findOne({ name });
    if (existing) return res.status(400).json({ message: "Candidate already exists" });

    const candidate = new Candidate({ name, university, school, department, year, position, photo });
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
