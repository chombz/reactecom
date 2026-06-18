import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MasterLayout from './layouts/admin/MasterLayout';
import axios from 'axios';
import Swal from 'sweetalert2';

function AdminPrivateRoute()
{
    //Change title of the page
    document.title = "Admin Dashboard";


    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() =>
    {
        let isMounted = true;

        // This API call checks with your Laravel backend if the token is valid
        // AND if the user has admin privileges.
        axios.get('/api/user').then(res =>
        {
            if (isMounted)
            {
                if (res.status === 200)
                {
                    // Check if the user is an admin.
                    // Your Laravel backend should return 'role_as': 1 for an admin user.
                    if (res.data.role_as === 1)
                    {
                        setIsAuthorized(true);
                    } else
                    {
                        // The user is logged in, but is NOT an admin.
                        Swal.fire({
                            title: 'Access Denied',
                            text: 'You are not authorized to view the admin dashboard.',
                            icon: 'error'
                        });
                        // Redirect them to a general page, like the homepage.
                        navigate('/403');
                    }
                }
                setLoading(false);
            }
        }).catch(err =>
        {
            if (isMounted)
            {
                if (err.response && err.response.status === 401)
                { // 401 Unauthorized
                    // This means the token is invalid or expired.
                    // It's better to redirect to the login page with a clear message.
                    Swal.fire({
                        title: 'Authentication Required',
                        text: 'Please log in to access the admin area.',
                        icon: 'warning'
                    });
                    navigate('/login');
                }
                setLoading(false);
            }
        });

        // Cleanup function to avoid state updates on an unmounted component.
        return () => { isMounted = false; };
    }, [navigate]);

    if (loading)
    {
        // You can replace this with a more sophisticated spinner component.
        return <h1>Loading...</h1>;
    }

    // If authorized, render the admin layout. Otherwise, the user has already been redirected.
    return isAuthorized ? <MasterLayout /> : null;
}

export default AdminPrivateRoute;