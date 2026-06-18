import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function ViewCategory()
{
    //Change title of the page
    document.title = "View Categories";


    const [loading, setLoading] = useState(true);
    const [categorylist, setCategoriesList] = useState([]);

    useEffect(() => 
    {
        let isMounted = true;
        // Corrected the endpoint to match Laravel's api.php
        // Changed from '/api/view-category' to '/api/categories'
        axios.get('/api/categories').then(res =>
        {
            if (isMounted)
            {
                if (res.status === 200)
                {
                    setCategoriesList(res.data.category);
                }
                setLoading(false);
            }
        }).catch(error =>
        {
            if (isMounted)
            {
                console.error("Error fetching categories:", error);
                Swal.fire('Error', 'Could not fetch categories.', 'error');
                setLoading(false);
            }
        });

        return () =>
        {
            isMounted = false;
        };
    }, []);

    const deleteCategory = async (e, id) =>
    {
        e.preventDefault();

        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Deleting...";

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed)
        {
            try
            {
                const res = await axios.delete(`/api/categories/${id}`);
                if (res.data.status === 200)
                {
                    Swal.fire('Deleted!', res.data.message, 'success');
                    setCategoriesList(prevList => prevList.filter(item => item.id !== id));
                } else if (res.data.status === 404)
                {
                    Swal.fire('Error', res.data.message, 'error');
                    thisClicked.innerText = "Delete";
                }
            } catch (error)
            {
                console.error("Delete error:", error);
                Swal.fire('Error!', 'Something went wrong.', 'error');
                thisClicked.innerText = "Delete";
            }
        } else
        {
            thisClicked.innerText = "Delete";
        }
    }

    if (loading)
    {
        return <div className="container"><h4>Loading Categories...</h4></div>;
    }

    const categoryTable = categorylist.map((item) =>
    {
        return (
            <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.slug}</td>
                <td>{item.status === 1 ? 'Shown' : 'Hidden'}</td>
                <td>
                    <Link to={`/admin/edit/${item.id}`} className="btn btn-success btn-sm">Edit</Link>
                </td>
                <td>
                    <button type="button" onClick={(e) => deleteCategory(e, item.id)} className="btn btn-danger btn-sm">Delete</button>
                </td>
            </tr>
        );
    });

    return (
        <div className="container px-4">
            <div className="card mt-4">
                <div className="card-header">
                    <h4>Category List
                        <Link to="/admin/category" className="btn btn-primary btn-sm float-end">Add Category</Link>
                    </h4>
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Status</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorylist.length > 0 ? categoryTable : <tr><td colSpan="6" className="text-center">No categories found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
export default ViewCategory;