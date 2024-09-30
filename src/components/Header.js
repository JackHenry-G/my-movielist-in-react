import {NavLink} from "react-router-dom";
import logo from "../images/moviilist.png";
import {useAuth} from './AuthContext'; // Import the useAuth hook

export default function Header() {
    const {isAuthenticated} = useAuth();

    return (
        <div className="top-section-bar">
            <div className="logo-container">
                <img src={logo} id="logo" alt="Logo of the movielist application"/>
            </div>
            <NavigationBar isAuthenticated={isAuthenticated}/>
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
