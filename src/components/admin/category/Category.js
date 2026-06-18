import axios from "axios";
import React, { useState } from "react";
import Swal from 'sweetalert2';

function Category()
{
    //Change title of the page
    document.title = "Add Category";


    // Initial state for the category form
    const initialCategoryState = {
        name: '',
        description: '',
        status: false, // Use boolean for checkboxes
        meta_title: '',
        meta_keyword: '', // Corrected typo from meta_keyboard
        meta_descrip: '',
    };

    const [categoryInput, setCategory] = useState(initialCategoryState);
    const [errors, setErrors] = useState({});

    //deals with setCategory
    const handleInput = (e) =>
    {
        const { name, value, type, checked } = e.target;
        setCategory({ ...categoryInput, [name]: type === 'checkbox' ? checked : value });
    }

    //deal with submitCategory
    const submitCategory = (e) =>
    {
        e.preventDefault();

        // Prepare data for submission, converting boolean status to 0 or 1 if needed by backend
        const data = {
            ...categoryInput,
            status: categoryInput.status ? 1 : 0,
        };

        //send data
        // Corrected the endpoint to match Laravel's api.php
        axios.post('/api/categories', data).then(res =>
        {
            // By default, axios enters the .then() block only for HTTP status codes in the 2xx range,
            // which indicates success. So we can directly handle the success case here.
            Swal.fire("Success", res.data.message, "success");
            setCategory(initialCategoryState); // Reset form by resetting state
            setErrors({}); // Clear errors
        }).catch(error =>
        {
            // Axios enters the .catch() block for non-2xx status codes.
            // We can check for specific error statuses here.
            if (error.response && error.response.status === 422)
            { // Laravel validation error
                Swal.fire("Validation Error", "Please check the fields.", "error");
                setErrors(error.response.data.errors || {});
            } else
            {
                // Handle other errors (e.g., 401, 403, 500) or network issues.
                // The global interceptor in App.js might handle some of these.
                console.error("An error occurred while submitting the category:", error);
                Swal.fire("Error", "An unexpected error occurred.", "error");
            }
        });
    }

    // Create a flat array of error messages from the errors object
    const errorList = Object.values(errors).flat();

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4"> Add Category</h1>

            {errorList.length > 0 && (
                <div className="alert alert-danger mb-3">
                    {errorList.map((error, index) => (<p className="mb-0" key={index}>{error}</p>))}
                </div>
            )}

            <form onSubmit={submitCategory} id="CATEGORY_FORM">
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
                            <input type="text" name="name" onChange={handleInput} value={categoryInput.name} className="form-control" />
                            {errors.name && <span className="text-danger">{errors.name}</span>}
                        </div>

                        <div className="form-group mb-3">
                            <label>Description</label>
                            <textarea name="description" onChange={handleInput} value={categoryInput.description} className="form-control"></textarea>
                        </div>

                        <div className="form-group mb-3">
                            <label>Status</label>
                            <input type="checkbox" name="status" onChange={handleInput} checked={categoryInput.status} className="ms-2" /> Status (checked = Hidden)
                        </div>
                    </div>

                    <div className="tab-pane card-body border fade" id="seo-tags" role="tabpanel" aria-labelledby="seo-tags-tab" tabIndex="0">
                        <div className="form-group mb-3">
                            <label>Meta Title</label>
                            <input type="text" name="meta_title" onChange={handleInput} value={categoryInput.meta_title} className="form-control" />
                            {errors.meta_title && <span className="text-danger">{errors.meta_title}</span>}
                        </div>

                        <div className="form-group mb-3">
                            <label>Meta Keyword</label>
                            <textarea name="meta_keyword" onChange={handleInput} value={categoryInput.meta_keyword} className="form-control" />
                        </div>

                        <div className="form-group mb-3">
                            <label>Meta Description</label>
                            <textarea name="meta_descrip" onChange={handleInput} value={categoryInput.meta_descrip} className="form-control" />
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary px-4 float-end mt-3">Submit</button>
            </form>
        </div>
    );
}
export default Category;