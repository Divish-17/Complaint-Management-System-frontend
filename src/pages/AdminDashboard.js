import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Users, ClipboardList, CheckCircle, Clock, PieChart as PieIcon, BarChart3, Search, UserPlus, Megaphone, Send } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });

  // Announcement states
  const [showAnnounceForm, setShowAnnounceForm] = useState(false);
  const [announceData, setAnnounceData] = useState({ title: "", content: "", importance: "Info" });
  const [sendingNotice, setSendingNotice] = useState(false);

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [complaintsRes, staffRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/complaints`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/staff`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setComplaints(complaintsRes.data);
      setFilteredComplaints(complaintsRes.data);
      setStaff(staffRes.data);

      // Calculate Stats
      const total = complaintsRes.data.length;
      const pending = complaintsRes.data.filter(c => c.status.toLowerCase() === 'pending').length;
      const resolved = complaintsRes.data.filter(c => c.status.toLowerCase() === 'resolved').length;
      setStats({ total, pending, resolved });

    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    setSendingNotice(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/announcements`, announceData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Announcement posted successfully!");
      setAnnounceData({ title: "", content: "", importance: "Info" });
      setShowAnnounceForm(false);
    } catch (err) {
      console.error("Error posting announcement:", err);
      alert("Failed to post announcement.");
    } finally {
      setSendingNotice(false);
    }
  };

  // Memoized Chart Data
  const chartData = useMemo(() => {
    // Status Data
    const statusCounts = complaints.reduce((acc, current) => {
      const status = current.status || 'Pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusChart = Object.keys(statusCounts).map(key => ({
      name: key,
      value: statusCounts[key]
    }));

    // Priority Data
    const priorityCounts = complaints.reduce((acc, current) => {
      const priority = current.priority || 'Medium';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, { 'Low': 0, 'Medium': 0, 'High': 0, 'Urgent': 0 });

    const priorityChart = [
      { name: 'Low', count: priorityCounts['Low'] },
      { name: 'Medium', count: priorityCounts['Medium'] },
      { name: 'High', count: priorityCounts['High'] },
      { name: 'Urgent', count: priorityCounts['Urgent'] },
    ];

    return { statusChart, priorityChart };
  }, [complaints]);

  // Handle Search and Filtering
  useEffect(() => {
    let result = complaints;

    if (searchTerm) {
      result = result.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "All") {
      result = result.filter(c => c.status.toLowerCase() === filterStatus.toLowerCase());
    }

    if (filterPriority !== "All") {
      result = result.filter(c => c.priority === filterPriority);
    }

    setFilteredComplaints(result);
  }, [searchTerm, filterStatus, filterPriority, complaints]);

  const assignComplaint = async (complaintId, staffId) => {
    if (!staffId) {
      alert("Please select a staff member first.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/admin/assign`,
        { complaintId, staffId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(); // refresh data
    } catch (error) {
      console.error("Error assigning complaint:", error);
    }
  };

  const getStatusClass = (status) => {
    const s = status.toLowerCase();
    if (s === 'pending') return 'status-pending';
    if (s === 'resolved') return 'status-resolved';
    return 'status-progress';
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  if (loading) return (
    <div className="dashboard-loading">
      <div className="loader"></div>
      <p>Loading administration panel...</p>
    </div>
  );

  return (
    <div className="admin-dashboard-wrapper">
      <div className="container">
        <header className="admin-header">
          <div>
            <h1>Administrative Dashboard</h1>
            <p>Institutional Grievance Oversight & Management</p>
          </div>
          <div className="admin-quick-stats">
            <button className="btn-announce-mode" onClick={() => setShowAnnounceForm(!showAnnounceForm)}>
              <Megaphone size={18} />
              {showAnnounceForm ? "Return to Stats" : "Post Notice"}
            </button>
            <div className="mini-stat">
              <span className="label">Total</span>
              <span className="value">{stats.total}</span>
            </div>
            <div className="mini-stat">
              <span className="label">Pending</span>
              <span className="value text-warning">{stats.pending}</span>
            </div>
            <div className="mini-stat">
              <span className="label">Resolved</span>
              <span className="value text-success">{stats.resolved}</span>
            </div>
          </div>
        </header>

        {showAnnounceForm ? (
          <div className="announcement-form-container glass-card">
            <div className="form-header">
              <Megaphone size={24} />
              <h3>Broadcast New Announcement</h3>
            </div>
            <form onSubmit={handlePostAnnouncement}>
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="E.g. Library Closure Notice"
                    value={announceData.title}
                    onChange={(e) => setAnnounceData({ ...announceData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Importance</label>
                  <select
                    value={announceData.importance}
                    onChange={(e) => setAnnounceData({ ...announceData, importance: e.target.value })}
                  >
                    <option value="Info">Information (Blue)</option>
                    <option value="Warning">Warning (Yellow)</option>
                    <option value="Urgent">Urgent (Red)</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  placeholder="Provide details for the students and staff..."
                  value={announceData.content}
                  onChange={(e) => setAnnounceData({ ...announceData, content: e.target.value })}
                  required
                ></textarea>
              </div>
              <div className="form-footer">
                <button type="submit" className="btn btn-primary" disabled={sendingNotice}>
                  <Send size={18} style={{ marginRight: '8px' }} />
                  {sendingNotice ? "Broadcasting..." : "Confirm & Post Notice"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Analytics Section */}
            <div className="analytics-section">
              <div className="analytics-card glass-card">
                <div className="analytics-header">
                  <PieIcon size={20} />
                  <h3>Status Distribution</h3>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={chartData.statusChart}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.statusChart.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ReTooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="analytics-card glass-card">
                <div className="analytics-header">
                  <BarChart3 size={20} />
                  <h3>Priority Breakdown</h3>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData.priorityChart}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <ReTooltip />
                      <Bar dataKey="count" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="admin-stats-grid">
              <div className="stat-card glass-card">
                <div className="stat-icon primary"><ClipboardList /></div>
                <div className="stat-info">
                  <h3>{stats.total}</h3>
                  <p>Total Complaints</p>
                </div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-icon warning"><Clock /></div>
                <div className="stat-info">
                  <h3>{stats.pending}</h3>
                  <p>Pending Review</p>
                </div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-icon success"><CheckCircle /></div>
                <div className="stat-info">
                  <h3>{stats.resolved}</h3>
                  <p>Successfully Resolved</p>
                </div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-icon info"><Users /></div>
                <div className="stat-info">
                  <h3>{staff.length}</h3>
                  <p>Active Staff Members</p>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="content-card glass-card">
          <div className="card-header-row admin-filter-header">
            <h2>Grievance Registry</h2>
            <div className="admin-controls">
              <div className="admin-search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="ID, Title or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="admin-filters">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                  <option value="All">All Priority</option>
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Grievance Details</th>
                  <th>Submitted By</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Oversight</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-40">No matching records found.</td>
                  </tr>
                ) : (
                  filteredComplaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td className="font-mono text-xs">#{complaint._id.slice(-6).toUpperCase()}</td>
                      <td>
                        <div className="complaint-cell">
                          <span className="title">{complaint.title}</span>
                          <span className="category">{complaint.category || 'General'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="user-cell">
                          <span className="name">{complaint.user?.name || "Unknown User"}</span>
                          <span className="email">{complaint.user?.email || ""}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`prio-tag prio-${complaint.priority?.toLowerCase()}`}>
                          {complaint.priority || "Medium"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-status ${getStatusClass(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td>
                        {complaint.assignedTo ? (
                          <div className="assigned-cell">
                            <span className="assigned-name">{complaint.assignedTo.name}</span>
                          </div>
                        ) : (
                          <span className="text-light italic">Unassigned</span>
                        )}
                      </td>
                      <td>
                        {complaint.status === "Resolved" ? (
                          <span className="action-completed"><CheckCircle size={16} /> Closed</span>
                        ) : (
                          <div className="assignment-control">
                            <select
                              value={selectedStaff[complaint._id] || ""}
                              onChange={(e) =>
                                setSelectedStaff({
                                  ...selectedStaff,
                                  [complaint._id]: e.target.value,
                                })
                              }
                              className="select-mini"
                            >
                              <option value="">Staff</option>
                              {staff.map((member) => (
                                <option key={member._id} value={member._id}>
                                  {member.name}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => assignComplaint(complaint._id, selectedStaff[complaint._id])}
                              className="btn-assign"
                              title="Assign Staff"
                            >
                              <UserPlus size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
