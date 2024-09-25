const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    verified: { type: Boolean, default: false },
    address: String,
    cart: { type: Array, default: [] },
    joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
