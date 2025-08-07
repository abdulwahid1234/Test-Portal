import React, { useState, useEffect } from "react";
import "./StatusCode.css";

// Helper: Generate unique 8-char code
function generateCode() {
  return (
    Math.random().toString(36).slice(2, 6).toUpperCase() +
    Math.random().toString(36).slice(2, 6).toUpperCase()
  );
}
// Expiry is 30 days from today
function getExpiryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}
// Nicely format ISO date string
function formatDate(dateStr) {
  if (!dateStr) return 'Unused';
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

const StatusCode = () => {
  const [numberOfCodes, setNumberOfCodes] = useState("");
  const [pricePerCode, setPricePerCode] = useState("5");
  const [adminAccessCode, setAdminAccessCode] = useState(generateCode());
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [verifiedAdmins, setVerifiedAdmins] = useState([]);
  const [adminsWithCodes, setAdminsWithCodes] = useState([]);
  const [showCodesModal, setShowCodesModal] = useState(false);
  const [codesModalAdmin, setCodesModalAdmin] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const codesPerPage = 10;  // Set how many codes to show per page

  // Load admins and config on mount
  useEffect(() => {
    setPricePerCode(localStorage.getItem("pricePerCode") || "5");
    setAdminAccessCode(generateCode());
    // Get only verified admins
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const verified = users.filter(u => u.role === "admin" && u.status === "verified");
    setVerifiedAdmins(verified);
    setAdminsWithCodes(
      verified.map(a => ({
        ...a,
        codePurchases: a.codePurchases || []
      }))
    );
  }, []);

  // Helper: reload admins (after purchase/usage)
  const refreshAdminsWithCodes = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const verified = users.filter(u => u.role === "admin" && u.status === "verified");
    setVerifiedAdmins(verified);
    setAdminsWithCodes(
      verified.map(a => ({
        ...a,
        codePurchases: a.codePurchases || []
      }))
    );
  };

  // Save codes for admin (with new generated codes)
  const handleSave = () => {
    if (!selectedAdmin || !numberOfCodes || Number(numberOfCodes) < 1) {
      alert("Please select admin and enter a valid code count.");
      return;
    }
    localStorage.setItem("pricePerCode", pricePerCode);

    // Generate the requested number of new codes
    const codesArr = [];
    for (let i = 0; i < parseInt(numberOfCodes, 10); i++) {
      codesArr.push({
        code: generateCode(),
        expiry: getExpiryDate(),
        used: false,
        usedDate: null,
      });
    }

    // Update the selected admin in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const idx = users.findIndex(u => u.role === "admin" && u.status === "verified" && u.email === selectedAdmin);
    if (idx !== -1) {
      if (!Array.isArray(users[idx].codePurchases)) users[idx].codePurchases = [];
      users[idx].codePurchases = [...users[idx].codePurchases, ...codesArr];
      localStorage.setItem("users", JSON.stringify(users));
      refreshAdminsWithCodes();
      alert("Codes added successfully!");
      setNumberOfCodes("");
      setAdminAccessCode(generateCode()); // generate new for next purchase
    } else {
      alert("Admin not found!");
    }
  };

  // Modal open/close for code details
  const openCodesModal = (admin) => {
    setCodesModalAdmin(admin);
    setShowCodesModal(true);
  };
  const closeCodesModal = () => {
    setCodesModalAdmin(null);
    setShowCodesModal(false);
  };

  // Mark a code as used (by index in codePurchases)
  const markCodeUsed = (codeIdx) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIdx = users.findIndex(u => u.email === codesModalAdmin.email);
    if (userIdx !== -1 && users[userIdx].codePurchases && users[userIdx].codePurchases[codeIdx]) {
      users[userIdx].codePurchases[codeIdx].used = true;
      users[userIdx].codePurchases[codeIdx].usedDate = new Date().toISOString();
      localStorage.setItem("users", JSON.stringify(users));
      // Refresh both modal and table
      setCodesModalAdmin({
        ...codesModalAdmin,
        codePurchases: users[userIdx].codePurchases
      });
      refreshAdminsWithCodes();
    }
  };

  // Handle page change
  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  // Pagination logic
  const currentCodes = (codesModalAdmin?.codePurchases || []).slice(
    (currentPage - 1) * codesPerPage,
    currentPage * codesPerPage
  );
  const totalPages = Math.ceil((codesModalAdmin?.codePurchases || []).length / codesPerPage);

  return (
    <div className="status-root">
      <div className="status-main">
        <div className="status-title">Admin Code Purchase & Settings</div>
        
        <div className="status-row">
          <label className="status-label">Number of Codes:</label>
          <input
            type="number"
            min={1}
            value={numberOfCodes}
            onChange={e => setNumberOfCodes(e.target.value)}
            className="status-input"
            placeholder="How many?"
          />
        </div>
        <div className="status-row">
          <label className="status-label">Price per Code (Rs):</label>
          <input
            type="number"
            min={1}
            value={pricePerCode}
            onChange={e => setPricePerCode(e.target.value)}
            className="status-input"
            placeholder="Rs. per code"
          />
        </div>
        <div className="status-row">
          <label className="status-label">Select Admin:</label>
          <select
            className="status-input"
            value={selectedAdmin}
            onChange={e => setSelectedAdmin(e.target.value)}
          >
            <option value="">Select Verified Admin</option>
            {verifiedAdmins.map(a => (
              <option key={a.email} value={a.email}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div className="status-row">
          <label className="status-label">Admin Access Code:</label>
          <input
            type="text"
            value={adminAccessCode}
            className="status-input"
            style={{ letterSpacing: "3px", fontWeight: "bold", background: "#f4fef6" }}
            readOnly
          />
        </div>
        <button className="status-save-btn" onClick={handleSave}>Save</button>
        
        {/* Admin code purchase summary */}
        <div className="status-table-title" style={{ marginTop: 28 }}>Admin Codes Purchased</div>
        <table className="status-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Purchased Codes</th>
            </tr>
          </thead>
          <tbody>
            {adminsWithCodes.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", color: "#e69017" }}>No verified admin found.</td>
              </tr>
            ) : adminsWithCodes.map(a => (
              <tr key={a.email}>
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td>
                  <span
                    className="codes-link"
                    style={{ color: "#1976d2", cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => openCodesModal(a)}
                  >
                    {a.codePurchases ? a.codePurchases.length : 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for code details */}
        {showCodesModal && codesModalAdmin && (
          <div className="modal-bg">
            <div className="modal-card">
              <h2 style={{ color: "#2f855a;", marginBottom: 10 }}>
                {codesModalAdmin.name}'s Codes
              </h2>
              <button className="modal-close" onClick={closeCodesModal}>×</button>
              <table className="status-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Expiry</th>
                    <th>Status</th>
                    <th>Used Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCodes.map((c, i) => (
                    <tr key={i}>
                      <td style={{ letterSpacing: "2px", fontWeight: 600 }}>{c.code}</td>
                      <td>{c.expiry}</td>
                      <td>
                        <span
                          style={{
                            color: c.used ? "#999" : "#2f855a;",
                            fontWeight: 600
                          }}
                        >
                          {c.used ? "Used" : "Unused"}
                        </span>
                      </td>
                      <td>
                        {c.used
                          ? <span style={{ color: "#888", fontWeight: 500 }}>{formatDate(c.usedDate)}</span>
                          : (
                              <button
                                style={{
                                  background: "#269b57",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "6px",
                                  padding: "4px 11px",
                                  cursor: "pointer"
                                }}
                                onClick={() => markCodeUsed(i)}
                              >
                                Mark as Used
                              </button>
                            )
                        }
                      </td>
                    </tr>
                  ))}
                  {(!codesModalAdmin.codePurchases || codesModalAdmin.codePurchases.length === 0) && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", color: "#e69017" }} >
                        No codes purchased.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span>{currentPage} of {totalPages}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusCode;
