import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function Orders()
{
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    useEffect(() =>
    {
        let isMounted = true;
        document.title = "Orders - Admin";

        axios.get(`/api/admin/orders`).then(res =>
        {
            if (isMounted)
            {
                if (res.data.status === 200)
                {
                    setOrders(res.data.orders);
                }
                else if (res.data.status === 404)
                {
                    Swal.fire("Warning", res.data.message, "error");
                }
                setLoading(false);
            }
        }).catch(err =>
        {
            if (isMounted)
            {
                console.error("Error fetching orders:", err);
                Swal.fire("Error", "Could not fetch orders. Please try again later.", "error");
                setLoading(false);
            }
        });

        return () =>
        {
            isMounted = false;
        };
    }, []);

    if (loading)
    {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h4 className="mt-3">Loading Orders...</h4>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Orders</h1>
            <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                <li className="breadcrumb-item active">Orders</li>
            </ol>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-shopping-cart me-1"></i>
                    All Orders
                </div>
                <div className="card-body">
                    {orders.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Tracking No</th>
                                        <th>Customer Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Payment Mode</th>
                                        <th>Status</th>
                                        <th>Order Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>
                                                <span className="badge bg-info">{order.tracking_no}</span>
                                            </td>
                                            <td>{order.firstname} {order.lastname}</td>
                                            <td>{order.email}</td>
                                            <td>{order.phone}</td>
                                            <td>
                                                <span className={`badge ${order.payment_mode === 'paypal' ? 'bg-primary' : 'bg-success'}`}>
                                                    {order.payment_mode === 'paypal' ? 'PayPal' : 'Cash on Delivery'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge bg-warning text-dark">
                                                    {order.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <Link
                                                    to={`/admin/view-order/${order.id}`}
                                                    className="btn btn-sm btn-primary"
                                                >
                                                    <i className="fas fa-eye"></i> View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="alert alert-info text-center">
                            <i className="fas fa-info-circle me-2"></i>
                            No orders found
                        </div>
                    )}
                </div>
            </div>

            {/* Orders Summary Card */}
            <div className="row">
                <div className="col-xl-3 col-md-6">
                    <div className="card bg-primary text-white mb-4">
                        <div className="card-body">
                            <h4>{orders.length}</h4>
                            <div>Total Orders</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card bg-success text-white mb-4">
                        <div className="card-body">
                            <h4>{orders.filter(o => o.payment_mode === 'cod').length}</h4>
                            <div>COD Orders</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card bg-info text-white mb-4">
                        <div className="card-body">
                            <h4>{orders.filter(o => o.payment_mode === 'paypal').length}</h4>
                            <div>PayPal Orders</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card bg-warning text-dark mb-4">
                        <div className="card-body">
                            <h4>
                                ${orders.reduce((total, order) =>
                                {
                                    // Calculate total from order items if available
                                    const orderTotal = order.order_items?.reduce((sum, item) =>
                                        sum + (item.price * item.quantity), 0) || 0;
                                    return total + orderTotal;
                                }, 0).toFixed(2)}
                            </h4>
                            <div>Total Revenue</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Orders;