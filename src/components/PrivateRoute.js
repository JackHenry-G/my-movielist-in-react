import React, {useEffect} from 'react';
import { useLocation, Link } from 'react-router-dom';
import {useAuth} from "../context/AuthContext";
import {useMessageContext} from "../context/MessageContext";

const PrivateRoute = ({ children }) => {
    const location = useLocation();  // Get the current location (where the user is trying to go)
    const { updateMessage } = useMessageContext();
    const { isAuthenticated } = useAuth();

    // Use useEffect to handle side effects
    useEffect(() => {
        if (!isAuthenticated) {
            updateMessage('You must login to access this data', false);
        }
    }, [isAuthenticated, updateMessage]);  // Dependency array

    // Check if user is authenticated
    if (!isAuthenticated) {
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