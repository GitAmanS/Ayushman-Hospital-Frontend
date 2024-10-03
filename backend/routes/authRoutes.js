const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateUser = require('../middleware/authenticateUser');

// User routes
router.post('/request-otp', authController.requestOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/request-update-phone-otp', authController.requestUpdatePhoneOtp);
router.post('/verify-update-phone-otp', authController.verifyUpdatePhoneOtp);
router.post('/submit-email', authenticateUser, authController.submitEmail);
router.get('/test-user', authenticateUser, authController.testUserRouter);

module.exports = router;
