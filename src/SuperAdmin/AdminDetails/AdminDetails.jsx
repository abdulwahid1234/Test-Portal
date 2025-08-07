import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaCheckCircle, FaClock } from "react-icons/fa";
import "./AdminDetails.css";

const STATUS_OPTIONS = [
  { value: "verified", label: "Verified" },
  { value: "pending", label: "Pending" }
];

const AdminDetails = () => {
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", status: "pending" });
  const [editIdx, setEditIdx] = useState(-1);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    setAdmins(users.filter(u => u.role === "admin"));
  };

  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({ ...form, role: "admin" });
    localStorage.setItem("users", JSON.stringify(users));
    setForm({ name: "", email: "", password: "", status: "pending" });
    setShowForm(false);
    loadAdmins();
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setForm({
      name: admins[idx].name,
      email: admins[idx].email,
      password: admins[idx].password,
      status: admins[idx].status || "pending"
    });
    setShowForm(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIdx = users.findIndex(u => u.role === "admin" && u.email === admins[editIdx].email);
    if (userIdx !== -1) {
      users[userIdx] = { ...form, role: "admin" };
      localStorage.setItem("users", JSON.stringify(users));
      loadAdmins();
      setShowForm(false);
      setEditIdx(-1);
      setForm({ name: "", email: "", password: "", status: "pending" });
    }
  };

  const handleDelete = (idx) => {
    if (!window.confirm("Delete this admin?")) return;
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const filtered = users.filter(u => !(u.role === "admin" && u.email === admins[idx].email));
    localStorage.setItem("users", JSON.stringify(filtered));
    loadAdmins();
  };

  return (
    <div className="admin-root">
      <div className="admin-main">
        <div className="admin-title">Admin Users</div>
        <button
          className="admin-add-btn"
          onClick={() => {
            setShowForm(true);
            setEditIdx(-1);
            setForm({ name: "", email: "", password: "", status: "pending" });
          }}
        >
          + Add Admin
        </button>
        {showForm && (
          <form className="admin-form" onSubmit={editIdx === -1 ? handleAdd : handleSaveEdit}>
            <div className="admin-input-row">
              <input
                className="admin-input"
                name="name"
                value={form.name}
                onChange={handleInput}
                placeholder="Name"
                required
              />
              <input
                className="admin-input"
                name="email"
                value={form.email}
                onChange={handleInput}
                placeholder="Email"
                type="email"
                required
              />
              <input
                className="admin-input"
                name="password"
                value={form.password}
                onChange={handleInput}
                placeholder="Password"
                type="password"
                required
              />
              <select
                className="admin-select"
                name="status"
                value={form.status}
                onChange={handleInput}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="admin-form-actions">
              <button className="admin-save-btn" type="submit">{editIdx === -1 ? "Add" : "Save"}</button>
              <button className="admin-cancel-btn" type="button" onClick={() => { setShowForm(false); setEditIdx(-1); }}>Cancel</button>
            </div>
          </form>
        )}
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Password</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center" }}>No admin users found.</td></tr>
            ) : admins.map((admin, idx) => (
              <tr key={idx}>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.password}</td>
                <td>
                  <span className={admin.status === "verified" ? "admin-status admin-status-verified" : "admin-status admin-status-pending"}>
                    {admin.status === "verified" ? "Verified" : "Pending"}
                  </span>
                </td>
                <td>
                  <button className="admin-action-btn" onClick={() => handleEdit(idx)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="admin-action-btn admin-delete-btn" onClick={() => handleDelete(idx)}>
                    <FaTrashAlt /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDetails;
