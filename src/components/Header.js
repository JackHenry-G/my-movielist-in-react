import {NavLink} from "react-router-dom";
import logo from "../images/moviilist.png";
import {useAuth} from '../context/AuthContext';
import {useMessageContext} from "../context/MessageContext";
import {isTestMode} from "../utils/config";

export default function Header() {
    const { isAuthenticated } = useAuth();
    const { message, isSuccess } = useMessageContext();

    const messageClass = isSuccess ? 'success-message' : message ? 'error-message' : 'no-error-message';

    return (
        <div className="top-section-bar">
            <div className="top-section-header">
                <div className="logo-container">
                    <img src={logo} id="logo" alt="Logo of the movielist application"/>
                </div>
                <NavigationBar isAuthenticated={isAuthenticated}/>
            </div>
            <div className="top-section-footer">
                <p className={messageClass}>
                    {isTestMode && "( !!! TEST MODE !!! ) "} {message ? message : "Welcome to MovieList."}
                </p>
            </div>
        </div>
    );
}


function NavigationBar() {
    const {isAuthenticated} = useAuth();

    return (
        <div className="nav-bar">
            {isAuthenticated ? (
                <>
                <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/Home">Home</NavLink>
                    <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/Movies">Movies</NavLink>
                    <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/Search">Search</NavLink>
                    <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/Profile">Profile</NavLink>
                    <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/Logout">Logout</NavLink>
                </>
            ) : (
                <>
                    <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/Home">Home</NavLink>
                    <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/signup">Register</NavLink>
                    <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/login">Login</NavLink>
                </>
            )}
        </div>
    );
}
