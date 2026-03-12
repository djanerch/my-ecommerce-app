const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Add item to cart
router.post('/', async (req, res) => {
    const { userId, productId } = req.body;
    await db.query('INSERT INTO cart (user_id, product_id) VALUES (?, ?)', [userId, productId]);
    res.status(201).json({ message: "Item added" });
});

// Get user cart
router.get('/:userId', async (req, res) => {
    const [items] = await db.query(`
        SELECT c.id AS cartId, p.id, p.name, p.price, p.image_url 
        FROM products p JOIN cart c ON p.id = c.product_id WHERE c.user_id = ?`, 
        [req.params.userId]);
    res.json(items);
});

// Remove item
router.delete('/:cartId', async (req, res) => {
    await db.query('DELETE FROM cart WHERE id = ?', [req.params.cartId]);
    res.status(200).json({ message: "Item removed" });
});

module.exports = router;