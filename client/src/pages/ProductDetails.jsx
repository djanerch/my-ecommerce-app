import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null);    // Track potential errors

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

  if (loading) return <div className="main-content"><h1>Loading Product...</h1></div>;
  if (error) return <div className="main-content"><h2>Error: {error}</h2></div>;

  return (
    <div className="main-content product-details">
      <img src={product.image} alt={product.name} className="product-img" />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <h3>${product.price}</h3>
    </div>
  );
}

export default ProductDetails;