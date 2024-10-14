const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Role for hierarchical structure: 'superadmin' or 'admin'
    role: {
        type: String,
        enum: ['superadmin', 'admin'],
        default: 'admin'
    },

    // Admin status: active, suspended, or deleted
    status: {
        type: String,
        enum: ['active', 'suspended', 'deleted'],
        default: 'active'
    },


    // Creation timestamp
    createdAt: { type: Date, default: Date.now }
});

// Instance method to hash password
adminSchema.methods.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Static method to compare password
adminSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
