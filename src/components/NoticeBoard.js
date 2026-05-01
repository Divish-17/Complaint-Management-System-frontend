import React, { useEffect, useState } from "react";
import axios from "axios";
import { Megaphone, AlertTriangle, Info, BellRing, Clock } from "lucide-react";
import "./NoticeBoard.css";

const NoticeBoard = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/announcements`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAnnouncements(res.data);
            } catch (err) {
                console.error("Error fetching announcements:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, [token]);

    const getImportanceIcon = (importance) => {
        switch (importance) {
            case "Urgent": return <BellRing size={20} className="text-error" />;
            case "Warning": return <AlertTriangle size={20} className="text-warning" />;
            default: return <Info size={20} className="text-info" />;
        }
    };

    if (loading) return null;
    if (announcements.length === 0) return null;

    return (
        <div className="notice-board glass-card">
            <div className="notice-header">
                <Megaphone size={20} />
                <h2>Institutional Announcements</h2>
            </div>
            <div className="notices-list">
                {announcements.map((note) => (
                    <div key={note._id} className={`notice-item importance-${note.importance.toLowerCase()}`}>
                        <div className="notice-icon-side">
                            {getImportanceIcon(note.importance)}
                        </div>
                        <div className="notice-content-side">
                            <div className="notice-title-row">
                                <h4>{note.title}</h4>
                                <span className="notice-time">
                                    <Clock size={12} />
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p>{note.content}</p>
                            <span className="posted-by">Posted by Admin</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NoticeBoard;
