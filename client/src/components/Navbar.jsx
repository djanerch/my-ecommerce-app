import { Link } from 'react-router-dom';

function Navbar({ cartCount, isLoggedIn, handleLogout }) {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">ProStore</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart ({cartCount})</Link>
        
        {/* Conditional Rendering */}
        {isLoggedIn ? (
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;