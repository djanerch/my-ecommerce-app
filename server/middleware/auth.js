const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ error: "Access denied" });
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (decoded.role !== 'admin') return res.status(403).json({ error: "Admin only" });
        req.user = decoded;
        next();
    } catch (err) { res.status(401).json({ error: "Invalid token" }); }
};
module.exports = { verifyAdmin };