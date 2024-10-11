import React, {useEffect, useState} from "react";
import axiosInstance from "../utils/AxiosInstance";
import useProfile from "../hooks/useProfile";
import profilePicsImage from "../images/profile_pics_wide.png";
import { useAuth } from "../context/AuthContext";
import { useMessageContext } from "../context/MessageContext";

export default function Profile() {
    const { login } = useAuth();
    const { updateMessage } = useMessageContext();
    const profile = useProfile()

    // Initialize editedUsername state
    const [editedUsername, setEditedUsername] = useState("");

    // Update the editedUsername state when the profile is loaded
    useEffect(() => {
        if (profile && profile.username) {
            setEditedUsername(profile.username); // Set the state with the fetched profile username
        }
    }, [profile]);

    const handleUpdateProfile = async (event) => {
        event.preventDefault();

        try {
            console.log("Attempting to update profile data with profile: ", editedUsername);
            const formData = new FormData();
            formData.append('username', editedUsername);

            const response = await axiosInstance.post('/auth/profile/edit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                const { token, username } = response.data;

                login(token, username);

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
                        value={editedUsername}
                        onChange={(e) => setEditedUsername(e.target.value)}
                    />

                    <label htmlFor="favouriteReleaseYear">Favourite Release Year:</label>
                    <input
                        type="text"
                        name="favouriteReleaseYear"
                        placeholder="..."
                        value={profile.favouriteReleaseYear}
                        disabled
                    />

                    <label htmlFor="favouriteGenre">Favourite Genre:</label>
                    <input
                        type="text"
                        name="favouriteGenre"
                        placeholder="..."
                        value={profile.favouriteGenre.name}
                        disabled
                    />

                    <button type="submit">Update</button>
                </form>
            </div>
        </div>
    );
}
