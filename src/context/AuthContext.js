// AuthContext.js
import React, {createContext, useContext, useState} from 'react';
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken'));

    const getJwtToken = () => localStorage.getItem('jwtToken');

    const isTokenValid = ( token ) => {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            // Check if the token is valid (not expired)
            return decodedToken.exp > currentTime;
        } catch (error) {
            console.error("Failed to decode jwt token: ", error);
            return false
        }
    }

    const addAuthTokenToRequestHeaders = ( requestConfig ) => {
        const token = getJwtToken()

        if (token && isTokenValid(token)) {
            console.log("Token valid. Adding to request headers.")
            requestConfig.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.log("Token invalid. Removing from storage and not adding to headers.");
            localStorage.removeItem("jwtToken");
        }
        return requestConfig;
    }

    const login = (token, username, email) => {
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ addAuthTokenToRequestHeaders, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
