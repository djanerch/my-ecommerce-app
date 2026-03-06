require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt'); // Added for password hashing
const jwt = require('jsonwebtoken'); // Added for session tokens

const app = express();
const PORT = process.env.PORT || 5001;
const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_key_2026';

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
            SELECT id, name, description, price, stock, image_url AS image 
            FROM products
        `);
        res.json(rows);
    } catch (error) {
        next(error);
    }
});

/* -------------------- AUTH ROUTES -------------------- */

// Register Route
app.post('/api/register', async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)', 
            [username, email, hashedPassword, 'customer']
        );
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        next(error);
    }
});

// Login Route
app.post('/api/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (users.length === 0) return res.status(401).json({ error: "User not found" });

        const validPassword = await bcrypt.compare(password, users[0].password_hash);
        if (!validPassword) return res.status(401).json({ error: "Invalid password" });

        const token = jwt.sign(
            { id: users[0].id, role: users[0].role }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );
        
        res.json({ 
            token, 
            user: { username: users[0].username, role: users[0].role } 
        });
    } catch (error) {
        next(error);
    }
});

/* -------------------- ERROR HANDLERS -------------------- */
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
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