const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyAdmin } = require('../middleware/auth');

// Get all (Public)
router.get('/', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM products');
    res.json(rows);
});

// Delete (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: "Deleted" });
});

module.exports = router;