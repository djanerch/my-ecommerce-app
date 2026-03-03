import { Link } from 'react-router-dom';

function Navbar({ cartCount }) {
  return (
    <nav>
      <Link to="/" className="logo-text"><h1>ProStore</h1></Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/cart" className="cart-link">
          Cart <span>({cartCount})</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;