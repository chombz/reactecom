import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate, Link } from "react-router-dom";

function ViewProduct()
{
    const navigate = useNavigate();
    const { slug } = useParams(); // Get the 'slug' from the URL
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);

    useEffect(() =>
    {
        let isMounted = true;
        axios.get(`/api/fetchProducts/${slug}`).then(res =>
        {
            if (isMounted)
            {
                if (res.data.status === 200)
                {
                    setProducts(res.data.products || []);
                    setCategory(res.data.category || {});
                }
                else if (res.data.status === 404)
                {
                    // Use navigate for redirection
                    navigate('/collections');
                    Swal.fire("Warning", res.data.message, "error");
                }
                setLoading(false);
            }
        }).catch(err =>
        {
            if (isMounted)
            {
                console.error("Error fetching products:", err);
                Swal.fire("Error", "Could not fetch data. Please try again later.", "error");
                setLoading(false);
            }
        });

        return () =>
        {
            isMounted = false;
        };
    }, [slug, navigate]);




    if (loading)
    {
        return <h4>Loading Products...</h4>
    }
    else
    {
        var showProductList = '';
        if (products.length > 0)
        {

            showProductList = products.map((item, idx) =>
            {
                return (
                    // It's better to use a unique ID from the item for the key if available.
                    <div className="col-md-3" key={item.id}>
                        <div className="card">
                            <Link to={`/collections/${item.category.slug}/${item.slug}`}>
                                <img src={`http://localhost:8000/${item.image}`} className="w-100" alt={item.name} />
                            </Link>
                            <div className="card-body">
                                <Link to={`/collections/${item.category.slug}/${item.slug}`}>
                                    <h5>{item.name}</h5>
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            });
        }
        else
        {
            showProductList =
                <div className="col-md-12">
                    <h4>No Product Available for {category.name}</h4>
                </div>
        }
    }

    return (
        <div>
            <div className="py-3 bg-warning">
                <div className="container">
                    <h6>Collections / {category.name}</h6>
                </div>
            </div>

            <div className="py-3">
                <div className="container">
                    <div className="row">
                        {showProductList}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewProduct;