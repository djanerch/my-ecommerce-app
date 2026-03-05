const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Database Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecommerce_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test DB Connection
db.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
    });

// --- API ROUTES ---

// 1. Get All Products
app.get('/api/products', async (req, res) => {
    try {
        // We use "AS image" to match your React frontend key 'product.image'
        const [rows] = await db.query(
            'SELECT id, name, description, price, stock, image_url AS image FROM products'
        );
        res.json(rows);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 2. Get Single Product (For your ProductDetails.jsx page)
app.get('/api/products/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, name, description, price, stock, image_url AS image FROM products WHERE id = ?',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health Check
app.get('/', (req, res) => {
    res.send('ProStore API is running...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});