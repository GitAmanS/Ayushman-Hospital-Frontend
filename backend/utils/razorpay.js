const Razorpay = require('razorpay');

// Configure Razorpay instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
}); 

exports.createRazorpayOrder = async (amount) => {
    const options = {
        amount: amount * 100,  // Amount is in the smallest currency unit (e.g., paise for INR)
        currency: 'INR',
        receipt: `order_rcptid_${new Date().getTime()}`,  // Unique receipt ID for your order
    };

    try {
        const order = await razorpayInstance.orders.create(options);
        return order;
    } catch (error) {
        throw new Error('Failed to create Razorpay order.');
    }
};
