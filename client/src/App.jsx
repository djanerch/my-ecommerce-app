import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './components/Cart';
import Register from './pages/Register';
import Login from './pages/Login';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for token on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.name} added to cart!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    alert("Logged out successfully.");
  };

  return (
    <Router>
      <div className="app-container">
        {/* Pass auth props to Navbar */}
        <Navbar 
          cartCount={cart.length} 
          isLoggedIn={isLoggedIn} 
          handleLogout={handleLogout} 
        />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart cartItems={cart} />} />
            <Route path="/register" element={<Register />} />
            {/* Pass setIsLoggedIn to Login so it can update the state */}
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