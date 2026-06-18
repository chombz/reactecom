import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate, Link } from "react-router-dom";

function ViewOrder()
{
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);

    useEffect(() =>
    {
        let isMounted = true;

        axios.get(`/api/admin/view-order/${id}`).then(res =>
        {
            if (isMounted)
            {
                if (res.data.status === 200)
                {
                    setOrder(res.data.order);
                }
                else if (res.data.status === 404)
                {
                    Swal.fire("Error", "Order not found", "error");
                    navigate('/admin/orders');
                }
                setLoading(false);
            }
        }).catch(err =>
        {
            if (isMounted)
            {
                console.error("Error fetching order:", err);
                Swal.fire("Error", "Could not fetch order details", "error");
                setLoading(false);
            }
        });

        return () =>
        {
            isMounted = false;
        };
    }, [id, navigate]);

    if (loading)
    {
        return <h4>Loading Order Details...</h4>;
    }

    if (!order)
    {
        return <h4>Order not found</h4>;
    }

    const orderTotal = order.order_items?.reduce((sum, item) =>
        sum + (item.price * item.quantity), 0) || 0;

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Order Details</h1>
            <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                <li className="breadcrumb-item"><Link to="/admin/orders">Orders</Link></li>
                <li className="breadcrumb-item active">Order #{order.id}</li>
            </ol>

            <div className="row">
                {/* Customer Information */}
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header">
                            <i className="fas fa-user me-1"></i>
                            Customer Information
                        </div>
                        <div className="card-body">
                            <p><strong>Name:</strong> {order.firstname} {order.lastname}</p>
                            <p><strong>Email:</strong> {order.email}</p>
                            <p><strong>Phone:</strong> {order.phone}</p>
                            <p><strong>Address:</strong> {order.address}</p>
                            <p><strong>City:</strong> {order.city}</p>
                            <p><strong>Country:</strong> {order.state}</p>
                        </div>
                    </div>
                </div>

                {/* Order Information */}
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header">
                            <i className="fas fa-info-circle me-1"></i>
                            Order Information
                        </div>
                        <div className="card-body">
                            <p><strong>Order ID:</strong> {order.id}</p>
                            <p><strong>Tracking No:</strong> <span className="badge bg-info">{order.tracking_no}</span></p>
                            <p><strong>Payment Mode:</strong>
                                <span className={`badge ms-2 ${order.payment_mode === 'paypal' ? 'bg-primary' : 'bg-success'}`}>
                                    {order.payment_mode === 'paypal' ? 'PayPal' : 'Cash on Delivery'}
                                </span>
                            </p>
                            <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                            <p><strong>Status:</strong> <span className="badge bg-warning text-dark">{order.status || 'Pending'}</span></p>
                            <p><strong>Remark:</strong> {order.remark}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-shopping-bag me-1"></i>
                    Order Items
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Product ID</th>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.order_items?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.product_id}</td>
                                        <td>{item.product?.name || 'Product'}</td>
                                        <td>${item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="4" className="text-end"><strong>Grand Total:</strong></td>
                                    <td><strong>${orderTotal.toFixed(2)}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Link to="/admin/orders" className="btn btn-secondary">
                <i className="fas fa-arrow-left me-1"></i> Back to Orders
            </Link>
        </div>
    );
}

export default ViewOrder;