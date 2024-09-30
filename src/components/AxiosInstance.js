// src/utils/axiosInstance.js
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
});

// Function to set up interceptors
export const setupAxiosInterceptors = (navigate, location) => {
    // Create an interceptor for requests
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("jwtToken");
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            } else {
                console.error("No token found. Please log in again.");
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Create an interceptor for responses
    axiosInstance.interceptors.response.use(
        response => response,
        error => {
            const { response } = error;

            console.log("AXIOS RESPONSE: " + response + " - " + response.status + " - " + response.statusText + ".");

            // Check for a 401 Unauthorized response
            if (response && response.status === 401) {
                console.log(location);
                if (location.pathname !== '/login') {
                    localStorage.clear(); // Optionally clear local storage
                    alert('You must login to access this resource!');
                    navigate('/login'); // Redirect to the login page
                }
            } else if (response && response.status === 403) {
                alert('You do not have permission to access this resource!');
            } else if (response && response.status === 404) {
                alert('Not Found!');
            } else if (response && response.status === 500) {
                alert('Internal server error. Please try again later!');
            }
            return Promise.reject(error);
        }
    );
};

// Export the Axios instance
export default axiosInstance;
