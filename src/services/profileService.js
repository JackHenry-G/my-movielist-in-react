
// Utility function to fetch profile data
import axiosInstance from "../components/AxiosInstance";

export const fetchProfileData = async () => {
    // Set the Authorization header with the Bearer token
    const response = await axiosInstance.get('/auth/profile');


    console.log("Profile data fetch: " + response);
    if (response.status === 200) {
        // Return the necessary data from the profile
        return {
            userId: response.data.user_id,
            favouriteReleaseYear: response.data.favouriteReleaseYear,
            username: response.data.username
        };
    }
};
