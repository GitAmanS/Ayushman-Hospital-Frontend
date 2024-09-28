// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    email: { type: String, index: true }, // No unique constraint
    verified: { type: Boolean, default: false },
    address: String,
    cart: { type: Array, default: [] },
    joinedAt: { type: Date, default: Date.now },
});

// Optional: Add validation to ensure email is valid if provided
userSchema.path('email').validate(function (email) {
    if (email && email.trim().length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    return true; // If email is not provided, it's valid
}, 'Invalid email address');

module.exports = mongoose.model('User', userSchema);
