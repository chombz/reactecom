import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ViewCategories()
{
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    useEffect(() =>
    {
        let isMounted = true;


        axios.get('/api/all-category').then(res =>
        {
            if (isMounted)
            {
                if (res.data.status === 200)
                {
                    //console.log(res.data.categories);
                    setCategories(res.data.categories);
                    setLoading(false);
                }
            }
        });

        return () =>
        {
            isMounted = false;
        };
    }, []);


    // Render the categories page
    if (loading)
    {
        return <h4>Loading Categories...</h4>;
    }
    else
    {
        var showCategoriesList = '';
        showCategoriesList = categories.map((item, idx) =>
        {
            return (
                <div className="col-md-4" key={idx}>
                    <div className="card">
                        <div className="card-body">
                            <Link to={`/collections/${item.slug}`}>
                                <h5>{item.name}</h5>
                            </Link>
                        </div>
                    </div>
                </div >
            )
        })
    }


    return (
        <div>
            <div className="py-3 bg-warning">
                <div className="container">
                    <h6>Category Page</h6>
                </div>
            </div>

            <div className="py-3">
                <div className="container">
                    <div className="row">
                        {showCategoriesList.length > 0 ? (
                            showCategoriesList
                        ) : (
                            <div className="col-md-12">
                                <h4>No Collections Available</h4>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ViewCategories;