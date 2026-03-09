import React, { useState } from 'react';

function AdminDashboard() {
  const [product, setProduct] = useState({ name: '', description: '', price: '', stock: '', image_url: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve stored token

    try {
      const response = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Mandatory for middleware verification
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        alert("Product added successfully!");
        setProduct({ name: '', description: '', price: '', stock: '', image_url: '' });
      } else {
        alert("Failed to add product. Ensure you have admin privileges.");
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="main-content">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <input type="text" placeholder="Name" onChange={(e) => setProduct({...product, name: e.target.value})} />
        <input type="text" placeholder="Description" onChange={(e) => setProduct({...product, description: e.target.value})} />
        <input type="number" placeholder="Price" onChange={(e) => setProduct({...product, price: e.target.value})} />
        <input type="number" placeholder="Stock" onChange={(e) => setProduct({...product, stock: e.target.value})} />
        <input type="text" placeholder="Image URL" onChange={(e) => setProduct({...product, image_url: e.target.value})} />
        <button type="submit">Submit Product</button>
      </form>
    </div>
  );
}

export default AdminDashboard;