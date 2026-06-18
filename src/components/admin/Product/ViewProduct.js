import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ViewProduct()
{
    const [loading, setLoading] = useState(true);
    const [viewProduct, setViewProduct] = useState([]);

    //Change title of the page
    document.title = "View Products";

    useEffect(() =>
    {
        axios.get(`/api/view-products`).then(res =>
        {
            if (res.data.status === 200)
            {
                setViewProduct(res.data.products);
                setLoading(false);
            }
            else if (res.data.status === 404)
            {
                alert(res.data.message);
            }
        });
    }, []);



    var display_Productdata = "";
    if (loading)
    {
        return <h4>View Products Loading...</h4>
    }
    else
    {
        var ProdStatus = '';
        display_Productdata = viewProduct.map((item) =>
        {
            if (item.status === 0)
            {
                ProdStatus = 'Shown';
            }
            else if (item.status === 1)
            {
                ProdStatus = 'Hidden';
            }
            return (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.category.name}</td>
                    <td>{item.category_id}</td>
                    <td>{item.name}</td>
                    <td>{item.selling_price}</td>
                    <td>{item.brand}</td>
                    <td><img src={`http://127.0.0.1:8000/${item.image}`} width="50px" alt={item.name} /></td>
                    <td>
                        <Link to={`/admin/edit-product/${item.id}`} className="btn btn-success btn-sm">Edit</Link>
                    </td>
                    <td>
                        {ProdStatus}
                    </td>
                </tr>
            );
        });
    }

    return (
        <div className="container mt-4">
            <div className="card-header">
                <h4>View Products
                    <Link to={'/admin/add-product'} className="btn btn-primary btn-sm float-end">Add Product</Link>
                </h4>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Category Name</th>
                                <th>Category ID</th>
                                <th>Product Name</th>
                                <th>Selling Price</th>
                                <th>Brand</th>
                                <th>Image</th>
                                <th>Edit</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {display_Productdata}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}

export default ViewProduct;