import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const initialProductState = {
    category_id: '',
    name: '',
    description: '',
    meta_title: '',
    meta_keyword: '',
    meta_description: '',
    selling_price: '',
    original_price: '',
    quantity: '',
    brand: '',
    featured: false,
    popular: false,
    status: false,
};

function AddProduct()
{
    //Change title of the page
    document.title = "Add Product";

    const [categorylist, setCategorylist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productInput, setProduct] = useState(initialProductState);
    const [picture, setPicture] = useState(null);
    const [errorList, setError] = useState({});

    const handleInput = (e) =>
    {
        const { name, value, type, checked } = e.target;
        setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }

    const handleImage = (e) =>
    {
        if (e.target.files && e.target.files[0])
        {
            setPicture({ image: e.target.files[0] });
        }
    }

    const resetForm = () =>
    {
        setProduct(initialProductState);
        setPicture(null);
        setError({});
        // Also reset the file input visually, as its value is not controlled by React state
        const fileInput = document.querySelector('input[type="file"][name="image"]');
        if (fileInput)
        {
            fileInput.value = '';
        }
    };

    useEffect(() =>
    {
        axios.get(`/api/all-category`).then(res =>
        {
            if (res.data.status === 200)
            {
                // Use the correct key 'categories' and ensure it's an array
                setCategorylist(res.data.categories || []);
            }
            setLoading(false);
        }).catch(error =>
        {
            console.error("Error fetching categories:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Could not fetch categories. Please try again.',
                icon: 'error',
            });
            setLoading(false);
        });

    }, []);

    const SubmitProduct = (e) =>
    {
        e.preventDefault();
        const formData = new FormData();
        if (picture && picture.image)
        {
            formData.append('image', picture.image);
        }
        formData.append('category_id', productInput.category_id);
        formData.append('name', productInput.name);
        formData.append('description', productInput.description);

        formData.append('meta_title', productInput.meta_title);
        formData.append('meta_keyword', productInput.meta_keyword);
        formData.append('meta_description', productInput.meta_description);

        formData.append('selling_price', productInput.selling_price);
        formData.append('original_price', productInput.original_price);
        formData.append('quantity', productInput.quantity);
        formData.append('brand', productInput.brand);

        // Convert boolean to 1 or 0 for the backend
        formData.append('featured', productInput.featured ? '1' : '0');
        formData.append('popular', productInput.popular ? '1' : '0');
        formData.append('status', productInput.status ? '1' : '0');

        // When sending FormData, we must override the default 'Content-Type' header
        // to allow the browser to set it to 'multipart/form-data' with the correct boundary.
        axios.post(`/api/store-product`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(res =>
        {
            if (res.data.status === 200 || res.data.status === 201)
            {
                Swal.fire("Success", res.data.message, "success");
                resetForm();
            } else if (res.data.status === 422)
            {
                Swal.fire("All fields are mandatory", "", "error");
                setError(res.data.errors || {});
            }
        }).catch(error =>
        {
            if (error.response && error.response.status === 422)
            {
                Swal.fire("All fields are mandatory", "", "error");
                setError(error.response.data.errors || {});
            } else
            {
                console.error("An unexpected error occurred:", error);
                Swal.fire('Error', 'An unexpected error occurred. Please try again.', 'error');
            }
        });
    }


    return (
        <div className="container-fluid px-4">
            <div className="card mt-4">
                <div className="card-header">
                    <h4>Add Product
                        <Link to="/admin/view-product" className="btn btn-primary btn-sm float-end">View Product</Link>
                    </h4>
                </div>
                <div className="card-body">
                    <form onSubmit={SubmitProduct} encType="multipart/form-data">

                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Home</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="seotag-tab" data-bs-toggle="tab" data-bs-target="#seotags" type="button" role="tab" aria-controls="seotags" aria-selected="false">SEO Tag</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="otherdetails-tab" data-bs-toggle="tab" data-bs-target="#otherdetails" type="button" role="tab" aria-controls="otherdetails" aria-selected="false">Other Details</button>
                            </li>
                        </ul>

                        <div className="tab-content" id="myTabContent">

                            <div className="tab-pane card-body border fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">

                                <div className="form-group mb-3">
                                    <label> Select Category</label>
                                    <select
                                        name="category_id"
                                        onChange={handleInput}
                                        value={productInput.category_id}
                                        className="form-control">
                                        <option>Select Category</option>
                                        {loading ? (
                                            <option>Loading...</option>
                                        ) : (
                                            categorylist && categorylist.map((item) => (
                                                <option value={item.id} key={item.id}>{item.name}</option>
                                            ))
                                        )
                                        }
                                    </select>

                                    {errorList.category_id && <small className="text-danger">{errorList.category_id}</small>}


                                </div>

                                <div className="form-group mb-3">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        onChange={handleInput}
                                        value={productInput.name} className="form-control" />
                                    {errorList.name && <small className="text-danger">{errorList.name}</small>}
                                </div>

                                <div className="form-group mb-3">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        onChange={handleInput}
                                        value={productInput.description} className="form-control">
                                    </textarea>
                                    {errorList.description && <small className="text-danger">{errorList.description}</small>}
                                </div>
                            </div>

                            <div className="tab-pane card-body border fade" id="seotags" role="tabpanel" aria-labelledby="seotags-tab" tabIndex="0">

                                <div className="form-group mb-3">
                                    <label>Meta Title</label>
                                    <input
                                        type="text"
                                        name="meta_title"
                                        onChange={handleInput}
                                        value={productInput.meta_title} className="form-control" />
                                    {errorList.meta_title && <small className="text-danger">{errorList.meta_title}</small>}
                                </div>
                                <div className="form-group mb-3">
                                    <label>Meta Keyword</label>
                                    <input
                                        type="text"
                                        name="meta_keyword"
                                        onChange={handleInput}
                                        value={productInput.meta_keyword} className="form-control" />
                                    {errorList.meta_keyword && <small className="text-danger">{errorList.meta_keyword}</small>}
                                </div>
                                <div className="form-group mb-3">
                                    <label>Meta Description</label>
                                    <input
                                        type="text"
                                        name="meta_description"
                                        onChange={handleInput}
                                        value={productInput.meta_description} className="form-control" />
                                    {errorList.meta_description && <small className="text-danger">{errorList.meta_description}</small>}
                                </div>
                            </div>

                            <div className="tab-pane card-body border fade" id="otherdetails" role="tabpanel" aria-labelledby="otherdetails-tab" tabIndex="0">

                                <div className="row">
                                    <div className="col-md-4 form-group mb-3">
                                        <label>Selling Price</label>
                                        <input
                                            type="text"
                                            name="selling_price"
                                            onChange={handleInput}
                                            value={productInput.selling_price} className="form-control" />
                                        {errorList.selling_price && <small className="text-danger">{errorList.selling_price}</small>}
                                    </div>
                                    <div className="col-md-4 form-group mb-3">
                                        <label>Original Price</label>
                                        <input
                                            type="text"
                                            name="original_price"
                                            onChange={handleInput}
                                            value={productInput.original_price} className="form-control" />
                                        {errorList.original_price && <small className="text-danger">{errorList.original_price}</small>}
                                    </div>
                                    <div className="col-md-4 form-group mb-3">
                                        <label>Quantity</label>
                                        <input
                                            type="text"
                                            name="quantity"
                                            onChange={handleInput}
                                            value={productInput.quantity} className="form-control" />
                                        {errorList.quantity && <small className="text-danger">{errorList.quantity}</small>}
                                    </div>
                                    <div className="col-md-4 form-group mb-3">
                                        <label>Brand</label>
                                        <input
                                            type="text"
                                            name="brand"
                                            onChange={handleInput}
                                            value={productInput.brand} className="form-control" />
                                        {errorList.brand && <small className="text-danger">{errorList.brand}</small>}
                                    </div>
                                    <div className="col-md-4 form-group mb-3">
                                        <label>Upload Image</label>
                                        <input
                                            type="file"
                                            name="image"
                                            onChange={handleImage}
                                            className="form-control" />
                                        {errorList.image && <small className="text-danger">{errorList.image}</small>}
                                    </div>

                                    <div className="col-md-4 form-group mb-3">
                                        <label>Featured (checked=shown)</label>
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            onChange={handleInput}
                                            checked={productInput.featured}
                                            className="form-check-input" />
                                    </div>
                                    <div className="col-md-4 form-group mb-3">
                                        <label>Popular (checked=shown)</label>
                                        <input
                                            type="checkbox"
                                            name="popular"
                                            onChange={handleInput}
                                            checked={productInput.popular}
                                            className="form-check-input" />
                                    </div>
                                    <div className="col-md-4 form-group mb-3">
                                        <label>Status (checked=hidden)</label>
                                        <input
                                            type="checkbox"
                                            name="status"
                                            onChange={handleInput}
                                            checked={productInput.status}
                                            className="form-check-input" />
                                    </div>
                                </div>

                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary px-4 me-2">Submit</button>

                    </form>
                </div>
            </div>
        </div>
    )
}
export default AddProduct;