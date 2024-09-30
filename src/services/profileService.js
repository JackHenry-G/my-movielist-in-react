
// Utility function to fetch profile data
import axiosInstance from "../components/AxiosInstance";

export const fetchProfileData = async () => {
    try {
        // Set the Authorization header with the Bearer token
        const response = await axiosInstance.get('/auth/profile');

        if (response.status === 200) {
            // Return the necessary data from the profile
            return {
                userId: response.data.user_id,
                favouriteReleaseYear: response.data.favouriteReleaseYear,
                username: response.data.username
            };
        }
    } catch (error) {
        if (error.response) {
            throw new Error('Fetching profile data failed: ' + error.response.data);
        } else {
            throw new Error('Fetching profile data failed: Please try again later.');
        }
    }
};
