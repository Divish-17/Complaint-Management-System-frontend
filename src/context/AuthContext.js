import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            if (token) {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUser(res.data);
                    setRole(res.data.role);
                    localStorage.setItem("role", res.data.role); // Keep in sync
                } catch (error) {
                    console.error("Token verification failed:", error);
                    logout();
                }
            }
            setLoading(false);
        };

        verifyToken();
    }, [token]);

    const login = (newToken, newRole) => {
        setToken(newToken);
        setRole(newRole);
        localStorage.setItem("token", newToken);
        localStorage.setItem("role", newRole);
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    };

    return (
        <AuthContext.Provider value={{ user, token, role, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
