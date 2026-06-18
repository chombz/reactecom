import axios from "axios";
import React from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from 'react-router-dom';

function Navbar()
{
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('auth_token');

    const logoutSubmit = (e) =>
    {
        e.preventDefault();

        axios.post('/api/logout').then(res =>
        {
            if (res.data.status === 200)
            {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user'); // Correctly remove the user object
                Swal.fire({
                    title: "Logged Out",
                    text: res.data.message,
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
                navigate('/login');
            }
        });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container">
                <Link className="navbar-brand" to="/">E-Commerce Site</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Contact</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/collections">Collections</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/cart">Cart</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/vieworders">Orders</Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {isAuthenticated ? (
                            <li className="nav-item">
                                <button type="button" onClick={logoutSubmit} className="btn btn-danger">Logout</button>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;