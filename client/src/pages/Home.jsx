import React, { useState, useEffect } from 'react';

function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from your Node.js server
    fetch('http://localhost:5000/api/products')
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

  if (loading) return <div className="main-content"><h1>Loading Essentials...</h1></div>;

  return (
    <div className="main-content">
      <div className="purple-banner-container">
        <h1>Tech Essentials 2026</h1>
        <p>Curated gear for the modern developer.</p>
      </div>

      <h2 className="grid-title">
        All models. <span className="text-dim">Take your pick.</span>
      </h2>
      
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="card">
            <div className="img-container">
              {/* Note: using 'image' because of the SQL alias 'AS image' in index.js */}
              <img src={product.image} alt={product.name} className="product-img" />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="price">From ${product.price}</p>
              <button onClick={() => addToCart(product)} className="add-btn">
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;