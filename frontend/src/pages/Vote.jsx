import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const Vote = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const navigate = useNavigate();

  const student = JSON.parse(localStorage.getItem("student"));

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await API.get("/votes/candidates");
        setCandidates(res.data);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to load candidates");
      }
    };
    fetchCandidates();
  }, []);

  const handleVote = async () => {
    if (!selectedCandidate) return alert("Select a candidate to vote");
    try {
      await API.post("/votes/cast", {
        studentId: student.id,
        candidateId: selectedCandidate
      });
      alert("Vote cast successfully");
      navigate("/student/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Voting failed");
    }
  };

  return (
    <div className="container">
      <h1>Cast Your Vote</h1>
      {candidates.length === 0 ? (
        <p>Loading candidates...</p>
      ) : (
        <ul>
          {candidates.map(c => (
            <li key={c._id}>
              <label>
                <input
                  type="radio"
                  name="candidate"
                  value={c._id}
                  onChange={e => setSelectedCandidate(e.target.value)}
                />
                {c.name} ({c.votes} votes)
              </label>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleVote}>Submit Vote</button>
    </div>
  );
};

export default Vote;
