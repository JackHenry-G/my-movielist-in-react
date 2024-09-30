import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from "../components/AuthContext";
import axiosInstance from "../components/AxiosInstance";
import profilePicsImage from "../images/profile_pics_wide.png";

const LoginPage = () => {
    const {login} = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    const [logoutMessage, setLogoutMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home";

    const handleLogin = async (event) => {
        event.preventDefault();

        // Clear previous messages
        setError('');
        setLoginSuccess('');
        setLogoutMessage('');

        try {
            const response = await axiosInstance.post('/auth/signin', {
                username,
                password,
            });

            if (response.status === 200) {
                // use the login function from context to store auth token in local storage
                const {token, username, email} = response.data;
                console.log(response.data);
                login(token, username, email);

                // Clear the input fields
                setError(null);
                setUsername('');
                setPassword('');

                // on successful login, navigate to the original protected page or to the home page
                navigate(from, {replace: true});
            } else {
                console.error('The server did not return a 200 message:', error.response.data);
                setLoginSuccess(null);
                setError('Login failed: Please try again later.');
            }
        } catch (error) {
            console.log("RESPONSE: " + error);

            if (error.response) {
                console.error('Login error:', error.response.data);
                setLoginSuccess(null);
                setError('Login failed: ' + error.response.data);
            } else {
                console.error('Error:', error.response.data);
                setLoginSuccess(null);
                setError('Login failed: Please try again later.');
            }
        }
    };

    const handleRegisterTestUser = async () => {
        try {
            const response = await axiosInstance.get("/auth/signuptest");


            console.log("Response = " + JSON.stringify(response));
            console.log("Respones status = " + response.status);

            if (response.status === 200) {
                setError(null);
                setUsername("test"); // FOR TEST PURPOSES ONLY
                setPassword("pwd"); // FOR TEST PURPOSES ONLY
                setLoginSuccess('Test user signed up successfully!');
            } else {
                setLoginSuccess(null);
                setError('Test user sign up failed!');
                console.error('Failed to register test user:', JSON.stringify(response));
            }

        } catch (error) {
            console.log("The error is - " + error);

            if (error.response) {
                if (error.response.status === 400) {
                    console.error('Bad Request:', error.response.data);
                    // Here you can handle the specific case where the username already exists
                    alert('Test user already exists. Please choose another one.');
                } else {
                    setLoginSuccess(null);
                    setError('Unexpected error:' + error.response.status + error.response.data);
                    console.error('Unexpected error:', error.response.status, error.response.data);
                }
            } else {
                setLoginSuccess(null);
                setError('There is an issue with signing you up as a user. Please contact your admin.');
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

                <button onClick={handleRegisterTestUser} style={{background: 'green', margin: '20px'}}>Register TEST user</button>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {loginSuccess && <p style={{ color: 'green' }}>{loginSuccess}</p>}

            </div>



        </div>


    )
        ;
};

export default LoginPage;
