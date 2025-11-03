import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
    yearOfStudy: "",
    school: "",
    manifesto: "",
    photo: null,
  });

  const [candidates, setCandidates] = useState([]);

  const positions = ["President", "Vice President", "Secretary", "Treasurer"];
  const departments = ["Computer Science", "Engineering", "Business", "Arts"];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const schools = ["School of Computing", "School of Engineering", "School of Business", "School of Arts"];

  const fetchCandidates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/candidates");
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          data.append(key, value);
        }
      });

      const res = await axios.post(
        "http://localhost:5000/api/candidates/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert(res.data.message);
      setFormData({
        name: "",
        position: "",
        department: "",
        yearOfStudy: "",
        school: "",
        manifesto: "",
        photo: null,
      });

      fetchCandidates();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Failed to register candidate");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 space-y-8">
      {/* Candidate Registration Form */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">📝 Register New Candidate</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-2 border rounded-lg"
            required
          />

          <select name="position" value={formData.position} onChange={handleChange} className="w-full p-2 border rounded-lg" required>
            <option value="">Select Position</option>
            {positions.map((pos) => <option key={pos} value={pos}>{pos}</option>)}
          </select>

          <select name="department" value={formData.department} onChange={handleChange} className="w-full p-2 border rounded-lg" required>
            <option value="">Select Department</option>
            {departments.map((dep) => <option key={dep} value={dep}>{dep}</option>)}
          </select>

          <select name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} className="w-full p-2 border rounded-lg" required>
            <option value="">Select Year of Study</option>
            {years.map((yr) => <option key={yr} value={yr}>{yr}</option>)}
          </select>

          <select name="school" value={formData.school} onChange={handleChange} className="w-full p-2 border rounded-lg" required>
            <option value="">Select School</option>
            {schools.map((sch) => <option key={sch} value={sch}>{sch}</option>)}
          </select>

          <textarea
            name="manifesto"
            value={formData.manifesto}
            onChange={handleChange}
            placeholder="Manifesto"
            className="w-full p-2 border rounded-lg"
            rows={4}
          />

          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />

          <button type="submit" className="w-full bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-800 transition">
            Register Candidate
          </button>
        </form>
      </div>

      {/* Candidate List */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">🗂️ Registered Candidates</h2>
        {candidates.length === 0 ? (
          <p className="text-center text-gray-500">No candidates registered yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidates.map((c) => (
              <div key={c._id} className="p-4 border rounded-xl">
                <img
                  src={c.photo ? `http://localhost:5000/${c.photo}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt={c.name}
                  className="w-24 h-24 mx-auto rounded-full mb-2 object-cover"
                />
                <h4 className="text-lg font-semibold text-center">{c.name}</h4>
                <p className="text-center text-gray-600">
                  {c.position} - {c.department} ({c.yearOfStudy}) <br />{c.school}
                </p>
                {c.manifesto && <p className="text-sm mt-2 text-gray-700">{c.manifesto}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
