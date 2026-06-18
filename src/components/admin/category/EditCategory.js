import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";


function EditCategory()
{
    //Change title of the page
    document.title = "Edit Category";


    const navigate = useNavigate();
    const { id } = useParams();
    const [categoryInput, setCategory] = useState({});
    const [loading, setLoading] = useState(true); // Add loading state
    const [errors, setErrors] = useState({});

    useEffect(() =>
    {
        let isMounted = true;
        // Use the correct endpoint from your api.php
        axios.get(`/api/edit-category/${id}`).then(res =>
        {
            if (isMounted)
            {
                if (res.data.status === 200)
                {
                    setCategory(res.data.category);
                } else if (res.data.status === 404)
                {
                    Swal.fire("Error", res.data.message, "error");
                    navigate('/admin/view-category');
                }
                setLoading(false);
            }
        }).catch(error =>
        {
            if (isMounted)
            {
                console.error("Error fetching category:", error);
                Swal.fire('Error', 'Could not fetch category details.', 'error');
                navigate('/admin/view-category');
                setLoading(false);
            }
        });

        return () =>
        {
            isMounted = false;
        };
    }, [id, navigate]);

    const handleInput = (e) =>
    {
        const { name, value, type, checked } = e.target;
        setCategory(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }

    const updateCategory = async (e) =>
    {
        e.preventDefault();

        const data = {
            ...categoryInput,
            status: categoryInput.status ? 1 : 0, // Convert boolean to integer for backend
        };

        try
        {
            // Use the correct update endpoint from your api.php
            const res = await axios.put(`/api/update-category/${id}`, data);
            if (res.data.status === 200)
            {
                Swal.fire("Success", res.data.message, "success");
                setErrors({});
                navigate('/admin/view');
            }
        } catch (error)
        {
            if (error.response && error.response.status === 422)
            {
                Swal.fire("Validation Error", "Please check the fields.", "error");
                setErrors(error.response.data.errors || {});
            }
        }
    }

    if (loading)
    {
        return <div className="container"><h4>Loading Category...</h4></div>;
    }

    return (
        <div className="container px-4">
            <div className="card mt-4">
                <div className="card-header">
                    <h4>
                        Edit Category
                        <Link to="/admin/view" className="btn btn-primary btn-sm float-end">BACK</Link>
                    </h4>
                </div>

                <div className="card-body">
                    <form onSubmit={updateCategory}>
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Home</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="seo-tags-tab" data-bs-toggle="tab" data-bs-target="#seo-tags" type="button" role="tab" aria-controls="seo-tags" aria-selected="false">SEO tags</button>
                            </li>
                        </ul>

                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane card-body border fade show active" id="home" role="tabpanel" aria-labelledby="home-tab" tabIndex="0">

                                <div className="form-group mb-3">
                                    <label>Name</label>
                                    <input type="text" name="name" onChange={handleInput} value={categoryInput.name || ''} className="form-control" />
                                    {errors.name && <span className="text-danger">{errors.name}</span>}
                                </div>

                                <div className="form-group mb-3">
                                    <label>Description</label>
                                    <textarea name="description" onChange={handleInput} value={categoryInput.description || ''} className="form-control"></textarea>
                                </div>

                                <div className="form-group mb-3">
                                    <label>Status</label>
                                    <input type="checkbox" name="status" onChange={handleInput} checked={categoryInput.status === 1 || categoryInput.status === true} className="ms-2" /> Status (checked = Hidden)
                                </div>
                            </div>

                            <div className="tab-pane card-body border fade" id="seo-tags" role="tabpanel" aria-labelledby="seo-tags-tab" tabIndex="0">
                                <div className="form-group mb-3">
                                    <label>Meta Title</label>
                                    <input type="text" name="meta_title" onChange={handleInput} value={categoryInput.meta_title || ''} className="form-control" />
                                    {errors.meta_title && <span className="text-danger">{errors.meta_title}</span>}
                                </div>

                                <div className="form-group mb-3">
                                    <label>Meta Keyword</label>
                                    <textarea name="meta_keyword" onChange={handleInput} value={categoryInput.meta_keyword || ''} className="form-control" />
                                </div>

                                <div className="form-group mb-3">
                                    <label>Meta Description</label>
                                    <textarea name="meta_descrip" onChange={handleInput} value={categoryInput.meta_descrip || ''} className="form-control" />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary px-4 float-end mt-3">Update</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default EditCategory;