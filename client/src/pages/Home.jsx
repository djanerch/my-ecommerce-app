import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ fetchCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5001/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const handleBuy = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to purchase items!");
      navigate('/login');
      return;
    }

    try {
      // Decode user ID from token
      const user = JSON.parse(atob(token.split('.')[1]));
      
      const response = await fetch('http://localhost:5001/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product.id }),
      });

      if (response.ok) {
        alert(`${product.name} added to cart!`);
        // Trigger a re-fetch of the cart so the Navbar count updates immediately
        fetchCart(user.id);
      } else {
        alert("Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (loading) return <div className="main-content"><h1>Loading Essentials...</h1></div>;

  return (
    <div className="main-content">
      <div className="purple-banner-container">
        <h1>Tech Essentials 2026</h1>
      </div>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="card">
              <img src={product.image} alt={product.name} className="product-img" />
              <h3>{product.name}</h3>
              <p>From ${product.price}</p>
              <button onClick={() => handleBuy(product)} className="add-btn">
                Buy
              </button>
            </div>
          ))
        ) : (
          <p>No products available at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default Home;