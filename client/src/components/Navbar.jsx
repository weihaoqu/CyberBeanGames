import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <span className="brand-icon">🎮</span>
        <span className="brand-text">CBG</span>
      </Link>
      <div className="nav-links">
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          ARCADE
        </Link>
        <Link
          to="/credits"
          className={`nav-link ${location.pathname === "/credits" ? "active" : ""}`}
        >
          CREDITS
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
