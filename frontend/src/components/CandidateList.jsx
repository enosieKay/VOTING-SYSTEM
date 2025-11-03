import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [selectedVotes, setSelectedVotes] = useState({});
  const navigate = useNavigate();

  // Fetch all candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/candidates");
        setCandidates(res.data);
      } catch (err) {
        console.error("Error fetching candidates:", err);
      }
    };
    fetchCandidates();
  }, []);

  // Group candidates by position
  const grouped = candidates.reduce((acc, c) => {
    acc[c.position] = acc[c.position] ? [...acc[c.position], c] : [c];
    return acc;
  }, {});

  // Select a vote for a position
  const handleVote = (position, candidateId) => {
    setSelectedVotes((prev) => ({ ...prev, [position]: candidateId }));
  };

  // Submit votes to backend
  const submitVotes = async () => {
    if (Object.keys(selectedVotes).length === 0) {
      return alert("Please select at least one candidate before submitting.");
    }

    const candidateIds = Object.values(selectedVotes);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/votes",
        { candidateIds },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(res.data.message);
      setSelectedVotes({}); // reset selections after submission
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Failed to submit votes");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-6xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">
        🗳️ Vote for Your Candidates
      </h2>

      {Object.keys(grouped).map((position) => (
        <div key={position} className="mb-8">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">{position}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped[position].map((candidate) => (
              <div
                key={candidate._id}
                className={`p-4 border rounded-xl transition ${
                  selectedVotes[position] === candidate._id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={
                    candidate.photo ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt={candidate.name}
                  className="w-24 h-24 mx-auto rounded-full mb-2 object-cover"
                />
                <h4 className="text-lg font-semibold text-center">{candidate.name}</h4>
                <p className="text-sm text-center text-gray-600">
                  {candidate.department} ({candidate.yearOfStudy})
                </p>

                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => handleVote(position, candidate._id)}
                    className={`w-1/2 mr-1 p-2 rounded-lg text-white ${
                      selectedVotes[position] === candidate._id
                        ? "bg-green-600"
                        : "bg-blue-500"
                    } hover:opacity-90 transition`}
                  >
                    {selectedVotes[position] === candidate._id ? "Selected" : "Vote"}
                  </button>
                  <button
                    onClick={() => navigate(`/candidate/${candidate._id}`)}
                    className="w-1/2 ml-1 p-2 rounded-lg bg-gray-300 hover:opacity-90 transition"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {candidates.length > 0 && (
        <button
          onClick={submitVotes}
          className="w-full bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-800 transition mt-4"
        >
          Submit My Votes
        </button>
      )}
    </div>
  );
}

export default CandidateList;
