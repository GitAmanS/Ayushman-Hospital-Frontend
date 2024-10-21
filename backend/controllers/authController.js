const {User} = require('../models/User');
const crypto = require('crypto');
const twilioService = require('../services/twilioService');

const otpStore = {};
const secret = process.env.COOKIE_SECRET || 'your_secret_key'; // Use a secure secret key

// Generate a random initialization vector
const iv = crypto.randomBytes(16);

// Encrypt cookie value
const encrypt = (text) => {
    const key = crypto.scryptSync(secret, 'salt', 32); // Derive a key using scrypt
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted; // Return IV along with encrypted text
};

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

// Request OTP for updating phone number
exports.requestOtp = async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in memory
    otpStore[phone] = otp;

    // For testing, return success message without sending OTP
    res.status(200).json({
        message: 'OTP sent successfully.',
        otp: otp, // send OTP in a structured format
    });
};

// Verify OTP for updating phone number
exports.verifyOtp = async (req, res) => {
    const { phone, otp } = req.body;

    // Check for OTP in memory
    const storedOtp = otpStore[phone];

    if (!storedOtp) {
        return res.status(400).send('OTP has expired or not requested.');
    }

    if (storedOtp === otp) {
        // OTP verified successfully, remove it from the store
        delete otpStore[phone];

        // Check if user exists
        let user = await User.findOne({ phone });

        if (!user) {
            // User does not exist, sign up
            user = new User({
                phone,
                joinedAt: new Date(),
                verified: true,
                cart: [], // Ensure cart is initialized
                email: ''
            });
            await user.save();
                    // Set an encrypted cookie
            res.cookie('user', encrypt(phone), {
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            });
            return res.status(201).send({
                message: 'User signed up successfully.',
                isNewUser: true,
                user: {
                    phone: user.phone,
                    email: user.email,
                    joinedAt: user.joinedAt,
                    cart: user.cart || [], // Include cart
                }
            });
        }

        // User exists, log in
        user.verified = true;
        await user.save();

        // Set an encrypted cookie
        res.cookie('user', encrypt(phone), {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });

        return res.status(200).send({
            message: 'User logged in successfully.',
            user: {
                phone: user.phone,
                email: user.email,
                joinedAt: user.joinedAt,
                cart: user.cart || [], // Ensure cart is included
            },
            isNewUser: false,
        });
    } else {
        return res.status(400).send('Invalid OTP.');
    }
};

// Request OTP for updating the phone number
exports.requestUpdatePhoneOtp = async (req, res) => {
    let { newPhone } = req.body; // Get the new phone number from the request

    // Validate phone number
    if (newPhone.length === 10) {
        // If the phone number is 10 digits, prepend '91'
        newPhone = '91' + newPhone;
    } else if (newPhone.length === 12) {
        // If the phone number is 12 digits, check if it starts with '91'
        if (!newPhone.startsWith('91')) {
            return res.status(400).send('Invalid phone number. Must start with 91.');
        }
    } else {
        // If phone number is neither 10 nor 12 digits, it's invalid
        return res.status(400).send('Invalid phone number. Must be 10 or 12 digits.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP

    // Store OTP in memory (this should be stored securely in a database for production use)
    otpStore[newPhone] = otp;

    // For testing, return success message without sending OTP via SMS
    res.status(200).json({
        message: 'OTP for updating phone number sent successfully.',
        otp: otp, // Send OTP in response for testing
    });
};

exports.verifyUpdatePhoneOtp = async (req, res) => {
    let { newPhone, otp } = req.body;

    // Validate phone number
    if (newPhone.length === 10) {
        newPhone = '91' + newPhone;
    } else if (newPhone.length === 12) {
        if (!newPhone.startsWith('91')) {
            return res.status(400).send('Invalid phone number. Must start with 91.');
        }
    } else {
        return res.status(400).send('Invalid phone number. Must be 10 or 12 digits.');
    }

    // Check for OTP in memory
    console.log("OTP Store:", otpStore); // Debugging log
    const storedOtp = otpStore[newPhone];

    if (!storedOtp) {
        return res.status(400).send('OTP has expired or not requested.');
    }

    console.log("Stored OTP:", storedOtp, "User OTP:", otp); // Debugging log

    if (storedOtp === otp) {
        try {
            // Debug the user
            console.log("Authenticated user:", req.user); // Debugging log

            if (!req.user) {
                return res.status(401).send('Unauthorized user.');
            }

            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.phone = newPhone; // Save the new phone number
            await user.save();

            // Clear OTP after successful verification
            delete otpStore[newPhone];

            return res.status(200).json({ message: 'Phone number updated successfully.', success: true });
        } catch (error) {
            console.error('Error while updating phone number:', error); // Debugging log
            return res.status(500).json({ message: 'Failed to update phone number', error });
        }
    } else {
        return res.status(400).send('Invalid OTP.');
    }
};

// Submit Email
exports.submitEmail = async (req, res) => {
    const { email } = req.body;

    // Access the authenticated user from the request object (set by middleware)
    const user = req.user;

    if (!user) {
        return res.status(404).send('User not found.');
    }

    // Validate email before submission
    if (!email || email.trim().length === 0) {
        return res.status(400).send('Email cannot be empty.');
    }

    try {
        // Check if email already exists in the database
        const existingUser = await User.findOne({ email: email });

        // If the existing user is found and it's not the current user, return an error
        // if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        //     return res.status(400).send('Email already exists.');
        // }

        // Update the user's email
        user.email = email;

        await user.save();

        console.log("saved user:", user)

        return res.status(200).send({
            message: 'Email submitted successfully.',
            user: {
                phone: user.phone,
                email: user.email,
                joinedAt: user.joinedAt,
                cart: user.cart || [], // Ensure cart is included
            },
            isNewUser: !existingUser, // If existingUser is null, this is a new user
        });
    } catch (error) {
        console.log("error email:", error)
        return res.status(500).send('Error updating user email.');

    }
};

// Test User Router
exports.testUserRouter = async (req, res) => {
    try {
        console.log(req.user);
        res.status(200).json({
            message: 'This is user',
            user: req.user, // send user info
        });
    } catch (error) {
        return res.status(500).send(error);
    }
};
