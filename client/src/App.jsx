import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Corrected Paths: These assume App.jsx is in /src
import Navbar from './components/Navbar';
import Cart from './components/Cart';

import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Register from './pages/Register';
import Login from './pages/Login';

import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Checks for a saved token in the browser's storage on startup
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.name} added to cart!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clears the user session
    setIsLoggedIn(false);
    alert("Logged out successfully.");
  };

  return (
    <Router>
      <div className="app-container">
        {/* Pass state and logout handler to Navbar */}
        <Navbar 
          cartCount={cart.length} 
          isLoggedIn={isLoggedIn} 
          handleLogout={handleLogout} 
        />
        
        <main className="main-content">
          <Routes>
            {/* Route for the landing page with the product grid */}
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart cartItems={cart} />} />
            <Route path="/register" element={<Register />} />
            {/* Login needs setIsLoggedIn to update the global app state */}
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
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