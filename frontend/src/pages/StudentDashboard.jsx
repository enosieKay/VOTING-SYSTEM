import React, { useState, useEffect } from "react";
import axios from "axios";

export default function StudentDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votedCandidateId, setVotedCandidateId] = useState(null);

  // Get logged-in student from localStorage
  const student = JSON.parse(localStorage.getItem("student"));
  const studentId = student?.id; // use "id" as returned from backend

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/votes/candidates");
      setCandidates(res.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (candidateId) => {
    if (!studentId) {
      alert("You must be logged in to vote!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/votes/vote", {
        studentId,
        candidateId,
      });

      alert(res.data.message);
      setVotedCandidateId(candidateId);
    } catch (error) {
      console.error("Error casting vote:", error);
      alert(error.response?.data?.message || "Error casting vote");
    }
  };

  if (loading) return <p>Loading candidates...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎓 Student Dashboard</h1>
      <h3>Welcome, {student?.name || "Student"} 👋</h3>
      <h2 style={{ marginTop: "1rem" }}>Available Candidates</h2>

      {candidates.length === 0 ? (
        <p>No candidates available.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {candidates.map((c) => (
            <li
              key={c._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "1rem",
                marginBottom: "1rem",
                background: "#f9f9f9",
              }}
            >
              <strong>{c.name}</strong> — {c.position} <br />
              Department: {c.department}, Year {c.yearOfStudy}
              <br />
              {votedCandidateId === c._id ? (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  ✅ You voted for this candidate
                </span>
              ) : (
                <button onClick={() => castVote(c._id)}>Vote</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
