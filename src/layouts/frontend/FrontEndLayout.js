import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const FrontendLayout = () =>
{
    return (
        <div>
            <Navbar />
            <div className="container py-4">
                <Outlet />
            </div>
        </div>
    );
}

export default FrontendLayout;