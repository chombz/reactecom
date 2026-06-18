import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Bootstrap CSS and JS
import 'bootstrap/dist/js/bootstrap.bundle.js';

// Import your custom CSS
import '../../assests/admin/css/styles.css';

// Parts of the layout
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from "./Footer";

// Other imports
import routes from '../../routes/routes.js';

const MasterLayout = () =>
{
    useEffect(() =>
    {
        // This script is from the sb-admin template. It handles the sidebar toggle.
        const sidebarToggle = document.body.querySelector('#sidebarToggle');
        if (!sidebarToggle)
        {
            return;
        }

        const toggleHandler = (event) =>
        {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        };

        sidebarToggle.addEventListener('click', toggleHandler);

        // Cleanup the event listener on component unmount
        return () =>
        {
            sidebarToggle.removeEventListener('click', toggleHandler);
        };
    }, []);
    return (
        <div className="sb-nav-fixed">
            <Navbar />
            <div id="layoutSidenav">
                <div id="layoutSidenav_nav">
                    <Sidebar />
                </div>
                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid px-4">
                            <Routes>
                                {routes.map((route, idx) =>
                                {
                                    return (
                                        route.component && (
                                            <Route
                                                key={idx}
                                                path={route.path}
                                                element={<route.component />}
                                            />
                                        )
                                    );
                                })}
                                <Route index element={<Navigate replace to="dashboard" />} />
                            </Routes>
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default MasterLayout;