import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "../Auth/LogoutButton/LogoutButton"; // ← IMPORT HERE
import { FaHome, FaChartBar } from "react-icons/fa";
import { MdWidgets, MdAdminPanelSettings } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { BiCodeAlt } from "react-icons/bi";
import "./Sidebar.css";

const Sidebar = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  let links = [];
  if (role === "superadmin") {
    links = [
      { to: "/superadmin/dashboard", icon: <FaHome />, label: "Dashboard" },
      { to: "/superadmin/admin", icon: <MdAdminPanelSettings />, label: "Admin" },
      { to: "/superadmin/statuscode", icon: <BiCodeAlt />, label: "Status Code" },
    ];
  } else {
    links = [
      { to: "/", icon: <FaHome />, label: "Dashboard", exact: true },
      { to: "/create-test", icon: <MdWidgets />, label: "Create Test" },
      { to: "/result", icon: <FaChartBar />, label: "Results" },
      { to: "/payment", icon: <BsBoxSeam />, label: "Payment" },
    ];
  }

  let sidebarClass =
    "ct-sidebar" +
    (collapsed ? " collapsed" : "") +
    (mobileOpen ? " mobile-open" : "");

  return (
    <>
      {/* Hamburger (mobile only) */}
      <button
        className="ct-sidebar-hamburger"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Open sidebar"
      >
        <span />
        <span />
        <span />
      </button>

      {mobileOpen && (
        <div className="ct-sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={sidebarClass}>
        <div className="ct-sidebar-header">
          <img
            className="ct-profile"
            src={
              role === "superadmin"
                ? "https://randomuser.me/api/portraits/men/44.jpg"
                : "https://randomuser.me/api/portraits/women/65.jpg"
            }
            alt="profile"
          />
          {!collapsed && (
            <div className="ct-org">
              {role === "superadmin" ? "SUPER ADMIN" : "CREATIVE TIM"}
            </div>
          )}
          <button
            className="ct-sidebar-collapse"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "⏵" : "⏴"}
          </button>
        </div>

        <nav className="ct-sidebar-nav">
          {links.map((link, i) => (
            <NavLink
              key={i}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                "ct-sidebar-link" + (isActive ? " ct-sidebar-link-active" : "")
              }
              onClick={() => setMobileOpen(false)}
            >
              <span className="ct-sidebar-icon">{link.icon}</span>
              {!collapsed && <span className="ct-sidebar-label">{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT BUTTON FIXED AT BOTTOM */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            textAlign: "center",
            paddingBottom: "1rem",
            zIndex: 2,
            background: "inherit",
          }}
        >
          <LogoutButton collapsed={collapsed} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
