import React from "react";
import { Link } from 'react-router-dom';

function Page404()
{
    return(
        <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="text-center p-5 bg-white rounded shadow-sm">
                <h1 className="display-1 fw-bold text-primary">404</h1>
                <p className="fs-3">
                    <i className="fas fa-exclamation-triangle text-warning me-2"></i> Page Not Found
                </p>
                <p className="lead">
                    Oops! The page you are looking for does not exist.
                </p>
                <Link to="/" className="btn btn-primary mt-3">
                    <i className="fas fa-home me-2"></i> Go to Homepage
                </Link>
            </div>
        </div>
    );
}export default Page404;