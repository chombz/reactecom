import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

function Cart()
{
    const navigate = useNavigate();
    const { category, slug } = useParams();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    var totalCartPrice = 0;


    // Redirect to home if not authenticated
    if (!localStorage.getItem('auth_token'))
    {
        navigate('/');
        Swal.fire("Warning", "Login to access Cart Page", "error");
    }


    //-------------------------------------- Update Cart Quantity -----------------------------------------//
    const handleIncrement = (cart_id) =>
    {
        setCart(cart =>
            cart.map((item) =>
                cart_id === item.id ? { ...item, product_qty: item.product_qty + (item.product_qty < item.product.quantity ? 1 : 0) } : item
            )
        );
        updateCartQuantity(cart_id, 'increment');
    }
    const handleDecrement = (cart_id) =>
    {
        setCart(cart =>
            cart.map((item) =>
                cart_id === item.id && item.product_qty > 1 ? { ...item, product_qty: item.product_qty - (item.product_qty > 1 ? 1 : 0) } : item
            )
        );
        updateCartQuantity(cart_id, 'decrement');
    }

    function updateCartQuantity(cart_id, scope)
    {
        axios.put(`/api/cart-updatequantity/${cart_id}/${scope}`).then(res =>
        {
            if (res.data.status === 200)
            {
                Swal.fire("Success", res.data.message, "success");
            }
        });
    }
    //-------------------------------------- Update Cart Quantity -----------------------------------------//




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



    //delete cart item
    const deleteCartItem = (e, cart_id) =>
    {
        e.preventDefault();
        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Removing";

        axios.delete(`/api/delete-cartitem/${cart_id}`).then(res =>
        {
            if (res.data.status === 200)
            {
                Swal.fire("Success", res.data.message, "success");

                setCart(prevCart => prevCart.filter(item => item.id !== cart_id));
            } else
            {
                Swal.fire("Warning", res.data.message, "error");
                thisClicked.innerText = "Remove";
            }
        });
    }


    if (loading)
    {
        return <h4>Loading Cart...</h4>;
    }

    var cart_HTML = '';
    if (cart.length > 0)
    {
        cart_HTML =
            <div>
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product</th>
                                <th className="text-center">Price</th>
                                <th className="text-center">Quantity</th>
                                <th className="text-center">Total Price</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item, index) =>
                            {
                                totalCartPrice += item.product.selling_price * item.product_qty;
                                return (
                                    <tr key={index}>
                                        <td width="10%">
                                            <img src={`http://127.0.0.1:8000/${item.product.image}`} alt={item.product.name} width="50px" height="50px" />
                                        </td>
                                        <td>{item.product.name}</td>
                                        <td width="15%" className="text-center">{item.product.selling_price}</td>
                                        <td width="15%">
                                            <div className="input-group">
                                                <button type="button" onClick={() => handleDecrement(item.id)} className="input-group-text">-</button>
                                                <div className="form-control text-center">{item.product_qty}</div>
                                                <button type="button" onClick={() => handleIncrement(item.id)} className="input-group-text">+</button>
                                            </div>
                                        </td>
                                        <td width="15%" className="text-center">{item.product.selling_price * item.product_qty}</td>
                                        <td width="10%">
                                            <button type="button" onClick={(e) => deleteCartItem(e, item.id)} className="btn btn-danger btn-sm">Remove</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="row">
                    <div className="col-md-8"></div>
                    <div className="col-md-4">
                        <div className="card card-body mt-3">
                            <h4>Subtotal:
                                <span className="float-end">{totalCartPrice}</span>
                            </h4>
                            <h4>Grand Total:
                                <span className="float-end">{totalCartPrice}</span>
                            </h4>
                            <hr />
                            <button onClick={() => navigate('/checkout')} className="btn btn-primary w-100">Proceed to Checkout</button>
                        </div>
                    </div>
                </div>
            </div>
    }
    else
    {
        cart_HTML =
            <div>
                <div className="card card-body py-5 text-center shadow-sm">
                    <h4>Your Shopping Cart is Empty</h4>
                </div>
            </div>
    }

    return (
        <div>
            <div className="py-3 bg-warning">
                <div className="container">
                    <h6>Home / Cart</h6>
                </div>
            </div>

            <div className="py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            {cart_HTML}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Cart;