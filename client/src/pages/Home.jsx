const PRODUCTS = [
  { id: 1, name: "Premium Headphones", price: 199, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
  { id: 2, name: "Smart Watch", price: 299, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
  { id: 3, name: "Mechanical Keyboard", price: 150, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500" },
  { id: 4, name: "Wireless Mouse", price: 49, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500" }
];

function Home({ addToCart }) {
  return (
    <div className="home-container">
      {/* Hero Section for Portfolio Appeal */}
      <section className="hero">
        <h1>Tech Essentials 2026</h1>
        <p>Curated gear for the modern developer.</p>
      </section>

      <div className="product-grid">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="card">
            <div className="img-container">
               <img src={product.image} alt={product.name} className="product-img" />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="price">${product.price}</p>
              <button 
                onClick={() => addToCart(product)} 
                className="add-btn"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;