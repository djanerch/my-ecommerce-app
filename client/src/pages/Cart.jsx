import React, { useState } from 'react';

function Cart() {
  // Mock data: In the future, this comes from your Node.js API
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Pro Gaming Mouse", price: 59.99, quantity: 1, image: "https://via.placeholder.com/100" },
    { id: 2, name: "Mechanical Keyboard", price: 129.99, quantity: 1, image: "https://via.placeholder.com/100" }
  ]);

  // Calculate Total
  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. <a href="/">Go shopping!</a></p>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="card cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>${item.price}</p>
                  <button onClick={() => removeItem(item.id)} className="delete-btn">Remove</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary card">
            <h3>Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;