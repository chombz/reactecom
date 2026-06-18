import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const Navbar = () =>
{
    const logoutSubmit = (e) =>
    {
        e.preventDefault();

        axios.post('/api/logout').then(res =>
        {
            // A 2xx status from the server will trigger this 'then' block.
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_name');

            Swal.fire({
                title: "Logged Out",
                text: "You have been logged out successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            // A full page reload is more robust for auth state changes
            // as it clears all component state and re-evaluates routing.
            window.location.href = '/login';
        }).catch(error =>
        {
            // This will catch network errors or non-2xx responses.
            // The axios interceptor in App.js should handle 401s.
            console.error("Logout failed:", error);

            // Still attempt to log out locally as the token might be invalid.
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_name');
            window.location.href = '/login';
        });
    }

    const authName = localStorage.getItem('auth_name');

    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <Link className="navbar-brand ps-3" to="/admin">Admin Panel</Link>
            {/* <!-- Sidebar Toggle--> */}
            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle">
                <i className="fas fa-bars"></i></button>

            <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                {/* Search form can go here if needed */}
            </form>

            {/* We are replacing the dropdown with a simpler list */}
            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4 align-items-center">
                <li className="nav-item">
                    <Link className="nav-link" to="/admin/profile">
                        <i className="fas fa-user fa-fw"></i> {authName || 'User'}
                    </Link>
                </li>
                {/* This is the always-visible logout button */}
                <li className="nav-item ms-2">
                    <button type="button" onClick={logoutSubmit} className="btn btn-danger btn-sm">Logout</button>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;