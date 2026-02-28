// server/index.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Using promise-based client
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Parse JSON bodies (as sent by API clients)

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

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Example API Route: Get All Products (Placeholder)
app.get('/api/products', async (req, res) => {
    try {
        // const [rows] = await db.query('SELECT * FROM products');
        // res.json(rows);
        res.json([
            { id: 1, name: "Sample Product", price: 100 },
            { id: 2, name: "Another Product", price: 200 }
        ]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});