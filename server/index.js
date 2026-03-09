require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5001;
const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_key_2026';

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors());
app.use(express.json());

// ADMIN AUTH MIDDLEWARE
const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(403).json({ error: "Access denied" });
    
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (decoded.role !== 'admin') return res.status(403).json({ error: "Admin access required" });
        req.user = decoded;
        next();
    } catch (err) { res.status(401).json({ error: "Invalid token" }); }
};

/* -------------------- DATABASE -------------------- */
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecommerce_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10
});

/* -------------------- CART ROUTES -------------------- */
app.post('/api/cart', async (req, res, next) => {
    const { userId, productId } = req.body;
    try {
        await db.query('INSERT INTO cart (user_id, product_id) VALUES (?, ?)', [userId, productId]);
        res.status(201).json({ message: "Item added to cart" });
    } catch (err) { next(err); }
});

app.get('/api/cart/:userId', async (req, res, next) => {
    try {
        const [items] = await db.query(`
            SELECT c.id AS cartId, p.id, p.name, p.price, p.image_url 
            FROM products p JOIN cart c ON p.id = c.product_id WHERE c.user_id = ?`, 
            [req.params.userId]);
        res.json(items);
    } catch (err) { next(err); }
});

app.delete('/api/cart/:cartId', async (req, res, next) => {
    try {
        await db.query('DELETE FROM cart WHERE id = ?', [req.params.cartId]);
        res.status(200).json({ message: "Item removed" });
    } catch (err) { next(err); }
});

/* -------------------- AUTH & PRODUCTS -------------------- */
app.get('/api/products', async (req, res, next) => {
    try {
        const [rows] = await db.query(`SELECT id, name, description, price, stock, image_url AS image FROM products`);
        res.json(rows);
    } catch (error) { next(error); }
});

app.post('/api/register', async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)', 
            [username, email, hashedPassword, 'customer']);
        res.status(201).json({ message: "Registered" });
    } catch (error) { next(error); }
});

app.post('/api/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) return res.status(401).json({ error: "User not found" });

        const validPassword = await bcrypt.compare(password, users[0].password_hash);
        if (!validPassword) return res.status(401).json({ error: "Invalid password" });

        const token = jwt.sign({ id: users[0].id, role: users[0].role }, SECRET_KEY, { expiresIn: '1h' });
        // Include the role in the response object
        res.json({ token, user: { id: users[0].id, username: users[0].username, role: users[0].role } });
    } catch (error) { next(error); }
});

/* -------------------- ADMIN ROUTES -------------------- */
// Example of a protected admin route
app.post('/api/products', verifyAdmin, async (req, res, next) => {
    const { name, description, price, stock, image_url } = req.body;
    try {
        await db.query('INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, stock, image_url]);
        res.status(201).json({ message: "Product added" });
    } catch (err) { next(err); }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));