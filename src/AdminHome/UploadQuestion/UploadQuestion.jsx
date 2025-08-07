import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import "./UploadQuestion.css";
import { FaCheckCircle, FaTimesCircle, FaCalendarCheck, FaChartBar } from "react-icons/fa";
// Helpers for parsing questions (unchanged)
const parseJsonQuestions = (fileContent) => {
  try {
    const data = JSON.parse(fileContent);
    return Array.isArray(data)
      ? data.map(q => ({
          question: q.question || "",
          options: q.options || { a: q.a, b: q.b, c: q.c, d: q.d },
          correct_answer: (q.correct_answer || q.correct || "").toLowerCase().trim(),
        }))
      : [];
  } catch {
    return [];
  }
};
const parseExcelQuestions = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      const mapped = json.map((row) => ({
        question: row.Question || row.question || "",
        options: {
          a: row.A || row.a || "",
          b: row.B || row.b || "",
          c: row.C || row.c || "",
          d: row.D || row.d || "",
        },
        correct_answer: (row.Correct || row.correct || "").toLowerCase().trim(),
      }));
      resolve(mapped);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

const LOCAL_STORAGE_RESULTS_KEY = "demo_results";

const UploadQuestion = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const test = state?.test;

  // Tabs state
  const [tab, setTab] = useState("upload"); // upload | stats | result

  // Upload state
  const [questions, setQuestions] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [fileName, setFileName] = useState("");
  const [expandedIdx, setExpandedIdx] = useState(-1);

  // Fake statistics demo data
  const fakeStats = {
    pass: 8,
    fail: 2,
    total: 10,
    avg: 76,
    inprogress: 2,
  };

  // Upload box logic
  const handleFileUpload = async (e) => {
    setUploadError("");
    setQuestions([]);
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    if (file.type === "application/json" || file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const data = parseJsonQuestions(ev.target.result);
        if (data.length === 0) setUploadError("Invalid or empty JSON.");
        setQuestions(data);
      };
      reader.readAsText(file);
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel" ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls")
    ) {
      const data = await parseExcelQuestions(file);
      if (data.length === 0) setUploadError("Invalid or empty Excel.");
      setQuestions(data);
    } else {
      setUploadError("Please upload a .json, .xlsx or .xls file.");
    }
  };

  // Shorten long question text
  const getShortQuestion = (q) =>
    q.length > 60 ? q.slice(0, 57) + "..." : q;

  // Get results for this test from localStorage (by test name)
  const getTestResults = () => {
    let results = [];
    try {
      results = JSON.parse(localStorage.getItem(LOCAL_STORAGE_RESULTS_KEY)) || [];
    } catch {}
    // If your test result includes a `testId`, filter by `testId` instead of name
    return results.filter(r => r.name === test?.name);
  };
  const resultRows = getTestResults();

  return (
    <div className="uq-container-inline">
      {/* Header Info */}
      <div className="uq-header-inline">
        <div>
          <span className="uq-label">Test Name:</span>{" "}
          <span className="uq-value">{test?.name || "—"}</span>
        </div>
        <div>
          <span className="uq-label">Test Description:</span>{" "}
          <span className="uq-value">{test?.desc || "—"}</span>
        </div>
        <div className="uq-btn-row">
          <button
            className={`uq-main-btn uq-upload-btn ${tab === "upload" ? "active" : ""}`}
            onClick={() => setTab("upload")}
          >
            Upload
          </button>
          <button
            className={`uq-main-btn uq-stat-btn ${tab === "stats" ? "active" : ""}`}
            onClick={() => setTab("stats")}
          >
            Statistics
          </button>
          <button
            className={`uq-main-btn uq-result-btn ${tab === "result" ? "active" : ""}`}
            onClick={() => setTab("result")}
          >
            Result
          </button>
        </div>
      </div>

      {/* Statistics Box */}
      {tab === "stats" && (
        <div className="uq-box uq-stats-box">
          <div className="uq-stats-row">
            <div>
              <span className="uq-label">Pass/Fail:</span>{" "}
              <span className="uq-value">{fakeStats.pass} / {fakeStats.fail}</span>
            </div>
            <div>
              <span className="uq-label">Test completion:</span>{" "}
              <span className="uq-value">{fakeStats.total}</span>
            </div>
            <div>
              <span className="uq-label">Test average:</span>{" "}
              <span className="uq-value">{fakeStats.avg}%</span>
            </div>
            <div>
              <span className="uq-label">In progress:</span>{" "}
              <span className="uq-value">
                <span className="uq-loader"></span> {fakeStats.inprogress}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Upload Box */}
      {tab === "upload" && (
        <div className="uq-uploadbox">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 0 }}>
            <label htmlFor="uq-file-input" className="uq-file-btn uq-file-btn-table">
              Upload file
              <input
                id="uq-file-input"
                type="file"
                accept=".json,application/json,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xls,.xlsx"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>
          {fileName && <span className="uq-file-name">{fileName}</span>}
          {uploadError && (
            <div className="uq-error">{uploadError}</div>
          )}
          {/* Questions table */}
          <div className="uq-table-wrapper">
            <table className="uq-table">
              <thead>
                <tr>
                  <th>Q#</th>
                  <th>Questions</th>
                  <th>A</th>
                  <th>B</th>
                  <th>C</th>
                  <th>D</th>
                  <th>Correct</th>
                </tr>
              </thead>
              <tbody>
                {questions.length === 0 ? (
                  <>
                    {[...Array(3)].map((_, idx) => (
                      <tr key={idx}>
                        {[...Array(7)].map((__, tdidx) => (
                          <td key={tdidx} style={{ minHeight: "36px" }}></td>
                        ))}
                      </tr>
                    ))}
                  </>
                ) : (
                  questions.map((q, idx) => {
                    const opts = q.options || {};
                    if (!opts.a && (q.A || q.a)) {
                      opts.a = q.A || q.a || "";
                      opts.b = q.B || q.b || "";
                      opts.c = q.C || q.c || "";
                      opts.d = q.D || q.d || "";
                    }
                    const correctKey = (q.correct_answer || q.correct || "").toLowerCase().trim();
                    const correctLetter = "abcd".includes(correctKey) ? correctKey.toUpperCase() : "";
                    const correctText = opts[correctKey] || "";
                    const isExpanded = expandedIdx === idx;
                    const questionText = isExpanded
                      ? q.question
                      : getShortQuestion(q.question);

                    return (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td
                          className="uq-question-cell"
                          title={q.question}
                          onClick={() =>
                            q.question.length > 60 ? setExpandedIdx(isExpanded ? -1 : idx) : null
                          }
                        >
                          {questionText}
                          {q.question.length > 60 && (
                            <span className="uq-expand-link">
                              {isExpanded ? "[less]" : "[more]"}
                            </span>
                          )}
                        </td>
                        <td>{opts.a}</td>
                        <td>{opts.b}</td>
                        <td>{opts.c}</td>
                        <td>{opts.d}</td>
                        <td className="uq-correct-answer">
                          {correctLetter && (
                            <span style={{ fontWeight: 700, color: "#168327" }}>
                              {correctLetter}) {correctText}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Result Box */}
      {tab === "result" && (
        <div className="uq-box uq-result-box">
          <h3 style={{ margin: "0 0 12px 0",color:"white" }}>Test Results</h3>
          {/* <div style={{ marginBottom: 16 }}>
            <div><b>Test Name:</b> {test?.name}</div>
            <div><b>Description:</b> {test?.desc}</div>
          </div> */}
          <div className="uq-table-wrapper">
            <table className="uq-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Access Code</th>
                  <th>Score</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
              </thead>
              <tbody>
                {resultRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "black" }}>
                      No students have attempted this test yet.
                    </td>
                  </tr>
                ) : (
                  resultRows.map((r, idx) => (
                    <tr key={r.accessCode + idx}>
                      <td>{idx + 1}</td>
                      <td>{r.name}</td>
                      <td>{r.accessCode}</td>
                      <td>{r.score}</td>
                      <td>{r.startTime}</td>
                      <td>{r.endTime}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadQuestion;
