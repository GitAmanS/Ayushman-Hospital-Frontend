const jwt = require('jsonwebtoken');

// Function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id },  // Payload containing user ID
        process.env.JWT_SECRET, // Secret key for signing
        { expiresIn: '7d' }    // Token expiration time
    );
};

module.exports = { generateToken };
