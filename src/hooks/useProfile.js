import axiosInstance from "../utils/AxiosInstance";
import { useEffect, useState } from "react";
import { useMessageContext } from "../context/MessageContext";

const useProfile = () => {
    const [ profile, setProfile ] = useState(
        {
            userId: '',
            username: '',
            favouriteReleaseYear: '',
            favouriteGenre: { id: '', name: '' },
        }
    );

    const { updateMessage } = useMessageContext();

    useEffect(() => {
        const getProfileData = async () => {
            try {
                const response = await axiosInstance.get('/auth/profile');

                if (response.status === 200 || response.status === 204) {
                    setProfile(response.data);
                }
            } catch (error) {
                console.error("Error fetching movies:", error);
                updateMessage("An error occurred while fetching the movie list: " + error.message, false);
            }
        }

        getProfileData();
    }, [updateMessage]);

    return profile;
};

export default useProfile;