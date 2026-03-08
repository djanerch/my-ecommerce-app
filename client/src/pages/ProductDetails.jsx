import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetails({ addToCart }) { // Accept addToCart as a prop
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5001/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleBuy = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to purchase!");
      navigate('/login');
      return;
    }
    
    // Add to database
    try {
      const user = JSON.parse(atob(token.split('.')[1]));
      const response = await fetch('http://localhost:5001/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product.id }),
      });
      
      if (response.ok) {
        addToCart(product);
        alert("Added to cart!");
      }
    } catch (err) {
      console.error("Cart error:", err);
    }
  };

  if (loading) return <div className="main-content"><h1>Loading Product...</h1></div>;
  if (error) return <div className="main-content"><h2>Error: {error}</h2></div>;

  return (
    <div className="main-content product-details">
      <img src={product.image} alt={product.name} className="product-img" />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <h3>${product.price}</h3>
      <button onClick={handleBuy} className="add-btn">Add to Cart</button>
    </div>
  );
}

export default ProductDetails;