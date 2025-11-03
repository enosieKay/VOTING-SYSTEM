import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Select backend endpoint based on role
      const endpoint =
        role === "student" ? "/api/auth/login" : "/api/admin/login";

      // Send login request
      const res = await API.post(endpoint, { email, password });

      // Save JWT token
      localStorage.setItem("token", res.data.token);

      // Save user info
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to correct dashboard
      if (role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Login</button>
      </form>

      {role === "student" && (
        <Link to="/register">Register as Student</Link>
      )}
    </div>
  );
};

export default Login;
