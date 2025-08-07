import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi"; // Nice logout icon

const LogoutButton = ({ collapsed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="ct-logout-btn"
      style={{
        width: "90%",
        margin: "1rem auto",
        padding: "0.6rem",
        border: "none",
        borderRadius: "6px",
        background: "#f44336",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "center",
        gap: "4px",
        fontSize: "1rem",
        minHeight: "38px",
      }}
      title="Logout"
    >
      <FiLogOut style={{ fontSize: "1.4rem",color:"black" }} />
      {!collapsed && <span>Log out</span>}
    </button>
  );
};

export default LogoutButton;
