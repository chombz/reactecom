
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

function ProductDetail()
{


    const navigate = useNavigate();
    const { category, slug } = useParams();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);


    useEffect(() =>
    {
        let isMounted = true;

        axios.get(`/api/view-product-detail/${category}/${slug}`).then(res =>
        {
            if (isMounted)
            {
                if (res.data.status === 200)
                {
                    setProduct(res.data.product);

                } else if (res.data.status === 404)
                {
                    navigate('/collections');
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


    //Quantity Increment Decrement in Hooks - Start
    const handleDecrement = () =>
    {
        if (quantity > 1)
        {
            setQuantity(prevCount => prevCount - 1);
        }
    }
    const handleIncrement = () =>
    {
        if (quantity < 10)
        {
            setQuantity(prevCount => prevCount + 1);
        }
    }
    //Quantity Increment Decrement in Hooks - End

    //Add to Cart Function
    const SubmitToCart = (e) =>
    {
        e.preventDefault();

        const data =
        {
            product_id: product.id,
            product_quantity: quantity,
        }

        axios.post(`/api/add-to-cart`, data).then(res =>
        {
            if (res.data.status === 201)
            {
                Swal.fire("Success", res.data.message, "success");
            }
            else if (res.data.status === 409)
            {
                //Already in Cart
                Swal.fire("Warning", res.data.message, "warning");
            }
            else if (res.data.status === 401)
            {
                Swal.fire("Error", res.data.message, "error");
            }
            else if (res.data.status === 401)
            {
                Swal.fire("Warning", res.data.message, "warning");
            }
        });
    }



    if (loading)
    {
        return <h4>Loading Product Details...</h4>;
    }
    else
    {
        var avail_stock = '';
        if (product.quantity > 10)
        {
            avail_stock = <div>
                <label className="btn-sm btn-success px-4 mt-2">In Stock</label>

                <div className="row">
                    <div className="col-md-3 mt-3">
                        <div className="input-group">
                            <button type="button" onClick={handleDecrement} className="input-group-text">-</button>
                            <div className="form-control text-center">{quantity}</div>
                            <button type="button" onClick={handleIncrement} className="input-group-text">+</button>
                        </div>
                    </div>

                    <div className="col-md-3 mt-3">
                        <button type="button" className="btn btn-primary w-100" onClick={SubmitToCart}>Add to Cart</button>
                    </div>
                </div>
            </div>
        }
        else
        {
            avail_stock = <div>
                <label className="btn-sm btn-danger px-4 mt-2">Out of Stock</label>
            </div>
        }
    }

    return (
        <div>
            <div className="py-3 bg-warning">
                <div className="container">
                    <h6>Collections / {product.category.name} / {product.name}</h6>
                </div>
            </div>

            <div className="py-3">
                <div className="container">
                    <div className="row">

                        <div className="col-md-4 border-end">
                            <img src={`http://127.0.0.1:8000/${product.image}`} alt={product.name} className="w-100" />
                        </div>

                        <div className="col-md-8">
                            <h4>
                                {product.name}
                                <span className="float-end badge btn-sm btn-danger badge-pill">{product.brand}</span>
                            </h4>
                            <p>{product.description}</p>
                            <h4 className="mb-1">
                                USD: {product.selling_price}
                                <s className="ms-2"> USD: {product.original_price} </s>
                            </h4>

                            <div>
                                {avail_stock}
                            </div>

                            <button type="button" className="btn btn-danger mt-3">Add to Wishlist</button>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );

}

export default ProductDetail;