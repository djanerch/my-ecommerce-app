require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = Number(process.env.PORT) || 5001;
const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_key_2026';

/* -------------------- MIDDLEWARE -------------------- */

app.use(cors());
app.use(express.json());

/* -------------------- ADMIN AUTH MIDDLEWARE -------------------- */

const verifyAdmin = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: "Access denied" });
    }

    const token = authHeader.split(' ')[1];

    try {

        const decoded = jwt.verify(token, SECRET_KEY);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: "Admin access required" });
        }

        req.user = decoded;
        next();

    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }

};

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

/* -------------------- DATABASE CONNECTION TEST -------------------- */

(async () => {

    try {

        const connection = await db.getConnection();
        console.log("✅ Database connected");
        connection.release();

    } catch (err) {

        console.error("❌ Database connection failed:", err);

    }

})();

/* -------------------- SWAGGER -------------------- */

const swaggerOptions = {

    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-commerce API',
            version: '1.0.0',
            description: 'API documentation for my E-commerce app',
        },
        servers: [{ url: `http://localhost:${PORT}` }],
    },

    apis: [__filename]

};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* -------------------- API ROOT -------------------- */

app.get('/api', (req, res) => {

    res.json({

        message: "Welcome to the E-commerce API",

        endpoints: {

            auth: {
                register: "POST /api/register",
                login: "POST /api/login"
            },

            products: {
                list: "GET /api/products",
                search: "GET /api/products?search=term",
                admin_add: "POST /api/products (Admin)",
                admin_edit: "PUT /api/products/:id (Admin)",
                admin_delete: "DELETE /api/products/:id (Admin)"
            },

            cart: {
                add: "POST /api/cart",
                get_user_cart: "GET /api/cart/:userId",
                remove: "DELETE /api/cart/:cartId"
            }

        }

    });

});

/* -------------------- PRODUCTS -------------------- */

app.get('/api/products', async (req, res, next) => {

    const { search } = req.query;

    try {

        let query = 'SELECT id, name, description, price, stock, image_url AS image FROM products';
        let params = [];

        if (search) {

            query += ' WHERE name LIKE ? OR description LIKE ?';
            params = [`%${search}%`, `%${search}%`];

        }

        const [rows] = await db.query(query, params);

        res.json(rows);

    } catch (error) {

        next(error);

    }

});

/* -------------------- AUTH -------------------- */

app.post('/api/register', async (req, res, next) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields required" });
    }

    try {

        const [existing] = await db.query(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existing.length > 0) {
            return res.status(409).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, 'customer']
        );

        res.status(201).json({ message: "Registered successfully" });

    } catch (error) {

        next(error);

    }

});

app.post('/api/login', async (req, res, next) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
    }

    try {

        const [users] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = users[0];

        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({

            token,

            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }

        });

    } catch (error) {

        next(error);

    }

});

/* -------------------- CART -------------------- */

app.post('/api/cart', async (req, res, next) => {

    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ error: "userId and productId required" });
    }

    try {

        await db.query(
            'INSERT INTO cart (user_id, product_id) VALUES (?, ?)',
            [userId, productId]
        );

        res.status(201).json({ message: "Item added to cart" });

    } catch (err) {

        next(err);

    }

});

app.get('/api/cart/:userId', async (req, res, next) => {

    try {

        const [items] = await db.query(

            `SELECT 
                c.id AS cartId,
                p.id,
                p.name,
                p.price,
                p.image_url
             FROM products p
             JOIN cart c ON p.id = c.product_id
             WHERE c.user_id = ?`,

            [req.params.userId]

        );

        res.json(items);

    } catch (err) {

        next(err);

    }

});

app.delete('/api/cart/:cartId', async (req, res, next) => {

    try {

        const [result] = await db.query(
            'DELETE FROM cart WHERE id = ?',
            [req.params.cartId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json({ message: "Item removed" });

    } catch (err) {

        next(err);

    }

});

/* -------------------- ADMIN PRODUCTS -------------------- */

app.post('/api/products', verifyAdmin, async (req, res, next) => {

    const { name, description, price, stock, image_url } = req.body;

    try {

        await db.query(

            'INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)',

            [name, description, price, stock, image_url]

        );

        res.status(201).json({ message: "Product added" });

    } catch (err) {

        next(err);

    }

});

app.put('/api/products/:id', verifyAdmin, async (req, res, next) => {

    const { id } = req.params;
    const { name, description, price, stock, image_url } = req.body;

    try {

        const [result] = await db.query(

            'UPDATE products SET name=?, description=?, price=?, stock=?, image_url=? WHERE id=?',

            [name, description, price, stock, image_url, id]

        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Product updated successfully" });

    } catch (err) {

        next(err);

    }

});

app.delete('/api/products/:id', verifyAdmin, async (req, res, next) => {

    const { id } = req.params;

    try {

        const [result] = await db.query(
            'DELETE FROM products WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });

    } catch (err) {

        next(err);

    }

});

/* -------------------- GLOBAL ERROR HANDLER -------------------- */

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        error: "Internal Server Error",
        message: err.message
    });

});

/* -------------------- SERVER -------------------- */

app.listen(PORT, () => {

    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📄 Swagger docs available at http://localhost:${PORT}/api-docs`);

});