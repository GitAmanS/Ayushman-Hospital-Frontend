const User = require('../models/User');

// Middleware to check if the user is authenticated
const authenticateUser = async (req, res, next) => {
    const userPhone = req.cookies.user; // Get the user phone from cookies
    console.log("cookies", req.cookies.user)

    if (!userPhone) {
        return res.status(401).json({ message: 'Unauthorized access. No user found.' });
    }

    try {
        // Find the user in the database
        const user = await User.findOne({ phone: userPhone });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized access. User not found.' });
        }

        // Attach user data to the request object
        req.user = user; // Attach user info to request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = authenticateUser;
