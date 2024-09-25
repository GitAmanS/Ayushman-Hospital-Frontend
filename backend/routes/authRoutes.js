const express = require('express');
const { requestOtp, verifyOtp, submitEmail, testUserRouter } = require('../controllers/authController.js');
const authMiddleware = require('../middleware/authMiddleware.js')
const router = express.Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/submitemail', authMiddleware, submitEmail)
router.post('/testCookies',authMiddleware, testUserRouter)
module.exports = router;
