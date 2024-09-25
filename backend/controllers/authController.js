const User = require('../models/User');
const twilioService = require('../services/twilioService');

const otpStore = {};

// Request OTP
exports.requestOtp = async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in memory
    otpStore[phone] = otp;

    // Uncomment the following lines to send OTP in production
    /*
    try {
        await twilioService.sendOtp(phone, otp);
        res.status(200).send('OTP sent successfully.');
    } catch (error) {
        res.status(500).send('Error sending OTP.');
    }
    */
    
    // For testing, return success message without sending OTP
    res.status(200).json({
        message: 'OTP sent successfully.',
        otp: otp, // send OTP in a structured format
      });
};


// Verify OTP function
exports.verifyOtp = async (req, res) => { 
    const { phone, otp } = req.body;

    // Check for OTP in memory
    const storedOtp = otpStore[phone];

    // Use a constant OTP for verification during testing
    const constantOtp = '123456';

    if (!storedOtp) {
        return res.status(400).send('OTP has expired or not requested.');
    }

    if (storedOtp === otp || otp === constantOtp) {
        // OTP verified successfully, remove it from the store
        delete otpStore[phone];

        // Check if user exists
        let user = await User.findOne({ phone });
        const isNewUser = !user; // Determine if the user is new

        if (!user) {
            // User does not exist, sign up
            user = new User({ 
                phone, 
                joinedAt: new Date(), 
                verified: true,
                email: null
            });
            await user.save();
            return res.status(201).send({
                message: 'User signed up successfully.',
                isNewUser: true, // Indicate new user
            });
        }

        // User exists, log in
        user.verified = true; // Ensure the user is marked as verified
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
            isNewUser: false, // Indicate existing user
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

    // Update the user's email and set isNewUser to false
    user.email = email;
    user.isNewUser = false;

    try {
        await user.save();
        return res.status(200).send({
            message: 'Email submitted successfully.',
            user: {
                phone: user.phone,
                email: user.email,
                joinedAt: user.joinedAt,
            },
            isNewUser: false, // Update isNewUser to false
        });
    } catch (error) {
        return res.status(500).send('Error updating user email.');
    }
};

exports.testUserRouter = async (req, res)=>{
    try{
        console.log(req.user);
        res.status(200).json({
            message: 'this is user',
            user: req.user, // send OTP in a structured format
        });
    }catch (error){
        return res.status(500).send(error)
    }
}