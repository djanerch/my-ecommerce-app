require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5001;

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors());
app.use(express.json());

/* -------------------- ROUTES -------------------- */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.get('/', (req, res) => {
    res.json({ message: "API is running successfully!" });
});

/* -------------------- SERVER START -------------------- */
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
});