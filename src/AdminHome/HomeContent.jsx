import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
const Home = () => {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h1>Welcome to Home Page!</h1>
      <div>
    <p>This is your Home dashboard content.</p>
    </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
