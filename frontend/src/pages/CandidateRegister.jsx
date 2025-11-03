import React, { useState } from "react";
import axios from "axios";

function CandidateRegister() {
  const [formData, setFormData] = useState({
    name: "",
    school: "",
    department: "",
    yearOfStudy: "",
    position: "",
    manifesto: "",
    photo: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const schools = ["School of Computing", "School of Business", "School of Education"];
  const departments = [
    "Computer Science",
    "Information Technology",
    "Accounting",
    "Marketing",
    "Education Management",
  ];
  const years = ["Year 1", "Year 2", "Year 3", "Year 4"];
  const positions = [
    "Guild President",
    "Vice President",
    "Finance Minister",
    "Information Minister",
    "Academic Minister",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      // ✅ Send data to backend (matches schema)
      const res = await axios.post("http://localhost:5000/api/candidates/register", {
        name: formData.name,
        position: formData.position,
        department: formData.department || formData.school, // fallback
        yearOfStudy: formData.yearOfStudy,
        manifesto: formData.manifesto,
        photo: formData.photo,
      });

      setMessage(res.data.message || "✅ Candidate registered successfully!");
      setFormData({
        name: "",
        school: "",
        department: "",
        yearOfStudy: "",
        position: "",
        manifesto: "",
        photo: "",
      });
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "❌ Failed to register candidate");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          🗳️ Candidate Registration
        </h2>

        {message && (
          <p className="mb-4 text-green-700 bg-green-100 px-3 py-2 rounded-md text-center">
            {message}
          </p>
        )}
        {error && (
          <p className="mb-4 text-red-700 bg-red-100 px-3 py-2 rounded-md text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={formData.name}
            className="w-full p-2 border rounded"
            required
          />

          {/* School */}
          <select
            name="school"
            onChange={handleChange}
            value={formData.school}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select School</option>
            {schools.map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>

          {/* Department */}
          <select
            name="department"
            onChange={handleChange}
            value={formData.department}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Year */}
          <select
            name="yearOfStudy"
            onChange={handleChange}
            value={formData.yearOfStudy}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Year of Study</option>
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          {/* Position */}
          <select
            name="position"
            onChange={handleChange}
            value={formData.position}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Position</option>
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>

          {/* Manifesto */}
          <textarea
            name="manifesto"
            placeholder="Manifesto / Vision Statement"
            onChange={handleChange}
            value={formData.manifesto}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />

          {/* Photo URL */}
          <input
            type="text"
            name="photo"
            placeholder="Photo URL (optional)"
            onChange={handleChange}
            value={formData.photo}
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-800 transition"
          >
            Register Candidate
          </button>
        </form>
      </div>
    </div>
  );
}

export default CandidateRegister;
