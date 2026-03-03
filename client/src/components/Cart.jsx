function Cart({ cartItems }) {
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart ({cartItems.length} items)</h2>
      
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-container">
          <div className="cart-list">
            {cartItems.map((item, index) => (
              <div key={index} className="card cart-item">
                <img src={item.image} alt={item.name} width="50" />
                <div>
                  <h4>{item.name}</h4>
                  <p>${item.price}</p>
                </div>
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