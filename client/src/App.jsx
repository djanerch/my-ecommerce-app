import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './components/Cart.jsx';
import './App.css';

function App() {
  // This state stores our shopping cart items
  const [cart, setCart] = useState([]);

  // Function to add a product to the cart
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.name} added to cart!`);
  };

  return (
    <Router>
      <div className="app-container">
        {/* Pass the cart length to Navbar to show the count */}
        <Navbar cartCount={cart.length} />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart cartItems={cart} />} />
          </Routes>
        </main>

        <footer>
          <p>© 2026 My Pro E-commerce Store</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;