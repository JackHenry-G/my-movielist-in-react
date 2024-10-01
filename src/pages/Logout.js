import React from "react";
import {useAuth} from "../context/AuthContext";

const LogoutPage = () => {
    const {logout} = useAuth();

    const handleLogout = () => {
        logout(); // call logout from context (clears auth token from storage)
        window.location.href = '/login'; // return user to login page
    }

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutPage