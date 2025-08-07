import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./Layout.css";

const DashboardLayout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "admin"; // fallback

  return (
    <div className="app-layout">
      <Sidebar role={role} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
