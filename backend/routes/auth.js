const express = require('express');
const router = express.Router();
const User = require('../models/user');
const twilio = require('twilio');
const { generateToken } = require('../utils/jwt');
const { verifyToken } = require('../middleware/authMiddleware');
require('dotenv').config();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send OTP for login or signup
router.post('/send-otp', async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }

    try {
        let user = await User.findOne({ phoneNumber });

        // Send OTP regardless of login or signup
        await client.verify.services(process.env.TWILIO_SERVICE_ID)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' });

        const message = user ? 'OTP sent for login' : 'OTP sent for signup';
        return res.status(200).json({ message });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
});

// Verify OTP and log in or sign up
router.post('/verify-otp', async (req, res) => {
    const { phoneNumber, otp, name, email } = req.body;

    if (!phoneNumber || !otp) {
        return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    try {
        // Verify OTP
        const verificationCheck = await client.verify.services(process.env.TWILIO_SERVICE_ID)
            .verificationChecks
            .create({ to: phoneNumber, code: otp });

        if (verificationCheck.status === 'approved') {
            let user = await User.findOne({ phoneNumber });

            // If user doesn't exist, create a new one (signup)
            if (!user) {
                if (!name || !email) {
                    return res.status(400).json({ message: 'Name and email are required for signup' });
                }
                user = new User({ name, phoneNumber, email, addresses: [] });
                await user.save();
            }

            // Generate JWT token
            const token = generateToken(user);

            // Send token as a cookie
            res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });  // 7 days expiration
            return res.status(200).json({ message: user ? 'Login successful' : 'Signup successful', user });
        } else {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'OTP verification failed', error: error.message });
    }
});

// Example of a protected route
router.get('/protected', verifyToken, (req, res) => {
    return res.status(200).json({ message: 'Access granted to protected route', userId: req.userId });
});

module.exports = router;
