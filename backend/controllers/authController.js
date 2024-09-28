// controllers/authController.js
const User = require('../models/User');
const twilioService = require('../services/twilioService');

const otpStore = {};

// Request OTP
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

// controllers/authController.js
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
                email: '' // Set email to an empty string but ensure validation prevents duplicates
            });
            await user.save();
            return res.status(201).send({
                message: 'User signed up successfully.',
                isNewUser: true,
            });
        }

        // User exists, log in
        user.verified = true; 
        await user.save();

        // Set a cookie
        res.cookie('user', phone, {
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
            },
            isNewUser: false,
        });
    } else {
        return res.status(400).send('Invalid OTP.');
    }
};

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

    // Check if email already exists in the database
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.status(400).send('Email already exists.');
    }

    // Update the user's email
    user.email = email;

    try {
        await user.save();
        return res.status(200).send({
            message: 'Email submitted successfully.',
            user: {
                phone: user.phone,
                email: user.email,
                joinedAt: user.joinedAt,
            },
            isNewUser: false,
        });
    } catch (error) {
        return res.status(500).send('Error updating user email.');
    }
};


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
