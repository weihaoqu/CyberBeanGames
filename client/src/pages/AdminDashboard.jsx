import { useState, useEffect, useCallback } from "react";
import "./AdminDashboard.css";

const API = "/api/research/admin";
const TOKEN_KEY = "admin_token";

function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("participants");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState({ col: null, asc: true });

  const authHeaders = useCallback(
    () => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" }),
    [token]
  );

  // Verify stored token on mount
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (r.ok) {
          setAuthed(true);
          return r.json();
        }
        // Token invalid — clear it
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        return null;
      })
      .then((d) => d && setStats(d));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch tab data when authed or tab changes
  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    setSort({ col: null, asc: true });
    fetch(`${API}/${tab}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((rows) => {
        setData(rows);
        setLoading(false);
      });
  }, [authed, tab, authHeaders]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setLoginError("Wrong password");
      return;
    }
    const { token: t } = await res.json();
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setAuthed(true);
    // Fetch stats
    const statsRes = await fetch(`${API}/stats`, {
      headers: { Authorization: `Bearer ${t}` },
    });
    if (statsRes.ok) setStats(await statsRes.json());
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setAuthed(false);
    setStats(null);
    setData([]);
    setPassword("");
  }

  function handleSort(col) {
    setSort((prev) => ({
      col,
      asc: prev.col === col ? !prev.asc : true,
    }));
  }

  function sortedData() {
    if (!sort.col) return data;
    return [...data].sort((a, b) => {
      const va = a[sort.col];
      const vb = b[sort.col];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number" && typeof vb === "number") {
        return sort.asc ? va - vb : vb - va;
      }
      return sort.asc
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  }

  // ── Password Gate ──
  if (!authed) {
    return (
      <div className="admin-page">
        <div className="admin-gate">
          <h2>// Admin Access</h2>
          <form className="gate-form" onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit">Login</button>
          </form>
          {loginError && <div className="gate-error">{loginError}</div>}
        </div>
      </div>
    );
  }

  const tabs = ["participants", "sessions", "events", "feedback", "demographics", "quiz_responses", "exit_survey"];
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const rows = sortedData();

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>// Research Dashboard</h1>
        <button className="admin-logout" onClick={handleLogout}>
          [LOGOUT]
        </button>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-value">{stats.participants}</div>
            <div className="stat-label">Participants</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.sessions}</div>
            <div className="stat-label">Sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.events}</div>
            <div className="stat-label">Events</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.feedback}</div>
            <div className="stat-label">Feedback</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {stats.avgRating != null ? `${stats.avgRating}★` : "—"}
            </div>
            <div className="stat-label">Avg Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.demographics}</div>
            <div className="stat-label">Demographics</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.quizResponses}</div>
            <div className="stat-label">Quiz Answers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.exitSurveys}</div>
            <div className="stat-label">Exit Surveys</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={`admin-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="admin-empty">No data yet</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col} onClick={() => handleSort(col)}>
                    {col}
                    {sort.col === col && (
                      <span className="sort-arrow">{sort.asc ? "▲" : "▼"}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col} title={String(row[col] ?? "")}>
                      {row[col] != null ? String(row[col]) : "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
