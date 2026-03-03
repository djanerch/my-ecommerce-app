const PRODUCTS = [
  { id: 1, name: "Premium Headphones", price: 199, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
  { id: 2, name: "Smart Watch", price: 299, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
  { id: 3, name: "Mechanical Keyboard", price: 150, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500" },
  { id: 4, name: "Wireless Mouse", price: 49, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500" },
  { id: 5, name: "Ultra-Wide Monitor", price: 499, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500" },
  { id: 6, name: "Desktop Microphone", price: 129, image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500" },
  { id: 7, name: "Noise Cancelling Buds", price: 179, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500" },
  { id: 8, name: "4K Webcam", price: 89, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500" },
  { id: 9, name: "Smart Lamp", price: 59, image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500" }
];

function Home({ addToCart }) {
  return (
    <div className="main-content">
      {/* Premium Purple Banner Container */}
      <div className="purple-banner-container">
        <h1>Tech Essentials 2026</h1>
        <p>Curated gear for the modern developer.</p>
      </div>

      {/* Centered Subheading */}
      <h2 className="grid-title">
        All models. <span className="text-dim">Take your pick.</span>
      </h2>
      
      {/* 3-Column Responsive Grid */}
      <div className="product-grid">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="card">
            <div className="img-container">
              <img src={product.image} alt={product.name} className="product-img" />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="price">From ${product.price}</p>
              <button 
                onClick={() => addToCart(product)} 
                className="add-btn"
              >
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