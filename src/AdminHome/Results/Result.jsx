import React, { useEffect, useState } from "react";
import './Result.css';

// Helper for CSV export (added columns)
const toCSV = (rows) => {
  const header = [
    "#", "Access Code", "Name", "Score", "Essay", "Interview", "Date", "Start Time", "End Time"
  ];
  const lines = [
    header.join(","),
    ...rows.map((row, idx) =>
      [
        idx + 1,
        row.accessCode,
        row.name,
        row.score,
        row.essay,        // <-- Essay marks
        row.interview,    // <-- Interview marks
        row.date,
        row.startTime,
        row.endTime,
      ]
        .map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];
  return lines.join("\r\n");
};

// Demo data with essay and interview marks
const DEMO_RESULTS = [
  {
    category: "AI",
    accessCode: "AI001",
    name: "Alice Ahmed",
    score: 45,
    essay: 18,
    interview: 19,
    date: "2024-08-01",
    startTime: "10:00",
    endTime: "10:45",
  },
  {
    category: "AI",
    accessCode: "AI002",
    name: "Bilal Khan",
    score: 47,
    essay: 15,
    interview: 17,
    date: "2024-08-02",
    startTime: "11:00",
    endTime: "11:50",
  },
  {
    category: "ML",
    accessCode: "ML101",
    name: "Maria Latif",
    score: 44,
    essay: 16,
    interview: 18,
    date: "2024-08-03",
    startTime: "09:00",
    endTime: "09:40",
  },
  {
    category: "ML",
    accessCode: "ML102",
    name: "Omar Siddiq",
    score: 42,
    essay: 11,
    interview: 13,
    date: "2024-08-04",
    startTime: "10:30",
    endTime: "11:10",
  },
  {
    category: "DL",
    accessCode: "DL210",
    name: "Nimra Farooq",
    score: 44,
    essay: 19,
    interview: 20,
    date: "2024-08-05",
    startTime: "08:00",
    endTime: "08:35",
  },
  {
    category: "Nursing",
    accessCode: "NRG45",
    name: "Samina Sheikh",
    score: 41,
    essay: 14,
    interview: 16,
    date: "2024-08-05",
    startTime: "12:00",
    endTime: "12:50",
  },
  {
    category: "Nursing",
    accessCode: "NRG78",
    name: "Rashid Iqbal",
    score: 48,
    essay: 12,
    interview: 14,
    date: "2024-08-06",
    startTime: "09:10",
    endTime: "09:55",
  },
];

const CATEGORIES = ["AI", "ML", "DL", "Nursing"];
const newLocal = "demo_results";
const LOCAL_STORAGE_KEY = newLocal;

const Result = () => {
  const [results, setResults] = useState([]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [search, setSearch] = useState("");

  // Load and migrate data
  useEffect(() => {
    let stored = [];
    try {
      stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    } catch {}
    if (!stored.length) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEMO_RESULTS));
      stored = DEMO_RESULTS;
    }

    // MIGRATION: Add essay/interview if missing
    const upgraded = stored.map(result => ({
      ...result,
      essay: result.essay ?? "",
      interview: result.interview ?? "",
    }));

    // Save to localStorage if changed
    if (JSON.stringify(upgraded) !== JSON.stringify(stored)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(upgraded));
    }

    setResults(upgraded);
  }, []);

  // Get current filtered results
  const getFilteredResults = () => {
    let filtered = results.filter((r) => r.category === category);
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(s) ||
          r.accessCode.toLowerCase().includes(s)
      );
    }
    return filtered;
  };

  // Handle CSV export
  const downloadCSV = () => {
    const filtered = getFilteredResults();
    const csv = toCSV(filtered);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${category || "results"}_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredResults = getFilteredResults();

  return (
    <div className="result-page">
      <div className="result-header">
        <h2>Result Management</h2>
        <div className="result-controls">
          <input
            className="result-search"
            type="text"
            placeholder="Search by Name or Access Code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="download-btn"
            onClick={downloadCSV}
            disabled={filteredResults.length === 0}
          >
            Download CSV
          </button>
          <div className="category-select-wrap">
            <label htmlFor="category" style={{ marginRight: 7, fontWeight: 500 }}>
              Test:
            </label>
            <select
              className="result-category"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="result-table-wrap">
        <table className="result-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Access Code</th>
              <th>Name</th>
              <th>Score</th>
              <th>Essay</th>
              <th>Interview</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", color: "#858c9a", fontWeight: 500, fontSize: "1.11rem" }}>
                  No results found.
                </td>
              </tr>
            ) : (
              filteredResults.map((r, idx) => (
                <tr key={r.accessCode + idx}>
                  <td>{idx + 1}</td>
                  <td>{r.accessCode}</td>
                  <td>{r.name}</td>
                  <td>
                    <span
                      style={{
                        fontWeight: 600,
                        color: r.score >= 90 ? "#189b3a" : r.score >= 80 ? "#2979ed" : "#b92125",
                      }}
                    >
                      {r.score}
                    </span>
                  </td>
                  <td>{r.essay}</td>
                  <td>{r.interview}</td>
                  <td>{r.date}</td>
                  <td>{r.startTime}</td>
                  <td>{r.endTime}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Result;
