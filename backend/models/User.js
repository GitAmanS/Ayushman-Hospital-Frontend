const mongoose = require('mongoose');
const { Product } = require('./Product');


// Define the TestResult schema
const testResultSchema = new mongoose.Schema({
    test: { type: String, required: true },
    date: { type: Date, default: Date.now },
    result: { type: String, required: true },
    pdfLink: { type: String, required: true }, // Link to the PDF report
});

// Define the ProductOrder schema for products within an order
const productOrderSchema = new mongoose.Schema({
    title: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    scheduledDate: { type: Date },  // New: Scheduled date for each product
    productStatus: { type: String, enum: ['pending', 'scheduled', 'processing', 'completed'], default: 'pending' },  // New: Status for each product
    testResults: { type: [testResultSchema], default: [] } // Store test results for each product
});
// Define the address schema
const addressSchema = new mongoose.Schema({
    pincode: { type: String, required: true }, // Pincode field
    addressDetails: { type: String, required: true }, // Combined field for house number, floor, building name, locality
    patientName: { type: String, required: true }, // Patient's name
    phoneNumber: { type: String, required: true }, // Phone number
});


// Define the Order schema
const orderSchema = new mongoose.Schema({
    products: [productOrderSchema],  // Array of products in the order
    date: { type: Date, default: Date.now },
    total: { type: Number, required: true },  // Total price for the order
    address: { type: addressSchema, required: true },
});



// Define the User schema
const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    email: { type: String, index: true },
    verified: { type: Boolean, default: false },
    address: [addressSchema], // Array of Google Map links as addresses
    cart: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
          quantity: { type: Number, required: true, default: 1 },
          price: { type: Number }, // Store the price at the time of adding to cart
          image: { type: String }, // Store the product image
          title: { type: String }, // Store the product name
        },
    ],
    cartTotal: { type: Number, default: 0 },
    
    orders: { type: [orderSchema], default: [] },
    testResults: { type: [testResultSchema], default: [] },
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

userSchema.methods.addToCart = async function (item) {
    const product = await Product.findById(item.productId); // Fetch the product details from the Product model

    if (!product) {
        throw new Error('Product not found');
    }

    const existingItemIndex = this.cart.findIndex(cartItem => 
        cartItem.productId.toString() === item.productId.toString()
    );

    // Calculate the price of the product to add to total
    const itemTotalPrice = product.price * Number(item.quantity);

    if (existingItemIndex > -1) {
        // If the item exists, update the quantity
        const currentQuantity = this.cart[existingItemIndex].quantity;
        this.cart[existingItemIndex].quantity += Number(item.quantity);
        
        // Update the cart total
        this.cartTotal += itemTotalPrice; // Increment total by the new item's total price
    } else {
        // If the item does not exist, add it to the cart with product details
        this.cart.push({
            productId: item.productId,
            quantity: Number(item.quantity),
            price: product.price,      // Store the current price
            image: product.image,      // Store the product image
            title: product.title       // Store the product name
        });

        // Update the cart total
        this.cartTotal += itemTotalPrice; // Increment total with the item's total price
    }

    // Save the updated cart and total
    await this.save();

    return {
        message: 'Item added to cart.',
        cart: this.cart,
        cartTotal: this.cartTotal, // Return updated total
    };
};

  
userSchema.methods.removeFromCart = async function (itemId, quantityToRemove = 1) {
    const existingItemIndex = this.cart.findIndex(item => 
        item.productId.toString() === itemId.toString()
    );

    if (existingItemIndex > -1) {
        const currentQuantity = this.cart[existingItemIndex].quantity;
        const itemPrice = this.cart[existingItemIndex].price; // Get the item's price

        if (currentQuantity > quantityToRemove) {
            // Decrease the item's quantity
            this.cart[existingItemIndex].quantity -= quantityToRemove;
            // Update the total
            this.cartTotal -= itemPrice * quantityToRemove; // Decrease total by the price of the removed items
        } else {
            // Remove the item from the cart completely
            this.cartTotal -= itemPrice * currentQuantity; // Decrease total by the price of the removed item
            this.cart.splice(existingItemIndex, 1);
        }

        // Save the updated cart to the database
        await this.save();

        return {
            message: `Removed ${quantityToRemove} of item ${itemId} from the cart.`,
            cart: this.cart,
            cartTotal: this.cartTotal, // Return updated total
        };
    }

    return { message: 'Item not found in cart.' };
};


userSchema.methods.removeAddress = async function (addressId) {
    const addressIndex = this.address.findIndex(addr => 
        addr._id.toString() === addressId.toString()
    );

    if (addressIndex > -1) {
        // Remove the address from the array
        this.address.splice(addressIndex, 1);
        // Save the updated user document
        await this.save();

        return {
            message: 'Address removed successfully.',
            address: this.address, // Return the updated list of addresses
        };
    }

    return { message: 'Address not found.' };
};




// Method to place an order
// userSchema.methods.placeOrder = async function (addressId) {
//     console.log("this is being ex")
//     const order = {
//         products: this.cart.map(item => ({
//             productId: item.productId,
//             quantity: item.quantity,
//             price: item.price, 
//             title: item.title,
//             image: item.image,
//         })),
//         total: this.cartTotal,
//         orderStatus: 'pending',
//         address: this.address.id(addressId)
//     };

//     this.orders.push(order);
//     this.cart = []; // Clear the cart after placing an order
//     this.cartTotal = 0; // Reset cart total
//     await this.save();

//     return {
//         message: 'Order placed successfully.',
//         orders: this.orders,
//     };
// };
userSchema.methods.placeOrder = async function (addressId) {
    console.log("Placing order...");

    const order = {
        products: this.cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            title: item.title,
            image: item.image,
            productStatus: 'pending' // Set initial product status to 'pending'
        })),
        total: this.cartTotal,
        address: this.address.id(addressId)
    };

    this.orders.push(order);
    this.cart = []; // Clear the cart after placing the order
    this.cartTotal = 0; // Reset cart total
    await this.save();

    return {
        message: 'Order placed successfully.',
        orders: this.orders,
    };
};

// Method to schedule a date for an order
// userSchema.methods.scheduleOrderDate = async function (orderId, scheduledDate) {
//     const order = this.orders.id(orderId);
//     if (!order) throw new Error('Order not found.');

//     // Set the scheduled date and update status to 'scheduled'
//     order.scheduledDate = scheduledDate;
//     order.orderStatus = 'scheduled';
    
//     await this.save();

//     return {
//         message: 'Order scheduled successfully.',
//         orderStatus: order.orderStatus,
//         scheduledDate: order.scheduledDate
//     };
// };

userSchema.methods.scheduleOrderDate = async function (orderId, productOrderId, scheduledDate) {
    const order = this.orders.id(orderId);
    console.log("orderId", orderId, "productId", productOrderId, "scheduledDate:", scheduledDate)
    if (!order) throw new Error('Order not found.');

    const product = order.products.id(productOrderId);
    if (!product) throw new Error('Product not found in this order.');

    // Update scheduled date and product status for the specified product
    product.scheduledDate = scheduledDate;
    product.productStatus = 'scheduled'; // Update product status to 'scheduled'

    await this.save();

    return {
        message: 'Order scheduled successfully.',
        product,
    };
};


// Method to change the order state to 'processing'
// userSchema.methods.setOrderToProcessing = async function (orderId) {
//     const order = this.orders.id(orderId);
//     if (!order) throw new Error('Order not found.');

//     // Update the order status to 'processing'
//     order.orderStatus = 'processing';

//     await this.save();

//     return {
//         message: 'Order is now processing.',
//         orderStatus: order.orderStatus
//     };
// };

userSchema.methods.setOrderToProcessing = async function (orderId, productOrderId) {
    const order = this.orders.id(orderId);
    if (!order) throw new Error('Order not found.');

    const product = order.products.id(productOrderId);
    if (!product) throw new Error('Product not found in this order.');

    // Update product status for the specified product to 'processing'
    product.productStatus = 'processing';

    await this.save();

    return {
        message: 'Product status updated to processing.',
        product,
    };
};


// Method to update test result for a product in an order
// userSchema.methods.uploadTestResult = async function (orderId, productId, testResult) {
//     const order = this.orders.id(orderId);
//     if (!order) throw new Error('Order not found.');

//     const product = order.products.find(p => p.productId.toString() === productId.toString());
//     if (!product) throw new Error('Product not found in this order.');

//     product.testResults.push(testResult);

//     // Check if all products have their test results uploaded
//     const allProductsCompleted = order.products.every(p => p.testResults.length > 0);

//     if (allProductsCompleted) {
//         order.orderStatus = 'completed';
//     }

//     await this.save();

//     return {
//         message: 'Test result uploaded successfully.',
//         orderStatus: order.orderStatus
//     };
// };


userSchema.methods.uploadTestResult = async function (orderId, productOrderId, testResult) {
    const order = this.orders.id(orderId);
    if (!order) throw new Error('Order not found.');

    const product = order.products.id(productOrderId);
    if (!product) throw new Error('Product not found in this order.');

    // Add the test result to the specified product
    product.testResults.push(testResult);
    product.productStatus = 'completed'; // Mark product as completed if test result is uploaded

    // Check if all products have their test results uploaded
    const allProductsCompleted = order.products.every(p => p.productStatus === 'completed');

    if (allProductsCompleted) {
        order.orderStatus = 'completed'; // Mark entire order as completed if all products are done
    }

    await this.save();

    return {
        message: 'Test result uploaded successfully.',
        orderStatus: order.orderStatus,
        product,
    };
};

module.exports = mongoose.model('User', userSchema);
