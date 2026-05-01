import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Home, User, ClipboardList, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

const Navbar = () => {
    const { role, token, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <ClipboardList className="logo-icon" />
                    <span>EduResolve</span>
                </Link>

                <div className="nav-links">
                    {/* Theme Toggle Button */}
                    <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
                        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {token ? (
                        <>
                            <Link to="/" className="nav-item">
                                <Home size={18} />
                                <span>Home</span>
                            </Link>
                            {role === "admin" && (
                                <Link to="/admindashboard" className="nav-item">
                                    <User size={18} />
                                    <span>Admin Panel</span>
                                </Link>
                            )}
                            {role === "staff" && (
                                <Link to="/staffdashboard" className="nav-item">
                                    <User size={18} />
                                    <span>Staff Panel</span>
                                </Link>
                            )}
                            {role === "user" && (
                                <Link to="/userdashboard" className="nav-item">
                                    <User size={18} />
                                    <span>Dashboard</span>
                                </Link>
                            )}
                            <button onClick={handleLogout} className="logout-btn">
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link-btn">Login</Link>
                            <Link to="/register" className="nav-link-btn primary">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
