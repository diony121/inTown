import { NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/inTownLogo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header id="navbar">
      <div className="brand">
      <img
        className="navbarImage"
        src={logo}
        // src = "../assets/events.jpg"
      />
      <span className="brandName"><h1>Town</h1><h5>Events</h5></span>
      </div>
      
      <nav id="navlinks">
        <NavLink className="links" to="/">
          Home
        </NavLink>
        {user ? (
          <>
            <NavLink className="links" to="/my-events">
              My Events
            </NavLink>
            <NavLink className="links" to="/orders">
              My Tickets
            </NavLink>
            <NavLink className="links" to="/account">
              Profile
            </NavLink>
            <a id="logout" href="#" onClick={() => logout()}>
              Log out
            </a>
          </>
        ) : (
          <>
            <NavLink className="links" to="/register">
              Register
            </NavLink>
            <NavLink className="links" to="/login">
              Login
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
