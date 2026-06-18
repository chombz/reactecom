import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () =>
{
    return (
        <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
                <div className="nav">
                    {/* CORE SECTION */}
                    <div className="sb-sidenav-menu-heading">CORE</div>

                    <Link className="nav-link" to="/admin/dashboard">
                        <div className="sb-nav-link-icon">
                            <i className="fas fa-tachometer-alt"></i>
                        </div>
                        Dashboard
                    </Link>

                    <Link className="nav-link" to="/admin/profile">
                        <div className="sb-nav-link-icon">
                            <i className="fas fa-user"></i>
                        </div>
                        Profile
                    </Link>

                    <Link className="nav-link" to="/admin/orders">
                        <div className="sb-nav-link-icon">
                            <i className="fas fa-user"></i>
                        </div>
                        Orders
                    </Link>

                    {/* CATEGORY SECTION */}
                    <div className="sb-sidenav-menu-heading">CATEGORIES</div>

                    <Link className="nav-link" to="/admin/category">
                        <div className="sb-nav-link-icon">
                            <i className="fas fa-folder-plus"></i>
                        </div>
                        Add Category
                    </Link>

                    <Link className="nav-link" to="/admin/view">
                        <div className="sb-nav-link-icon">
                            <i className="fas fa-list"></i>
                        </div>
                        View Categories
                    </Link>


                    {/* PRODUCTS SECTION */}
                    <div className="sb-sidenav-menu-heading">PRODUCTS</div>

                    <Link className="nav-link" to="/admin/add-product">
                        <div className="sb-nav-link-icon">
                            <i className="fas fa-box"></i>
                        </div>
                        Add Product
                    </Link>

                    <Link className="nav-link" to="/admin/view-product">
                        <div className="sb-nav-link-icon">
                            <i className="fas fa-boxes"></i>
                        </div>
                        View Products
                    </Link>

                    {/* ORDERS SECTION */}
                    <div className="sb-sidenav-menu-heading">ORDERS</div>

                    <Link className="nav-link" to="/admin/orders">
                        <div className="sb-nav-link-icon">
                            <i className="fas fa-shopping-cart"></i>
                        </div>
                        View Orders
                    </Link>

                    {/* REPORTS SECTION (Optional) */}
                    <div className="sb-sidenav-menu-heading">REPORTS</div>

                    <Link className="nav-link" to="/admin/charts">
                        <div className="sb-nav-link-icon">
                            <i className="fas fa-chart-line"></i>
                        </div>
                        Sales Charts
                    </Link>

                    <Link className="nav-link" to="/admin/tables">
                        <div className="sb-nav-link-icon">
                            <i className="fas fa-table"></i>
                        </div>
                        Reports
                    </Link>
                </div>
            </div>

            <div className="sb-sidenav-footer">
                <div className="small">Logged in as:</div>
                <strong>Admin User</strong>
            </div>
        </nav>
    );
}

export default Sidebar;