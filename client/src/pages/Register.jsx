import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '' 
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Points to your backend port 5001
      const response = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Registration successful! Please login.");
        navigate('/login'); // Redirects to login after success
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Could not connect to the server. Is your backend running?");
    }
  };

  return (
    <div className="auth-container">
      <div className="purple-banner-container" style={{ padding: '30px', marginBottom: '2rem' }}>
        <h2>Join ProStore</h2>
        <p>Create your account to start shopping</p>
      </div>

      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          required 
          onChange={(e) => setFormData({...formData, username: e.target.value})} 
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          required 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          required 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <button type="submit">Register Now</button>
      </form>
      
      <p style={{ marginTop: '1rem', color: 'var(--text-dim)' }}>
        Already have an account? <span 
          style={{ color: 'var(--accent-purple)', cursor: 'pointer' }} 
          onClick={() => navigate('/login')}
        >Login here</span>
      </p>
    </div>
  );
}

export default Register;