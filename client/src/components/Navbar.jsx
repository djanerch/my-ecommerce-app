import { Link } from 'react-router-dom';

// Added 'user' as a prop to check roles
function Navbar({ cartCount, isLoggedIn, user, handleLogout }) {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">ProStore</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart ({cartCount})</Link>
        
        {/* Conditional rendering for Admin Panel */}
        {isLoggedIn && user?.role === 'admin' && (
          <Link to="/admin" className="admin-link">Admin Panel</Link>
        )}
        
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