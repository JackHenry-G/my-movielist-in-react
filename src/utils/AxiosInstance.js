// src/utils/axiosInstance.js
import axios from 'axios';
import CustomError from "../error/CustomError";

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_MOVIELIST_BACKEND_BASE_URL,
});

/**
 * Intercepts any axios request and response using this axios instance, to add extra processing.
 *
 * @param addAuthTokenToRequestHeaders
 * @param navigate
 * @param updateMessage
 */
export const setupAxiosInterceptors = (addAuthTokenToRequestHeaders, navigate, updateMessage) => {

    axiosInstance.interceptors.request.use(
        (config) => {
            // add the jwt authorization token before any request
            addAuthTokenToRequestHeaders(config);

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
