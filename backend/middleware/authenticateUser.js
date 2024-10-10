const User = require('../models/User');
const crypto = require('crypto');
const secret = process.env.COOKIE_SECRET || 'your_secret_key'; // Use a secure secret key

// Decrypt cookie value
const decrypt = (text) => {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const key = crypto.scryptSync(secret, 'salt', 32); // Derive a key using scrypt

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

const authenticateUser = async (req, res, next) => {
    try {
        const cookie = req.cookies.user;
        console.log("coookies",req.cookies)

        if (!cookie) {
            return res.status(401).send('Unauthorized');
        }

        // Decrypt the phone number from the cookie
        const phone = decrypt(cookie);

        // Retrieve user from the database
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(401).send('Unauthorized');
        }

        // Attach user to the request object for further middleware/routes
        req.user = user;
 
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).send('Server error during authentication.');
    }
};

module.exports = authenticateUser;
