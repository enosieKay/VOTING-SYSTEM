import React, { useEffect, useState } from "react";
import API from "../api/api";

const Results = () => {
  const [candidates, setCandidates] = useState([]);

  const fetchResults = async () => {
    try {
      const res = await API.get("/votes/results");
      setCandidates(res.data);
    } catch (err) {
      alert("Failed to load results");
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1>Live Election Results</h1>

      <table border="1" width="100%" style={{ textAlign: "left" }}>
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map(c => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.votes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Results;
