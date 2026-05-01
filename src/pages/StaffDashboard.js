import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { CheckCircle2, Clock, Mail, User, RefreshCcw } from "lucide-react";
import "./StaffDashboard.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const StaffDashboard = () => {
  const [staffName, setStaffName] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState({});

  const token = localStorage.getItem("token");

  // ✅ FIX: Wrapped in useCallback with token dependency
  const fetchData = useCallback(async () => {
    if (!token) return;

    try {
      setRefreshing(true);

      const userRes = await axios.get(`${BACKEND_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStaffName(userRes.data.name);

      const complaintRes = await axios.get(`${BACKEND_URL}/staff/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedComplaints = complaintRes.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setComplaints(sortedComplaints);

    } catch (err) {
      console.error("Error fetching staff data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  // ✅ FIXED useEffect dependency
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNoteChange = (id, value) => {
    setResolutionNotes((prev) => ({ ...prev, [id]: value }));
  };

  const resolveComplaint = async (complaintId) => {
    const note = resolutionNotes[complaintId];

    if (!note || note.trim().length < 5) {
      alert("Please provide a descriptive resolution note (min 5 chars).");
      return;
    }

    if (!window.confirm("Are you sure you want to mark this as resolved?")) return;

    try {
      await axios.post(
        `${BACKEND_URL}/staff/resolve`,
        { complaintId, resolutionNote: note },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComplaints((prev) =>
        prev.map((c) =>
          c._id === complaintId
            ? { ...c, status: "Resolved", resolutionNote: note }
            : c
        )
      );

    } catch (err) {
      console.error("Error resolving complaint:", err);
      alert("Failed to resolve complaint.");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Syncing assigned tasks...</p>
      </div>
    );
  }

  return (
    <div className="staff-dashboard-wrapper">
      <div className="container">

        <header className="staff-header">
          <div>
            <h1>Staff Workspace</h1>
            <p>
              Welcome back, {staffName}. You have{" "}
              {complaints.filter((c) => c.status !== "Resolved").length} active tasks.
            </p>
          </div>

          <button
            className={`btn-refresh ${refreshing ? "spinning" : ""}`}
            onClick={fetchData}
          >
            <RefreshCcw size={20} />
          </button>
        </header>

        <div className="staff-stats">

          <div className="mini-stat-card glass-card">
            <span className="count">{complaints.length}</span>
            <span className="label">Total Assigned</span>
          </div>

          <div className="mini-stat-card glass-card">
            <span className="count text-warning">
              {complaints.filter(
                (c) =>
                  c.status.toLowerCase() === "pending" ||
                  c.status.toLowerCase() === "assigned"
              ).length}
            </span>
            <span className="label">Active Tasks</span>
          </div>

          <div className="mini-stat-card glass-card">
            <span className="count text-success">
              {complaints.filter(
                (c) => c.status.toLowerCase() === "resolved"
              ).length}
            </span>
            <span className="label">Resolved</span>
          </div>

        </div>

        <div className="tasks-section">
          <h2>Assigned Grievances</h2>

          {complaints.length === 0 ? (
            <div className="empty-state glass-card">
              <CheckCircle2 size={48} />
              <h3>Clear Workspace!</h3>
              <p>No complaints are currently assigned to you.</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className={`task-card glass-card ${complaint.status.toLowerCase()}`}
                >
                  <div className="task-header">
                    <span className={`status-pill ${complaint.status.toLowerCase()}`}>
                      {complaint.status === "Resolved"
                        ? <CheckCircle2 size={14} />
                        : <Clock size={14} />}
                      {complaint.status}
                    </span>

                    <span className="ref-id">
                      #{complaint._id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  <div className="task-body">
                    <h3>{complaint.title}</h3>
                    <p>{complaint.description}</p>

                    <div>
                      <User size={14} /> {complaint.user?.name || "Anonymous"}
                    </div>
                    <div>
                      <Mail size={14} /> {complaint.user?.email || "N/A"}
                    </div>

                    {complaint.status !== "Resolved" && (
                      <textarea
                        placeholder="Resolution note..."
                        value={resolutionNotes[complaint._id] || ""}
                        onChange={(e) =>
                          handleNoteChange(complaint._id, e.target.value)
                        }
                      />
                    )}

                    {complaint.status !== "Resolved" && (
                      <button
                        onClick={() => resolveComplaint(complaint._id)}
                      >
                        <CheckCircle2 size={16} /> Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
