// src/utils/axiosInstance.js
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
import CustomError from "../error/CustomError";

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
});

// Function to set up interceptors
export const setupAxiosInterceptors = (navigate, location, updateMessage) => {
    // Create an interceptor for requests
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("jwtToken");
            if (token) {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                // Check if the token is valid (not expired)
                const isTokenValid = decodedToken.exp > currentTime;

                if (isTokenValid) {
                    console.log("Token valid. Adding to headers.");
                    config.headers['Authorization'] = `Bearer ${token}`;
                } else {
                    console.log("Token invalid. Removing from storage");
                    localStorage.removeItem("jwtToken");
                }
            }
            return config;
        },
        (error) => {
            console.error("Error setting up request:", error.message);
            return Promise.reject(error);
        }
    );

    // Create an interceptor for responses
    axiosInstance.interceptors.response.use(
        response => {
            return response;
        },
        error => {
            const response = error.response;
            console.error("AXIOS RESPONSE: ", response);

            let customErrorMessage = 'An error occurred. Something went wrong.';
            if (response) {
                // Extract relevant information
                const status = response.status;
                const data = response.data;
                console.log("Data = " + data);

                switch (status) {
                    case 401:
                        customErrorMessage = 'The resource you tried to access requires an account. Please login.';
                        if (data) {
                            customErrorMessage = data;
                        }
                        updateMessage(customErrorMessage);
                        localStorage.clear();
                        navigate('/login');
                        break;
                    case 403:
                        customErrorMessage = 'You do not have permission to access this resource. You may need to change roles. Contact your admin to do this.';
                        break;
                    case 404:
                        customErrorMessage = 'This page was not found. It may not even exist. Contact your admin if you think it should!';
                        break;
                    case 409:
                        customErrorMessage = `There was a conflict found: ${data || 'Conflict occurred.'}`;
                        break;
                    case 500:
                        customErrorMessage = 'Internal server error. Please try again later or contact your admin!';
                        break;
                    default:
                        if (data) {
                            console.log("Setting error message to data + " + data + " _ " + status);
                            customErrorMessage = data;
                        }
                }

                console.log("Throwing custom error: " + customErrorMessage + " ( " + status + " )");
                throw new CustomError(customErrorMessage, status); // Throw the custom error with status
            }

            console.log("Throwing Network Error:", error);
            return Promise.reject(error);
        }
    );
};

// Export the Axios instance
export default axiosInstance;
