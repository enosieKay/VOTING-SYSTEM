import React, { useState } from "react";
import axios from "axios";

function AddCandidateForm() {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
    yearOfStudy: "",
    bio: "",
    photo: "", // Changed from null to empty string
  });

  const [photoPreview, setPhotoPreview] = useState(""); // Added preview state
  const [loading, setLoading] = useState(false);

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Update photo preview when URL changes
    if (name === "photo") {
      setPhotoPreview(value);
    }
  };

  // Submit candidate to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send JSON instead of FormData
      const res = await axios.post(
        "http://localhost:5000/api/admin/candidates",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(res.data.message);

      // Clear form
      setFormData({
        name: "",
        position: "",
        department: "",
        yearOfStudy: "",
        bio: "",
        photo: "",
      });
      setPhotoPreview("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add candidate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-6"
    >
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="mb-2 w-full p-2 border rounded"
      />
      <input
        type="text"
        name="position"
        placeholder="Position"
        value={formData.position}
        onChange={handleChange}
        required
        className="mb-2 w-full p-2 border rounded"
      />
      <input
        type="text"
        name="department"
        placeholder="Department"
        value={formData.department}
        onChange={handleChange}
        required
        className="mb-2 w-full p-2 border rounded"
      />
      <input
        type="text"
        name="yearOfStudy"
        placeholder="Year of Study"
        value={formData.yearOfStudy}
        onChange={handleChange}
        required
        className="mb-2 w-full p-2 border rounded"
      />
      <textarea
        name="bio"
        placeholder="Bio"
        value={formData.bio}
        onChange={handleChange}
        className="mb-2 w-full p-2 border rounded"
      ></textarea>

      {/* Photo URL input */}
      <input
        type="text"
        name="photo"
        placeholder="Photo URL"
        value={formData.photo}
        onChange={handleChange}
        className="mb-2 w-full p-2 border rounded"
      />

      {/* Live photo preview */}
      {photoPreview && (
        <div className="mb-4 text-center">
          <p className="mb-1">Photo Preview:</p>
          <img
            src={photoPreview}
            alt="Preview"
            className="mx-auto w-32 h-32 object-cover rounded"
            onError={(e) => (e.target.src = "")} // hides if invalid URL
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-800 transition"
      >
        {loading ? "Adding..." : "Add Candidate"}
      </button>
    </form>
  );
}

export default AddCandidateForm;
