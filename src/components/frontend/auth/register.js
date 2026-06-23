import React, { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Register()
{
    const navigate = useNavigate();
    const [registerInput, setRegister] = useState({
        name: "",
        email: "",
        password: "",
        error_list: {},
    });

    const [loading, setLoading] = useState(false);

    const handleInput = (e) =>
    {
        e.persist();
        setRegister({
            ...registerInput,
            [e.target.name]: e.target.value,
        });
    }

    const RegisterSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);

        const data = {
            name: registerInput.name,
            email: registerInput.email,
            password: registerInput.password,
        }

        // Show loading alert
        Swal.fire({
            title: 'Creating Account...',
            text: 'Please wait while we set up your account.',
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () =>
            {
                Swal.showLoading();
            }
        });

        try
        {
            // Send registration request to the backend
            const response = await axios.post('/api/register', data);

            if (response.data.status === 200)
            {
                console.log('Registration successful:', response.data);
                // Store token if needed
                localStorage.setItem('auth_token', response.data.token);
                localStorage.setItem('auth_user', JSON.stringify(response.data.user));

                // Show success alert with user info
                Swal.fire({
                    title: 'Welcome!',
                    html: `
                        <div style="text-align: center;">
                            <h4>Registration Successful!</h4>
                            <p><strong>Name:</strong> ${response.data.user.name}</p>
                            <p><strong>Email:</strong> ${response.data.user.email}</p>
                            <p>You can now access your dashboard.</p>
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonText: 'Continue',
                    confirmButtonColor: '#28a745',
                    showCancelButton: true,
                    cancelButtonText: 'Stay Here',
                    cancelButtonColor: '#6c757d'
                }).then((result) =>
                {
                    if (result.isConfirmed)
                    {
                        if (response.data.user.role_as === 1)
                        { // Admin
                            navigate('/admin/dashboard');
                        } else
                        { // Regular User
                            navigate('/');
                        }
                    } else
                    {
                        // Clear form if user wants to stay
                        setRegister({
                            name: "",
                            email: "",
                            password: "",
                            error_list: {},
                        });
                    }
                });
            }
        } catch (error)
        {
            if (error.response && error.response.status === 422)
            {
                // Validation errors
                setRegister({
                    ...registerInput,
                    error_list: error.response.data.validation_errors || {}
                });

                // Create error list for display
                const errorMessages = Object.values(error.response.data.validation_errors || {})
                    .flat()
                    .join('<br>');

                // Show validation error alert
                Swal.fire({
                    title: 'Validation Errors',
                    html: `
                        <div style="text-align: left;">
                            <p><strong>Please fix the following errors:</strong></p>
                            <ul style="list-style: none; padding: 0;">
                                ${errorMessages.split('<br>').map(msg => `<li>• ${msg}</li>`).join('')}
                            </ul>
                        </div>
                    `,
                    icon: 'error',
                    confirmButtonText: 'Fix Errors',
                    confirmButtonColor: '#dc3545'
                });
            } else if (error.response && error.response.status === 500)
            {
                // Server error
                Swal.fire({
                    title: 'Server Error',
                    text: 'There was a problem with the server. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#dc3545'
                });
            } else if (error.code === 'NETWORK_ERROR' || !error.response)
            {
                // Network error
                Swal.fire({
                    title: 'Connection Error',
                    text: 'Unable to connect to the server. Please check your internet connection.',
                    icon: 'warning',
                    confirmButtonText: 'Retry',
                    confirmButtonColor: '#ffc107'
                });
            } else
            {
                // Other errors
                console.error('Registration error:', error);

                // Show general error alert
                Swal.fire({
                    title: 'Registration Failed',
                    text: error.response?.data?.message || 'Something went wrong. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                    confirmButtonColor: '#dc3545'
                });
            }
        } finally
        {
            setLoading(false);
        }
    }

    const handleFormReset = () =>
    {
        Swal.fire({
            title: 'Clear Form?',
            text: 'Are you sure you want to clear all form fields?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Clear',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d'
        }).then((result) =>
        {
            if (result.isConfirmed)
            {
                setRegister({
                    name: "",
                    email: "",
                    password: "",
                    error_list: {},
                });

                Swal.fire({
                    title: 'Form Cleared!',
                    text: 'All fields have been reset.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    }

    return (
        <div>
            <Navbar />

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-xl-6">
                        <div className="card">
                            <div className="card-body">
                                <h4>Register</h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={RegisterSubmit}>
                                    <div className="form-group mb-3">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            onChange={handleInput}
                                            value={registerInput.name}
                                            className="form-control"
                                        />
                                        {registerInput.error_list.name && (
                                            <span className="text-danger">{registerInput.error_list.name[0]}</span>
                                        )}
                                    </div>

                                    <div className="form-group mb-3">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            onChange={handleInput}
                                            value={registerInput.email}
                                            className="form-control"
                                        />
                                        {registerInput.error_list.email && (
                                            <span className="text-danger">{registerInput.error_list.email[0]}</span>
                                        )}
                                    </div>

                                    <div className="form-group mb-3">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            onChange={handleInput}
                                            value={registerInput.password}
                                            className="form-control"
                                        />
                                        {registerInput.error_list.password && (
                                            <span className="text-danger">{registerInput.error_list.password[0]}</span>
                                        )}
                                    </div>

                                    <div className="form-group mb-3 d-flex gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? 'Registering...' : 'Register'}
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={handleFormReset}
                                            disabled={loading}
                                        >
                                            Clear Form
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;