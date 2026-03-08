import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
  const [user, setUser] = useState(null);

  // 1. Restore Session on Refresh
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.id }); // Restore user object
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  // 2. Fetch Cart automatically when user is set
  useEffect(() => {
    if (user && user.id) {
      fetchCart(user.id);
    }
  }, [user]);

  const fetchCart = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/cart/${userId}`);
      const data = await res.json();
      setCart(data);
    } catch (err) { console.error("Error fetching cart:", err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setCart([]);
    alert("Logged out successfully.");
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar cartCount={cart.length} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home fetchCart={fetchCart} />} />
            <Route path="/product/:id" element={<ProductDetails fetchCart={fetchCart} />} />
            <Route path="/cart" element={<Cart cartItems={cart} fetchCart={fetchCart} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;