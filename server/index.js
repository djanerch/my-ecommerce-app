require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 5001;

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors());
app.use(express.json());

/* -------------------- DATABASE -------------------- */
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecommerce_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/* -------------------- TEST DB CONNECTION -------------------- */
async function testConnection() {
    const connection = await db.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
}

/* -------------------- ROUTES -------------------- */

// Health check
app.get('/', (req, res) => {
    res.json({ message: '🚀 API is running' });
});

// Get all products
app.get('/api/products', async (req, res, next) => {
    try {

        const [rows] = await db.query(`
            SELECT 
                id,
                name,
                description,
                price,
                stock,
                image_url AS image
            FROM products
        `);

        console.log(`📦 Sending ${rows.length} products to frontend`);

        res.json(rows);

    } catch (error) {
        next(error);
    }
});

/* -------------------- 404 HANDLER -------------------- */

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

/* -------------------- GLOBAL ERROR HANDLER -------------------- */

app.use((err, req, res, next) => {

    console.error("🔥 Server Error:", err);

    res.status(500).json({
        error: "Internal Server Error"
    });

});

/* -------------------- START SERVER -------------------- */

async function startServer() {

    try {
        await testConnection();
    } catch (err) {
        console.error("⚠️ Starting server without database...");
    }

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

}

startServer();