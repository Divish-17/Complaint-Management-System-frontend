// src/components/StudentDashboard.js

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function StudentDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BACKEND_URL}/complaints`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setComplaints(res.data);

    } catch (error) {
      console.error("Error fetching student complaints:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  if (loading) {
    return <p>Loading complaints...</p>;
  }

  return (
    <div>
      <h2>🎓 Student Dashboard</h2>
      <h3>Your Complaints:</h3>

      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <ul>
          {complaints.map((complaint) => (
            <li key={complaint._id}>
              <strong>{complaint.title}</strong> - {complaint.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentDashboard;
