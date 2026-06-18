import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function Checkout()
{
    const navigate = useNavigate();
    const { category, slug } = useParams();

    // Redirect to home if not authenticated
    if (!localStorage.getItem('auth_token'))
    {
        navigate('/');
        Swal.fire("Warning", "Login to access Cart Page", "error");
    }

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    var totalCartPrice = 0;

    const [checkoutInput, setCheckoutInput] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
    });

    const [error, setError] = useState([]);

    useEffect(() =>
    {
        let isMounted = true;

        axios.get(`/api/cart`).then(res =>
        {
            if (isMounted)
            {
                if (res.data.status === 200)
                {
                    setCart(res.data.cart);
                } else if (res.data.status === 401)
                {
                    navigate('/');
                    Swal.fire("Warning", res.data.message, "error");
                }
                setLoading(false);
            }
        }).catch(err =>
        {
            if (isMounted)
            {
                console.error("Error fetching product details:", err);
                Swal.fire("Error", "Could not fetch data. Please try again later.", "error");
                setLoading(false);
            }
        });

        return () =>
        {
            isMounted = false;
        };
    }, [category, slug, navigate]);

    const handleInput = (e) =>
    {
        e.persist();
        setCheckoutInput({ ...checkoutInput, [e.target.name]: e.target.value });
    }

    const submitOrder = (e, payment_mode) =>
    {
        e.preventDefault();
        var data = {
            firstname: checkoutInput.firstname,
            lastname: checkoutInput.lastname,
            email: checkoutInput.email,
            phone: checkoutInput.phone,
            address: checkoutInput.address,
            city: checkoutInput.city,
            state: checkoutInput.state,
            payment_mode: payment_mode,
        }

        // Payment mode specific logic
        switch (payment_mode)
        {
            case 'cod':
                axios.post(`/api/place-order`, data).then(res =>
                {
                    if (res.data.status === 200)
                    {
                        Swal.fire("Order Placed Successfully", res.data.message, "success");
                        setError([]);
                        navigate('/thankyou');
                    } else if (res.data.status === 422)
                    {
                        Swal.fire("All fields are mandatory", "", "error");
                        setError(res.data.errors);
                    }
                });
                break;

            case 'payonline':
                axios.post(`/api/validate-order`, data).then(res =>
                {
                    if (res.data.status === 200)
                    {
                        setError([]);
                        var myModal = new window.bootstrap.Modal(document.getElementById('payOnlineModal'));
                        myModal.show();
                    } else if (res.data.status === 422)
                    {
                        Swal.fire("All fields are mandatory", "", "error");
                        setError(res.data.errors);
                    }
                });
                break;
            default:
                break;
        }
    }

    if (loading)
    {
        return <h4>Loading Checkout...</h4>;
    }

    // Calculate total before rendering
    cart.forEach(item =>
    {
        totalCartPrice += item.product.selling_price * item.product_qty;
    });

    var checkout_HTML = '';
    if (cart.length > 0)
    {
        checkout_HTML = (
            <div>
                <div className="row">
                    <div className="col-md-7">
                        <div className="card">
                            <div className="card-header">
                                <h4>Billing Details</h4>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">First Name</label>
                                            <input type="text" name="firstname" onChange={handleInput} value={checkoutInput.firstname} className="form-control" />
                                            <small className="text-danger">{error.firstname}</small>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Last Name</label>
                                            <input type="text" name="lastname" onChange={handleInput} value={checkoutInput.lastname} className="form-control" />
                                            <small className="text-danger">{error.lastname}</small>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">Email Address</label>
                                            <input type="text" name="email" onChange={handleInput} value={checkoutInput.email} className="form-control" />
                                            <small className="text-danger">{error.email}</small>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">Phone Number</label>
                                            <input type="text" name="phone" onChange={handleInput} value={checkoutInput.phone} className="form-control" />
                                            <small className="text-danger">{error.phone}</small>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">Address</label>
                                            <textarea name="address" onChange={handleInput} value={checkoutInput.address} className="form-control" rows="2"></textarea>
                                            <small className="text-danger">{error.address}</small>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">City</label>
                                            <input type="text" name="city" onChange={handleInput} value={checkoutInput.city} className="form-control" />
                                            <small className="text-danger">{error.city}</small>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">Country</label>
                                            <input type="text" name="state" onChange={handleInput} value={checkoutInput.state} className="form-control" />
                                            <small className="text-danger">{error.state}</small>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <button type="button" className="btn btn-primary mx-1" onClick={(e) => submitOrder(e, 'cod')}>Place Order</button>
                                            <button type="button" className="btn btn-warning mx-1" onClick={(e) => submitOrder(e, 'payonline')}>Pay Online</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-5">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th width="50%">Product</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.product.name}</td>
                                        <td>{item.product.selling_price}</td>
                                        <td>{item.product_qty}</td>
                                        <td>{item.product.selling_price * item.product_qty}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="3" className="text-end">Grand Total</td>
                                    <td className="text-end">${totalCartPrice}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    } else
    {
        checkout_HTML = (
            <div>
                <div className="card card-body py-5 text-center shadow-sm">
                    <h4>Your Shopping Cart is Empty</h4>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Payment Modal */}
            <div className="modal fade" id="payOnlineModal" tabIndex="-1" aria-labelledby="payOnlineModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="payOnlineModalLabel">Pay Online</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <hr />
                            <PayPalScriptProvider options={{
                                "client-id": "AVB55kwtEhPdY-gPfKyQKWZWxaHmV5r0ZgUo4-EUwZA8xkvGltBAm5IwWyN8bopXO-R1qdnBaNelTZZ5"
                            }}>
                                <PayPalButtons
                                    createOrder={(data, actions) =>
                                    {
                                        return actions.order.create({
                                            purchase_units: [{
                                                amount: {
                                                    value: totalCartPrice
                                                }
                                            }]
                                        });
                                    }}
                                    onApprove={(data, actions) =>
                                    {
                                        return actions.order.capture().then((details) =>
                                        {
                                            console.log(details);

                                            const orderData = {
                                                firstname: checkoutInput.firstname,
                                                lastname: checkoutInput.lastname,
                                                email: checkoutInput.email,
                                                phone: checkoutInput.phone,
                                                address: checkoutInput.address,
                                                city: checkoutInput.city,
                                                state: checkoutInput.state,
                                                payment_mode: 'paypal',
                                                payment_id: details.id,
                                            };

                                            axios.post(`/api/place-order`, orderData).then(res =>
                                            {
                                                if (res.data.status === 200)
                                                {
                                                    // Close the PayPal modal properly
                                                    const modalElement = document.getElementById('payOnlineModal');
                                                    const modal = window.bootstrap.Modal.getInstance(modalElement);
                                                    if (modal)
                                                    {
                                                        modal.hide();
                                                    }

                                                    // Remove backdrop manually (Bootstrap sometimes leaves it)
                                                    const backdrop = document.querySelector('.modal-backdrop');
                                                    if (backdrop)
                                                    {
                                                        backdrop.remove();
                                                    }

                                                    // Remove modal-open class from body
                                                    document.body.classList.remove('modal-open');
                                                    document.body.style.removeProperty('padding-right');

                                                    // Navigate after a short delay to ensure modal is closed
                                                    setTimeout(() =>
                                                    {
                                                        Swal.fire({
                                                            icon: "success",
                                                            title: "Success!",
                                                            text: "Payment completed and order placed!",
                                                            showConfirmButton: false,
                                                            timer: 1500
                                                        }).then(() =>
                                                        {
                                                            navigate('/thankyou');
                                                        });
                                                    }, 100);
                                                }
                                            }).catch(err =>
                                            {
                                                console.error("Order placement error:", err);
                                                Swal.fire("Error", "Failed to place order. Please contact support.", "error");
                                            });
                                        });
                                    }}
                                />
                            </PayPalScriptProvider>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-3 bg-warning">
                <div className="container">
                    <h6>Home / Checkout</h6>
                </div>
            </div>

            <div className="py-4">
                <div className="container">
                    {checkout_HTML}
                </div>
            </div>
        </div>
    );
}

export default Checkout;