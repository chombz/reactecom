import React from 'react';
import { Link } from 'react-router-dom';

function Thankyou()
{
    return (
        <div>
            <div className="py-3 bg-warning">
                <div className="container">
                    <h6>Home / Thank you</h6>
                </div>
            </div>

            <div className="py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card shadow-lg border-0">
                                <div className="card-body text-center p-5">
                                    {/* Success Icon */}
                                    <div className="mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-check-circle-fill text-success" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                        </svg>
                                    </div>

                                    {/* Thank You Message */}
                                    <h2 className="text-success mb-3">Order Placed Successfully!</h2>
                                    <h5 className="text-muted mb-4">Thank you for shopping with Chombz Shopz!</h5>

                                    <p className="text-secondary mb-4">
                                        Your order has been received and is being processed.
                                        You will receive an email confirmation shortly.
                                    </p>

                                    <hr className="my-4" />

                                    {/* Action Buttons */}
                                    <div className="d-flex justify-content-center gap-3">
                                        <Link to="/collections" className="btn btn-warning px-4">
                                            Continue Shopping
                                        </Link>
                                        <Link to="/" className="btn btn-outline-secondary px-4">
                                            Go to Home
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Thankyou;