const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    const token = req.cookies.token; // Get the token from the cookies
    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded; // Attach admin info to request object
        next(); // Call next middleware or route handler
    } catch (err) {
        res.status(400).json({ message: 'Invalid token', error: err });
    }
};

module.exports = adminAuth;
