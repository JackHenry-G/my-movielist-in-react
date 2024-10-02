import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from "../context/AuthContext";
import axiosInstance from "../utils/AxiosInstance";
import profilePicsImage from "../images/profile_pics_wide.png";
import {useMessageContext} from "../context/MessageContext";
import CustomError from "../error/CustomError";
import {isTestMode} from "../utils/config";

const LoginPage = () => {
    const { login } = useAuth();
    const { updateMessage } = useMessageContext();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home";

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axiosInstance.post('/auth/signin', {
                username,
                password,
            });

            if (response.status === 200) {
                // use the login function from context to store auth token in local storage
                const {token, username, email} = response.data;
                login(token, username, email);

                // on successful login, navigate to the original protected page or to the home page
                navigate(from, {replace: true});
            } else {
                console.error('The server did not return a 200 message: ', response.data);
                updateMessage('Login failed: Please try again later.', false);
            }
        } catch (error) {
            console.error("Caught error:", error);
            // Check if the error is an instance of CustomError
            if (error instanceof CustomError) {
                console.error('Setting custom error: ', error.message);
                updateMessage(error.message, false);
            } else {
                // Handle network errors or unknown issues
                updateMessage('Unexpected error: ' + error, false);
            }
        }
    };

    const handleRegisterTestUser = async () => {
        if (!isTestMode) {
            console.warn('Test user registration is not available in production.');
            return;
        }

        try {
            const response = await axiosInstance.get("/auth/signuptest");

            if (response.status === 200) {
                setUsername("test"); // FOR TEST PURPOSES ONLY
                setPassword("pwd");  // FOR TEST PURPOSES ONLY
                updateMessage('Test user signed up successfully!', true);
            } else {
                updateMessage('Test user sign up failed!', false);
                console.error('Failed to register test user:', JSON.stringify(response));
            }
        } catch (error) {
            console.error("Caught error:", error);
            if (error instanceof CustomError) {
                updateMessage(error.message, false);
            } else {
                updateMessage('Unexpected error: ' + error, false);
            }
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

                <form onSubmit={handleLogin}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter username..."
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password..."
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">Sign in</button>
                </form>

                <p>Don't have an account? <a href="/signup">Register here</a></p>

                {isTestMode &&
                    <button onClick={handleRegisterTestUser} style={{background: 'green', margin: '20px'}}>Register TEST
                        user
                    </button>
                }

            </div>


        </div>


    )
        ;
};

export default LoginPage;
