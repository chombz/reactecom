import React from "react";
import { Link } from 'react-router-dom';

function Page403()
{
    return(
        <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="text-center p-5 bg-white rounded shadow-sm">
                <h1 className="display-1 fw-bold text-danger">403</h1>
                <p className="fs-3">
                    <i className="fas fa-ban text-danger me-2"></i> Access Denied
                </p>
                <p className="lead">
                    You do not have the required permissions to view this page.
                </p>
                <Link to="/login" className="btn btn-primary mt-3">
                    <i className="fas fa-sign-in-alt me-2"></i> Go to Login Page
                </Link>
            </div>
        </div>
    );
}export default Page403;