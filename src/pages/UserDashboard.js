import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  RefreshCcw,
  Search,
  Filter,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import NoticeBoard from "../components/NoticeBoard";
import "./UserDashboard.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function UserDashboard() {
  const navigate = useNavigate();
  const { user: authUser, token } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  // ✅ FIXED: Wrapped in useCallback
  const fetchData = useCallback(async () => {
    if (!token) return;

    try {
      setRefreshing(true);

      const complaintsRes = await axios.get(`${BACKEND_URL}/complaints`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setComplaints(complaintsRes.data);
      setFilteredComplaints(complaintsRes.data);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  // ✅ FIXED: Proper dependencies
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Search & Filter Effect
  useEffect(() => {
    let result = complaints;

    if (searchTerm) {
      result = result.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "All") {
      result = result.filter(
        c => c.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    if (filterPriority !== "All") {
      result = result.filter(c => c.priority === filterPriority);
    }

    setFilteredComplaints(result);
  }, [searchTerm, filterStatus, filterPriority, complaints]);

  const deleteComplaint = async (complaintId) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;

    try {
      await axios.delete(`${BACKEND_URL}/complaints/${complaintId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComplaints(prev =>
        prev.filter(c => c._id !== complaintId)
      );

    } catch (error) {
      alert("Error deleting complaint: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return <CheckCircle2 size={16} className="text-success" />;
      case "pending":
        return <Clock size={16} className="text-warning" />;
      case "assigned":
        return <RefreshCcw size={16} className="text-info" />;
      default:
        return <AlertCircle size={16} className="text-light" />;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="container">

        {/* Header */}
        <div className="dashboard-header-block">
          <div>
            <h1>Hello, {authUser?.name || "Student"}!</h1>
            <p className="text-secondary">
              Welcome to your complaint management portal.
            </p>
          </div>

          <div className="header-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/addcomplaint")}
            >
              <Plus size={18} style={{ marginRight: "8px" }} />
              New Complaint
            </button>

            <button
              className={`btn btn-outline ${refreshing ? "spinning" : ""}`}
              onClick={fetchData}
              title="Refresh"
            >
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>

        <NoticeBoard />

        {/* Stats */}
        <div className="stats-row">

          <div className="stat-mini-card">
            <div className="stat-icon-bg primary">
              <Clock size={20} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{complaints.length}</span>
              <span className="stat-label">Total Grievances</span>
            </div>
          </div>

          <div className="stat-mini-card">
            <div className="stat-icon-bg warning">
              <AlertTriangle size={20} />
            </div>
            <div className="stat-details">
              <span className="stat-value">
                {complaints.filter(
                  c =>
                    c.status.toLowerCase() === "pending" ||
                    c.status.toLowerCase() === "assigned"
                ).length}
              </span>
              <span className="stat-label">Active Issues</span>
            </div>
          </div>

          <div className="stat-mini-card">
            <div className="stat-icon-bg success">
              <CheckCircle2 size={20} />
            </div>
            <div className="stat-details">
              <span className="stat-value">
                {complaints.filter(
                  c => c.status.toLowerCase() === "resolved"
                ).length}
              </span>
              <span className="stat-label">Resolved</span>
            </div>
          </div>

        </div>

        {/* Filters */}
        <div className="filter-bar glass-card">

          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by ID or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters">

            <div className="filter-group">
              <Filter size={16} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="filter-group">
              <AlertTriangle size={16} />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

          </div>
        </div>

        {/* Complaints */}
        <div className="complaints-list-section">

          {filteredComplaints.length === 0 ? (
            <div className="empty-state glass-card">
              <AlertCircle size={48} />
              <h3>No match found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="complaints-grid">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className={`complaint-card glass-card priority-border-${complaint.priority?.toLowerCase()}`}
                >
                  <div className="card-header">
                    <span className="status-badge">
                      {getStatusIcon(complaint.status)}
                      {complaint.status}
                    </span>
                  </div>

                  <div className="card-body">
                    <h3>{complaint.title}</h3>
                    <p>{complaint.description}</p>

                    <div className="meta-info">
                      <Calendar size={14} />
                      <span>
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button
                      className="btn-icon delete-btn"
                      onClick={() => deleteComplaint(complaint._id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
