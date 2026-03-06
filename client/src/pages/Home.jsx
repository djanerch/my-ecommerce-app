import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // CORRECTED: Changed port to 5001 to match your backend
    fetch('http://localhost:5001/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const handleBuy = (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to purchase items!");
      navigate('/login');
    } else {
      addToCart(product);
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