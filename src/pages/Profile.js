import React, {useEffect, useState} from "react";
import axiosInstance from "../components/AxiosInstance";
import {fetchProfileData} from "../services/profileService";
import profilePicsImage from "../images/profile_pics_wide.png";
import {useAuth} from "../components/AuthContext";

export default function Profile() {
    const {login} = useAuth();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [favouriteReleaseYear, setFavouriteReleaseYear] = useState('');

    // TODO: Fix the updating of profile function. There is a problem with authenticating the user once the update has been made
    const handleUpdateProfile = async (event) => {
        event.preventDefault();

        // Clear previous messages
        setError('');
        setSuccess('');

        try {

            const formData = new FormData();
            console.log("Attempting to update profile data with username: ", username);
            formData.append('username', username);

            const response = await axiosInstance.post('/auth/profile/edit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 200) {
                const {token, username, email} = response.data

                login(token, username, email);
                // This will set the Authorization header for future requests
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setError(null);
                setSuccess('Profile successfully updated!');
                setUsername(response.data.username);
                alert("User updated successfully!");
            } else {
                console.error('The server did not return a 200 message:', error.response.data);
                setSuccess(null);
                setError('Login failed: Please try again later.');
            }
        } catch (error) {
            if (error.response) {
                console.error('Login error:', error.response.data);
                setSuccess(null);
                setError('Login failed: ' + error.response.data);
            } else {
                console.error('Error:', error.response.data);
                setSuccess(null);
                setError('Login failed: Please try again later.');
            }
        }
    };

    useEffect(() => {
        const getProfileData = async () => {
            try {
                const data = await fetchProfileData(); // Call the utility function
                setUserId(data.userId);
                setFavouriteReleaseYear(data.favouriteReleaseYear);
                setUsername(data.username);
                setSuccess("Profile data fetched successfully.");
            } catch (err) {
                console.error("Failed to fetch profile data:", err.message);
                setError(err.message);
                setSuccess(null);
            }
        };

        getProfileData();
    }, []); // The empty dependency array ensures this runs only once and when the component mounts. Rather than everytime a dependency (variable) changes through state

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
                        value={userId}
                        disabled
                    />

                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        readOnly // TODO: remove readonly once update username is fixed
                    />

                    <label htmlFor="favouriteReleaseYear">Favourite Release Year:</label>
                    <input
                        type="text"
                        name="favouriteReleaseYear"
                        placeholder="..."
                        value={favouriteReleaseYear}
                        disabled
                    />

                    {/* TODO: remove 'disabled' and 'under maintenance' once update username is fixed */}
                    <button type="submit" disabled>Update (**Under maintenance**)</button>
                </form>
            </div>


        </div>
    )
}