import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


function Login()
{
    const navigate = useNavigate();
    const [loginInput, setLoginInput] = useState({
        email: '',
        password: '',
        error_list: {},
    });

    const handleInput = (e) =>
    {
        e.persist();
        setLoginInput({ ...loginInput, [e.target.name]: e.target.value });
    };

    const loginSubmit = (e) =>
    {
        e.preventDefault();

        const data =
        {
            email: loginInput.email,
            password: loginInput.password,
        };

        axios.post('/api/login', data).then(res =>
        {
            if (res.data.status === 200) 
            {
                // Store token and user data in local storage
                localStorage.setItem('auth_token', res.data.token);
                localStorage.setItem('auth_user', JSON.stringify(res.data.user));

                Swal.fire
                    ({
                        title: "Success",
                        text: res.data.message,
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });

                // ** This is the critical part for redirection **
                if (res.data.role === 'admin') 
                {
                    // Check role from response
                    navigate('/admin/dashboard');
                }
                else 
                {
                    navigate('/'); // Redirect regular users to the homepage
                }
            }
            else if (res.data.status === 401) 
            {
                // Handle invalid credentials
                Swal.fire
                    ({
                        title: "Login Failed",
                        text: res.data.message,
                        icon: "warning"
                    });
            }
            else 
            {
                // Handle validation errors (e.g., email or password format is wrong)
                setLoginInput
                    ({
                        ...loginInput, error_list: res.data.validation_errors || {}
                    });
            }
        }).catch(error => 
        {
            // This catches network errors or other issues with the request
            console.error("An unexpected login error occurred:", error);
            Swal.fire
                ({
                    title: "Login Error",
                    text: "An unexpected error occurred. Please check your connection and try again.",
                    icon: "error",
                });
        });
    };

    return (
        <div>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header"><h4>Login</h4></div>
                            <div className="card-body">
                                <form onSubmit={loginSubmit}>
                                    <div className="form-group mb-3">
                                        <label>Email ID</label>
                                        <input type="email" name="email" onChange={handleInput} value={loginInput.email} className="form-control" />
                                        <span className="text-danger">{loginInput.error_list.email}</span>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Password</label>
                                        <input type="password" name="password" onChange={handleInput} value={loginInput.password} className="form-control" />
                                        <span className="text-danger">{loginInput.error_list.password}</span>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Login</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Login;