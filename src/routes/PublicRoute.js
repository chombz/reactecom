import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * This component protects public routes (like /login, /register) from authenticated users.
 * If a user is already logged in, it redirects them to the appropriate page
 * based on their role, preventing them from seeing the login/register pages again.
 */
function PublicRoute({ children })
{
    const isAuthenticated = !!localStorage.getItem('auth_token');

    if (isAuthenticated) {
        try {
            const user = JSON.parse(localStorage.getItem('auth_user'));
            // If user is an admin, redirect to the admin dashboard.
            if (user && user.role_as === 1) {
                return <Navigate to="/admin/dashboard" replace />;
            }
        } catch (e) {
            console.error("Could not parse user data from localStorage", e);
        }
        // For regular users, redirect to the homepage.
        return <Navigate to="/" replace />;
    }

    // If not authenticated, render the children (e.g., the Login or Register page).
    return children;
}

export default PublicRoute;