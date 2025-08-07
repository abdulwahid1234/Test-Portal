import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    // Find matching user
    const user = users.find(
      u => u.email === email && u.password === password && u.role === role
    );

    if (user) {
      localStorage.setItem("token", "demo-token");
      localStorage.setItem("user", JSON.stringify({ name: user.name, email, role }));

      if (role === "superadmin") {
        navigate("/superadmin/dashboard");
      } else {
        navigate("/");
      }
    } else {
      setErr("Invalid email, password, or role");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {err && <span className="error">{err}</span>}
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
          autoComplete="current-password"
        />
        <select className= "rol" value={role} onChange={e => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
        <div>
      <span>For SuperAdmin: akbar@gmail.com </span>
      <br /><span>Password: qwert</span>
      </div>
      <br />
      <div><span>For Admin: waleed@gmail.com </span><br />
      <span>Password: 12345</span></div>
      </form>
      
    </div>
    
  );
};

export default Login;
