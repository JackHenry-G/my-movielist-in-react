import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    const [logoutMessage, setLogoutMessage] = useState('');
    const [showTest, setShowTest] = useState(false); // Assuming you want to control this with some logic

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        // Clear previous messages
        setError('');
        setLoginSuccess('');
        setLogoutMessage('');

        try {
            const response = await axios.post('http://localhost:8080/api/v1/auth/signin', {
                username,
                password,
            });

            // Store the token in local storage (or session storage, based on your use case)
            const { token, returnedUsername, returnedEmail } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('username', returnedUsername);
            localStorage.setItem('email', returnedEmail);

            // Clear the input fields
            setError(null);
            setUsername('');
            setPassword('');

            navigate("/home");
        } catch (error) {
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
            const response = await axios.get("http://localhost:8080/api/v1/auth/signuptest");


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
                setLoginSuccess(error.response.data);
                setError('Error:' + error.response.status + error.response.data);
            }
        }

    };

    return (
        <div className="user-form">
            {/* Display error message if 'error' state is not empty */}
            {error && <p style={{color: 'red'}}>{error}</p>}

            {/* Display success message if 'loginSuccess' state is not empty */}
            {loginSuccess && <p style={{color: 'green'}}>{loginSuccess}</p>}

            {/* Display logout message if 'logoutMessage' state is not empty */}
            {logoutMessage && <p style={{color: 'green'}}>{logoutMessage}</p>}

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

            <button onClick={handleRegisterTestUser} style={{color: 'green'}}>Register TEST user</button>

        </div>
    );
};

export default LoginPage;
