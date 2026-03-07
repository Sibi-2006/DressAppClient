import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-darkBg">
                <div className="w-16 h-16 border-4 border-neonCyan border-t-transparent rounded-full animate-spin shadow-neon-cyan"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
    }

    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
