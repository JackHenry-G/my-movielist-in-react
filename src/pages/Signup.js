import React, {useState} from "react";
import axiosInstance from "../components/AxiosInstance";
import profilePicsImage from "../images/profile_pics_wide.png";
import {useErrorContext} from "../context/ErrorContext";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [latitude, setLatitude] = useState(0.0);
    const [longitude, setLongitude] = useState(0.0);

    const { updateMessage } = useErrorContext();

    const [loginSuccess, setLoginSuccess] = useState('');
    const [loading, setIsLoading] = useState(false);

    const validateForm = () => {
        if (!email || !username || !password) {
            updateMessage("All fields are required!", false);
            return false;
        }
        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent form from immediately submitting

        setIsLoading(true);

        if (!validateForm()) return;

        const defaultLatitude = 51.5074;
        const defaultLongitude = -0.1278;

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                    submitForm();
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLatitude(defaultLatitude);
                    setLongitude(defaultLongitude);
                    submitForm();
                }
            );
        } else {
            setLatitude(defaultLatitude);
            setLongitude(defaultLongitude);
            submitForm();
        }
    };

    const submitForm = async () => {

        const formData = {
            email,
            username,
            password,
            latitude,
            longitude
        };


        try {
            const response = await axiosInstance.post('/auth/signup', formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                if (username === "test") {
                    setUsername("test"); // FOR TEST PURPOSES ONLY
                    setPassword("pwd"); // FOR TEST PURPOSES ONLY
                }
                updateMessage('User signed up successfully!', true);
            } else {
                updateMessage('User sign up failed!', false);
                console.error('Failed to register user:', JSON.stringify(response));
            }

        } catch (err) {
            updateMessage(err.message, false);
            console.error('Failed to register user:', JSON.stringify(err));
        } finally {
            setIsLoading(false);
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

                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter username..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <input type="hidden" name="latitude" value={latitude}/>
                    <input type="hidden" name="longitude" value={longitude}/>

                    <button type="submit">Register</button>

                    <p>Already have an account? <a href="/login">Login here</a></p>

                    { /* THIS IS FOR FUTURE IMPLEMENTATION
                     <p>
                        Location information will be requested on signup. Feel free to say no,
                        we will use London by default.
                    </p>
                    */ }
                </form>

                {loginSuccess && <p style={{color: 'green'}}>{loginSuccess}</p>}
                {loading && (
                    <div className="loading-container">
                        <p>Processing your signup...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
