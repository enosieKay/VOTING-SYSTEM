import React, { useEffect, useState } from "react";
import axios from "../api/api"; // your axios instance

const StudentDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState("");

  // Fetch candidates from backend
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/candidates"); // assumes /api/candidates in server.js
      setCandidates(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch candidates.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleVote = async (candidateId) => {
    try {
      // Replace with actual studentId (e.g., from auth context or localStorage)
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        setError("Student ID not found. Please login.");
        return;
      }

      await axios.post("/vote", { studentId, candidateId });
      setVoted(true);
      alert("Vote recorded successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to vote.");
    }
  };

  if (loading) return <p>Loading candidates...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Student Dashboard</h1>
      {candidates.length === 0 ? (
        <p>No candidates available.</p>
      ) : (
        <ul>
          {candidates.map((candidate) => (
            <li key={candidate._id} style={{ marginBottom: "10px" }}>
              <strong>{candidate.name}</strong> - {candidate.position} (
              {candidate.department}, Year {candidate.yearOfStudy})
              <br />
              <button
                onClick={() => handleVote(candidate._id)}
                disabled={voted}
                style={{ marginTop: "5px" }}
              >
                {voted ? "Voted" : "Vote"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentDashboard;
