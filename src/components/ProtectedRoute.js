import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { token, role, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loader"></div>
                <p>Verifying authentication...</p>
            </div>
        );
    }

    if (!token) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect to home if role is not allowed for this route
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
