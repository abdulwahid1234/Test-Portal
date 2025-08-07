import React, { useState } from "react";
import {
  FaRegClock,
  FaCalendarAlt,
  FaEdit,
  FaTrashAlt,
  FaClipboardList,
  FaClone
} from "react-icons/fa";
import { MdDescription } from "react-icons/md";
import { TbBox } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import "./CreateTest.css";

const INITIAL_TOTAL_CODES = 3000;

const CreateTest = () => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form fields
  const [testName, setTestName] = useState("");
  const [testDesc, setTestDesc] = useState("");
  const [testDuration, setTestDuration] = useState("");
  const [testDate, setTestDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [accessCodesToUse, setAccessCodesToUse] = useState(""); // How many codes for this test
  const [codeUsages, setCodeUsages] = useState("");             // How many times each code can be used

  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  // Calculate available codes (total - used)
  const getTotalUsedCodes = (skipId = null) =>
    tests.reduce((sum, t) =>
      (!skipId || t.id !== skipId)
        ? sum + (t.accessCodesToUse ? Number(t.accessCodesToUse) : 0)
        : sum
    , 0);

  const availableCodes = INITIAL_TOTAL_CODES - getTotalUsedCodes(editingId);

  // Open/close create/edit modal
  const openModal = () => {
    if (availableCodes <= 0 && !editMode) return; // block if no codes!
    setShowModal(true);
    setEditMode(false);
    clearForm();
  };
  const closeModal = () => {
    setShowModal(false);
    clearForm();
  };

  // Clear form fields
  const clearForm = () => {
    setTestName("");
    setTestDesc("");
    setTestDuration("");
    setTestDate("");
    setEditingId(null);
    setIsActive(true);
    setAccessCodesToUse("");
    setCodeUsages("");
  };

  // Submit: create or update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!testName.trim()) return;
    // Validation
    if (
      (accessCodesToUse && (!/^[1-9]\d*$/.test(accessCodesToUse))) ||
      (codeUsages && (!/^[1-9]\d*$/.test(codeUsages)))
    ) {
      alert("Both number of access codes and usage times must be positive numbers!");
      return;
    }
    if (Number(accessCodesToUse) > availableCodes) {
      alert(`Cannot assign more codes than available (${availableCodes}).`);
      return;
    }
    const newTest = {
      id: editMode ? editingId : Date.now(),
      name: testName,
      desc: testDesc,
      duration: testDuration,
      date: testDate,
      active: isActive,
      accessCodesToUse: accessCodesToUse ? Number(accessCodesToUse) : 0,
      codeUsages: codeUsages ? Number(codeUsages) : 1,
    };
    if (editMode) {
      setTests(tests.map(test => (test.id === editingId ? newTest : test)));
    } else {
      setTests([...tests, newTest]);
    }
    closeModal();
  };

  // Delete test
  const handleDelete = (id, e) => {
    if (e) e.stopPropagation();
    setTests(tests.filter(test => test.id !== id));
  };

  // Edit test (fill modal with values)
  const handleEdit = (test, e) => {
    if (e) e.stopPropagation();
    setEditMode(true);
    setEditingId(test.id);
    setTestName(test.name);
    setTestDesc(test.desc);
    setTestDuration(test.duration);
    setTestDate(test.date);
    setIsActive(test.active);
    setAccessCodesToUse(test.accessCodesToUse ? String(test.accessCodesToUse) : "");
    setCodeUsages(test.codeUsages ? String(test.codeUsages) : "");
    setShowModal(true);
  };

  // Duplicate test
const handleDuplicate = (test, e) => {
  if (e) e.stopPropagation();
  if (availableCodes <= 0) {
    alert("Cannot duplicate: No access codes left to assign.");
    return;
  }
  // Only allow duplication if the original test's access codes can fit in availableCodes
  if (Number(test.accessCodesToUse) > availableCodes) {
    alert(`Cannot duplicate: Not enough access codes available (${availableCodes}) for this test.`);
    return;
  }
  const duplicatedTest = {
    ...test,
    id: Date.now(),
    name: test.name + " (Copy)",
  };
  setTests([...tests, duplicatedTest]);
};


  // Toggle status
  const handleToggleStatus = (id, e) => {
    if (e) e.stopPropagation();
    setTests(prev =>
      prev.map(test =>
        test.id === id ? { ...test, active: !test.active } : test
      )
    );
  };

  // Card click
  const handleCardClick = (test, e) => {
    if (
      e.target.closest('.footer-actions') ||
      e.target.closest('.edit-btn') ||
      e.target.closest('.delete-btn') ||
      e.target.closest('.duplicate-btn') ||
      e.target.closest('.footer-badge')
    ) return;
    navigate(`/upload-question/${test.id}`, { state: { test } });
  };

  return (
    <div className="create-test-page">
      <div className="page-header">
        <h2>Create Tests</h2>
        <button
          className="create-btn"
          onClick={openModal}
          disabled={availableCodes <= 0}
          title={availableCodes <= 0 ? "No access codes left to assign" : ""}
        >
          + Create Test
        </button>
      </div>
      {availableCodes <= 0 && (
        <div style={{
          color: "#b92125",
          background: "#ffeaea",
          padding: "12px 24px",
          borderRadius: "9px",
          margin: "0 0 24px 32px",
          fontWeight: 600,
          fontSize: "1.1rem"
        }}>
          All access codes have been assigned to tests. Please delete or edit an existing test to free up codes.
        </div>
      )}
      <div className="tests-list">
        {tests.length === 0 && (
          <div className="no-tests">No tests created yet.</div>
        )}
        {tests.map(test => (
          <div
            className="test-modern-card"
            key={test.id}
            onClick={e => handleCardClick(test, e)}
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            <div className="test-card-info">
              <div className="test-title">{test.name}</div>
              <div className="test-location">Online Test</div>
              <div className="test-card-row">
                <span className="test-property">
                  <FaRegClock /> {test.duration ? `${test.duration} min` : "N/A"}
                </span>
                <span className="test-property">
                  <FaCalendarAlt /> {test.date || "N/A"}
                </span>
              </div>
              <div className="test-card-row">
                <span className="test-property">
                  <MdDescription /> {test.desc || "No Description"}
                </span>
                <span className="test-property">
                  <TbBox /> ID: {test.id}
                </span>
              </div>
              {(test.accessCodesToUse > 0 || test.codeUsages > 0) && (
                <div className="test-card-row">
                  {test.accessCodesToUse > 0 && (
                    <span className="test-property">
                      Access Codes for this Test: <b>{test.accessCodesToUse}</b>
                    </span>
                  )}
                  {test.codeUsages > 0 && (
                    <span className="test-property" style={{ marginLeft: 16 }}>
                      Each Code Usable: <b>{test.codeUsages}</b> time{test.codeUsages > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="test-card-footer">
              <div
                className={`footer-badge ${test.active ? "active" : "inactive"}`}
                onClick={e => handleToggleStatus(test.id, e)}
                title="Click to toggle status"
              >
                <span className={`status-dot ${test.active ? "active-dot" : "inactive-dot"}`}></span>
                {test.active ? "Active" : "Inactive"}
              </div>
              <div className="footer-actions">
                <button className="edit-btn" onClick={e => handleEdit(test, e)}>
                  <FaEdit /> Edit
                </button>
                <button className="delete-btn" onClick={e => handleDelete(test.id, e)}>
                  <FaTrashAlt /> Delete
                </button>
                <button
  className="duplicate-btn"
  onClick={e => handleDuplicate(test, e)}
  disabled={availableCodes <= 0}
  title={availableCodes <= 0 ? "No access codes left for duplication" : ""}
>
  <FaClone /> Duplicate
</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editMode ? "Edit Test" : "Create New Test"}</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Test Name<span>*</span>
                <input
                  type="text"
                  value={testName}
                  onChange={e => setTestName(e.target.value)}
                  required
                />
              </label>
              <label>
                Test Description
                <textarea
                  value={testDesc}
                  onChange={e => setTestDesc(e.target.value)}
                />
              </label>
              <label>
                Test Duration (minutes)
                <input
                  type="number"
                  min="1"
                  value={testDuration}
                  onChange={e => setTestDuration(e.target.value)}
                />
              </label>
              <label>
                Test Date
                <input
                  type="date"
                  value={testDate}
                  onChange={e => setTestDate(e.target.value)}
                />
              </label>
              <label>
                Number of Access Codes to Use{" "}
                <span style={{ color: "#888", fontWeight: 400, fontSize: "0.99em" }}>
                  (Available: {availableCodes})
                </span>
                <input
                  type="number"
                  min="1"
                  max={availableCodes}
                  value={accessCodesToUse}
                  onChange={e => setAccessCodesToUse(e.target.value)}
                  placeholder="How many codes for this test?"
                  required
                />
              </label>
              <label>
                How Many Times Each Code Can Be Used
                <input
                  type="number"
                  min="1"
                  value={codeUsages}
                  onChange={e => setCodeUsages(e.target.value)}
                  placeholder="E.g. 1 = single use, 2 = reusable twice"
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTest;
