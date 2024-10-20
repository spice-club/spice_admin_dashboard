// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        // Optionally, render a loading spinner or placeholder
        return <div>Loading...</div>; // Display loading message
    }

    return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
