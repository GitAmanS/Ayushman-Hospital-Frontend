const express = require('express');
const authenticateUser = require('../middleware/authenticateUser'); // Middleware for user authentication
const { Category, Product } = require('../models/Product'); // Assuming you have a Product model
const {User} = require('../models/User'); // User model
const Razorpay = require('razorpay');
const { createRazorpayOrder } = require('../utils/razorpay');  
const crypto = require('crypto');

const router = express.Router();


router.post('/start-payment',authenticateUser,  async (req, res) => {
    try {
        const user = await req.user  // Assuming req.user contains logged-in user
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const totalAmount = user.cartTotal;  // Use the cart total for payment

        // Create a Razorpay order
        const razorpayOrder = await createRazorpayOrder(totalAmount);

        res.status(200).json({
            razorpayOrderId: razorpayOrder.id,
            amount: totalAmount,
            currency: 'INR',
            razorpaykeyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to verify payment and place the order
router.post('/verify-payment',authenticateUser,  async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, addressId } = req.body;

    // Generate a signature to verify payment authenticity
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)  // Use your Razorpay Secret
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpaySignature) {
        try {
            const user = await req.user;
            
            await user.placeOrder(addressId);
            res.status(200).json({ success: true, message: 'Order placed successfully.', order: user.order });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    } else {
        res.status(400).json({ success: false, message: 'Invalid payment signature.' });
    }
});


router.get('/orders', authenticateUser,  async(req, res)=>{
    try{
        const orders = await req.user.orders;
        res.status(200).json({ orders: orders });

    }catch(err){
        res.status(500).json({ message: 'Error fetching orders', error: err });
    }
})

router.delete('/clearorders', authenticateUser, async(req, res)=>{
    try{
        req.user.orders = [];
        await req.user.save();
        res.status(200).json({message:'orders cleared successfully', orders: req.user.orders});

    }catch(err){
        res.status(500).json({message:' error clearing orders', error:err})
    }
})




// Route to fetch all categories with their associated products
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find().lean(); // Fetch all categories

        // Fetch products grouped by category
        const productsByCategory = await Promise.all(
            categories.map(async (category) => {
                const products = await Product.find({ category: category._id }); // Fetch products by category
                return {_id: category._id, category: category.name, catimage:category.image, desc: category.description, products };
            })
        );

        res.status(200).json({ categories: productsByCategory });
    } catch (err) {
        console.error('Error fetching categories and products:', err);
        res.status(500).json({ message: 'Error fetching categories and products', error: err });
    }
});

// Route to fetch a single product by ID
router.get('/products/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id).populate('category'); // Populate category info

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ message: 'Error fetching product', error: err });
    }
});

router.post('/cart/add', authenticateUser, async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
        return res.status(400).json({ message: 'Product ID and quantity are required.' });
    }

    try {
        const user = await req.user
        const item = { productId, quantity };
        
        // Call addToCart method
        await user.addToCart(item);
        console.log(user.cart)
        res.status(200).json({ message: 'Item added to cart.', cart: user.cart,cartTotal: user.cartTotal });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Remove item from cart
router.post('/cart/remove', authenticateUser, async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required.' });
    }

    try {
        const user = req.user;

        // Ensure the product exists in the cart before trying to remove it
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await user.removeFromCart(productId, quantity);

        res.status(200).json({ message: 'Item removed from cart.', cart: user.cart, cartTotal: user.cartTotal });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get cart items
router.get('/cart', authenticateUser, async (req, res) => {
    try {
        // Fetch the user's updated data from the database
        const user = req.user;
        
        if (!user || !user.cart) {
            return res.status(400).json({ message: 'Cart is empty or user not found.' });
        }

        res.status(200).json({ cart: user.cart, cartTotal: user.cartTotal });
    } catch (err) {
        console.error('Error fetching cart:', err);
        res.status(500).json({ message: 'Error fetching cart', error: err });
    }
});


// Clear cart
router.post('/cart/clear', authenticateUser, async (req, res) => {
    const user = req.user;
    user.cart = [];
    user.cartTotal = 0
    await user.save();
    res.status(200).json({ message: 'Cart cleared.', cart: user.cart, cartTotal:user.cartTotal });
});


// // Route to view cart items
// router.get('/cart', authenticateUser, async (req, res) => {
//     try {
//         res.status(200).json({ cart: req.user.cart });
//     } catch (err) {
//         console.error('Error fetching cart:', err);
//         res.status(500).json({ message: 'Error fetching cart', error: err });
//     }
// });

// // Route to place an order (checkout)
// router.post('/cart/checkout', authenticateUser, async (req, res) => {
//     const { orderDetails } = req.body; // Expect order details in the request body

//     try {
//         // Calculate total price of items in the cart
//         const total = req.user.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

//         // Create a new order object
//         const order = {
//             id: req.user.orders.length + 1, // Simple order ID generation
//             name: orderDetails.name, // Assume name is provided in the order details
//             total,
//         };

//         // Place the order and clear the cart
//         await req.user.placeOrder(order);

//         res.status(200).json({ message: 'Order placed successfully', order });
//     } catch (err) {
//         console.error('Error placing order:', err);
//         res.status(500).json({ message: 'Error placing order', error: err });
//     }
// });






// Route to get all addresses for the authenticated user
router.get('/address', authenticateUser, async (req, res) => {
    try {
        const user = req.user; // Authenticated user
        
        if (!user.address || user.address.length === 0) {
            return res.status(200).json({ message: 'No addresses found' });
        }

        res.status(200).json({ addresses: user.address });
    } catch (err) {
        console.error('Error fetching addresses:', err);
        res.status(500).json({ message: 'Error fetching addresses', error: err });
    }
});

// Route to add a new address
router.post('/address/add', authenticateUser, async (req, res) => {
    const { pincode, addressDetails, patientName, phoneNumber } = req.body;



    try {

        req.user.address.push({pincode,addressDetails,patientName,phoneNumber }); // Add the new address
        await req.user.save(); // Save the updated user

        res.status(201).json({ message: 'Address added successfully', address: {pincode,addressDetails,patientName,phoneNumber } });
    } catch (err) {
        console.error('Error adding address:', err);
        res.status(500).json({ message: 'Error adding address', error: err });
    }
});

// Route to edit an existing address by ID
router.put('/address/edit/:addressId', authenticateUser, async (req, res) => {
    const { addressId } = req.params;
    const { pincode, addressDetails, patientName, phoneNumber } = req.body;

    if (!pincode || !addressDetails || !patientName || !phoneNumber) {
        return res.status(400).json({ message: 'All fields are required: pincode, house details, patient name, phone number' });
    }

    try {
        const user = req.user;
        const address = user.address.id(addressId); // Find the address by ID

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Update the address fields
        address.pincode = pincode;
        address.addressDetails = addressDetails;
        address.patientName = patientName;
        address.phoneNumber = phoneNumber;

        await user.save(); // Save the updated user document

        res.status(200).json({ message: 'Address updated successfully', address });
    } catch (err) {
        console.error('Error updating address:', err);
        res.status(500).json({ message: 'Error updating address', error: err });
    }
});

// Route to delete an address by ID
router.delete('/address/delete/:addressId', authenticateUser, async (req, res) => {
    const { addressId } = req.params;

    try {
        const user = req.user;


        // Remove the address from the user's address array
        const response = user.removeAddress(addressId);

        res.status(200).json({ message: response.message, addresses: response.address });
    } catch (err) {
        console.error('Error deleting address:', err);
        res.status(500).json({ message: 'Error deleting address', error: err });
    }
});

module.exports = router;
