import {BrowserRouter, Routes, Route, useNavigate, useLocation} from "react-router-dom";
import Header from "./components/Header";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Movies from "./pages/Movies";
import PrivateRoute from "./components/PrivateRoute";
import {AuthProvider, useAuth} from "./context/AuthContext";
import {setupAxiosInterceptors} from "./utils/AxiosInstance";
import {useEffect} from "react";
import Search from "./pages/Search";
import Logout from "./pages/Logout";
import {MessageProvider, useMessageContext} from "./context/MessageContext";
import NoPageFound from "./pages/NoPageFound";

const AppRoutes = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { updateMessage } = useMessageContext();
    const { addAuthTokenToRequestHeaders } = useAuth();

    // Set up Axios interceptors
    useEffect(() => {
        setupAxiosInterceptors(addAuthTokenToRequestHeaders, navigate, updateMessage);

        if (location.pathname !== '/login') {
            updateMessage(); // set message to null on page  load, to reset an errors
        }

    }, [navigate, location]); // not included update message because I don't want this to be called everytime the message updates. This would cause the message to be overwritten and never displayed

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

            {/* Catch any undefined paths */}
            <Route path="*" element={<NoPageFound />} />
        </Routes>
    );
};

export default function App() {

    return (
        <AuthProvider>
            <MessageProvider>
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
            </MessageProvider>
        </AuthProvider>
    );
}
