import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {useAuth} from "../context/AuthContext";
import {useErrorContext} from "../context/ErrorContext";

const PrivateRoute = ({ children }) => {
    const location = useLocation();  // Get the current location (where the user is trying to go)
    const { updateMessage } = useErrorContext();
    const { isAuthenticated } = useAuth();

    console.log("Private route checking for authentication: " + isAuthenticated);
    console.log(localStorage.getItem('jwtToken'));


    // Check if user is authenticated
    if (!isAuthenticated) {
        updateMessage('You must login to access this data', false);
        // If not authenticated, show a message with a login link
        // also pass in the location (the route the user tried to access), so that we can return the user
        // to that page after logging in
        return (
            <div>
                <p>
                    <Link to="/login" state={{ from: location }}>Go to the login page</Link>
                </p>
            </div>
        );
    }

    // If authenticated, render the child page (protected content)
    return children;
};


export default PrivateRoute;