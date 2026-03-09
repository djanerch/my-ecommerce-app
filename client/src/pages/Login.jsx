import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Added setUser as a prop to update App.jsx state
function Login({ setIsLoggedIn, setUser }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Save token and set user data (including the role!)
        localStorage.setItem('token', data.token);
        
        setIsLoggedIn(true);
        setUser(data.user); // Now App.jsx knows the user's ID and role
        
        alert(`Welcome back, ${data.user.username}!`);
        navigate('/');
      } else {
        alert("Invalid username or password.");
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          required
          onChange={(e) => setFormData({...formData, username: e.target.value})} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          required
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;