const mongoose = require('mongoose');

// Define the Order schema
const orderSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    date: { type: Date, default: Date.now },
    total: { type: Number, required: true },
});

// Define the TestResult schema
const testResultSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    test: { type: String, required: true },
    date: { type: Date, default: Date.now },
    result: { type: String, required: true },
    pdfLink: { type: String, required: true }, // Link to the PDF report
});

// Define the User schema
const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    email: { type: String, index: true }, // No unique constraint
    verified: { type: Boolean, default: false },
    address: String,
    cart: { type: Array, default: [] }, // Items in the cart
    orders: { type: [orderSchema], default: [] }, // Array of orders
    testResults: { type: [testResultSchema], default: [] }, // Array of test results
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

// Method to add an item to the cart
userSchema.methods.addToCart = function (item) {
    this.cart.push(item);
    return this.save(); // Save changes to the database
};

// Method to remove an item from the cart
userSchema.methods.removeFromCart = function (itemId) {
    this.cart = this.cart.filter(item => item.productId !== itemId);
    return this.save();
};

// Method to place an order
userSchema.methods.placeOrder = function (order) {
    this.orders.push(order);
    // Clear the cart after placing an order
    this.cart = [];
    return this.save();
};

// Method to add a test result
userSchema.methods.addTestResult = function (testResult) {
    this.testResults.push(testResult);
    return this.save();
};

module.exports = mongoose.model('User', userSchema);
