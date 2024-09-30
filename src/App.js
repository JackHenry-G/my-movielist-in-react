import {BrowserRouter, Routes, Route, useNavigate, useLocation} from "react-router-dom";
import Header from "./components/Header";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Movies from "./pages/Movies";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./components/AuthContext";
import {setupAxiosInterceptors} from "./components/AxiosInstance";
import {useEffect} from "react";
import Search from "./pages/Search";
import Logout from "./pages/Logout";

const AppRoutes = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Set up Axios interceptors
    useEffect(() => {
        setupAxiosInterceptors(navigate, location);
    }, [navigate, location]);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
                path="/movies"
                element={
                    <PrivateRoute>
                        <Movies />
                    </PrivateRoute>
                }
            />
            <Route
                path="/search"
                element={
                    <PrivateRoute>
                        <Search />
                    </PrivateRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                }
            />
            <Route
                path="/logout"
                element={
                    <PrivateRoute>
                        <Logout />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="app">
                    <div className="top-section">
                        <Header />
                    </div>

                    <div className="bottom-section">
                        <AppRoutes /> {/* Use the AppRoutes component for routing */}
                    </div>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}
