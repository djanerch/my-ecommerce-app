const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)', 
        [username, email, hashedPassword, 'customer']);
    res.status(201).json({ message: "Registered" });
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) return res.status(401).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, users[0].password_hash);
    if (!validPassword) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: users[0].id, role: users[0].role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: users[0].id, username: users[0].username, role: users[0].role } });
});

module.exports = router;