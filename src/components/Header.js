import { Link } from "react-router-dom";
import logo from "../images/moviilist.png";

export default function Header() {
  return (
    <div className="top-section-bar">
      <img src={logo} id="logo" />
      <NavigationBar />
    </div>
  );
}

function NavigationBar() {
  return (
    <div className="nav-bar">
      <div className="nav-bar-normal">
        <Link to="/Home">Home</Link>
        <Link to="/Movies">Movies</Link>
        <Link to="/Search">Search</Link>
      </div>
      <div className="nav-bar-admin">
        <Link to="/Profile">Profile</Link>
        <Link to="/Logout">Logout</Link>
      </div>
    </div>
  );
}
