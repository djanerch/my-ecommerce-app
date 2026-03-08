import React, { useEffect } from 'react';

function Cart({ cartItems, fetchCart }) {
  // Calculate total from database items
  const total = cartItems.reduce((acc, item) => acc + parseFloat(item.price), 0);

  // Load cart data when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]));
      fetchCart(user.id);
    }
  }, [fetchCart]);

  const handleRemove = async (cartId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/cart/${cartId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const token = localStorage.getItem('token');
        const user = JSON.parse(atob(token.split('.')[1]));
        fetchCart(user.id); // Refresh cart after deletion
      }
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart ({cartItems.length} items)</h2>
      
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-container">
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item.cartId} className="card cart-item">
                <img src={item.image} alt={item.name} width="50" />
                <div>
                  <h4>{item.name}</h4>
                  <p>${item.price}</p>
                </div>
                {/* Delete button triggers database removal */}
                <button 
                  onClick={() => handleRemove(item.cartId)} 
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="card summary">
            <h3>Total: ${total.toFixed(2)}</h3>
            <button className="checkout-btn">Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;