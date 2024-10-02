import React, {useState} from "react";
import axiosInstance from "../utils/AxiosInstance";
import useProfile from "../hooks/useProfile";
import profilePicsImage from "../images/profile_pics_wide.png";
import { useAuth } from "../context/AuthContext";
import { useMessageContext } from "../context/MessageContext";

export default function Profile() {
    const { login } = useAuth();
    const { updateMessage } = useMessageContext();
    const profile = useProfile()
    const [editedProfile, setEditedProfile] = useState(profile); // Local state for editing profile

    const handleUpdateProfile = async (event) => {
        event.preventDefault();

        try {
            console.log("Attempting to update profile data with profile: ", profile);
            const formData = new FormData();
            formData.append('username', profile.username);

            const response = await axiosInstance.post('/auth/profile/edit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                const { token, username, email } = response.data;

                login(token, username, email);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Update local profile state with new data if needed
                setEditedProfile(prevProfile => ({
                    ...prevProfile,
                    username: username, // Assuming username returned from response
                    // Update other profile fields if necessary
                }));

                updateMessage("Profile updated successfully!", true);
            } else {
                updateMessage('Profile update failed: Please try again later.', false);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
            updateMessage(errorMessage, false);
        }
    };

    return (
        <div className="profile-page-wrapper">
            <div className="user-profile-form">
                <div
                    className="user-profile-form-banner"
                    style={{
                        backgroundImage: `url(${profilePicsImage})`
                    }}
                ></div>

                <form onSubmit={handleUpdateProfile}>
                    <label htmlFor="id">ID:</label>
                    <input
                        type="text"
                        name="ID"
                        placeholder="ID..."
                        value={profile.userId}
                        disabled
                    />

                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username..."
                        value={profile.username}
                        onChange={(e) => setEditedProfile({ ...profile, username: e.target.value })}
                        readOnly // TODO: remove readonly once update username is fixed
                    />

                    <label htmlFor="favouriteReleaseYear">Favourite Release Year:</label>
                    <input
                        type="text"
                        name="favouriteReleaseYear"
                        placeholder="..."
                        value={profile.favouriteReleaseYear}
                        disabled
                    />

                    <button type="submit" disabled={true}>Update (**Under maintenance**)</button>
                </form>
            </div>
        </div>
    );
}
