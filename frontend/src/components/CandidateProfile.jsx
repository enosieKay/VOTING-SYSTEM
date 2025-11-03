import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CandidateProfile() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/candidates/${id}`);
        setCandidate(res.data);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Error loading candidate profile");
        navigate("/candidates");
      }
    };

    fetchCandidate();
  }, [id, navigate]);

  if (!candidate) return <p className="text-center mt-10">Loading candidate profile...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-6">
      {candidate.photo ? (
        <img
          src={candidate.photo}
          alt={candidate.name}
          className="w-40 h-40 mx-auto rounded-full object-cover mb-4"
        />
      ) : (
        <div className="w-40 h-40 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-4">
          No Photo
        </div>
      )}

      <h2 className="text-2xl font-bold text-center mb-2">{candidate.name}</h2>
      <p className="text-center text-gray-700 mb-1">
        <strong>Position:</strong> {candidate.position}
      </p>
      <p className="text-center text-gray-700 mb-1">
        <strong>Department:</strong> {candidate.department}
      </p>
      <p className="text-center text-gray-700 mb-3">
        <strong>Year:</strong> {candidate.yearOfStudy}
      </p>
      <p className="text-gray-600 text-center mb-6">
        <strong>Bio:</strong> {candidate.bio || "No bio available"}
      </p>

      <button
        onClick={() => navigate("/candidates")}
        className="w-full bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-800 transition"
      >
        ← Back to Candidates
      </button>
    </div>
  );
}

export default CandidateProfile;
