import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErr("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    // Load or create users array
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    // Check if user exists with this email and role
    const exists = users.find(
      u => u.email === email && u.role === role
    );
    if (exists) {
      setErr("A user with this email and role already exists");
      return;
    }

    // Add user to users array
    users.push({ name, email, password, role });
    localStorage.setItem("users", JSON.stringify(users));

    // Login the user after signup
    localStorage.setItem("token", "demo-token");
    localStorage.setItem("user", JSON.stringify({ name, email, role }));

    if (role === "superadmin") {
      navigate("/superadmin/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        {err && <span className="error">{err}</span>}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          autoComplete="name"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />
        <select className="rol" value={role} onChange={e => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
