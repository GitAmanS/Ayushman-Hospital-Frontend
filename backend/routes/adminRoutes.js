const express = require('express');
const multer = require('multer');
const path = require('path');
const { Product, Category } = require('../models/Product'); // Update with your actual model paths
const Admin = require('../models/Admin');
const {User, Order} = require('../models/User'); // Import User model
const adminAuth = require('../middleware/adminAuth'); // Middleware for admin authentication
const jwt = require('jsonwebtoken'); // For generating JWT
const mongoose = require('mongoose');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save the uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Use a timestamp to avoid name collisions
    }
});

const upload = multer({ storage });

// Route for admin login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("usernmae and pass", username)
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        console.log(admin)

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set cookie with the token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour in milliseconds
        });
        console.log("cookie sent success")
        res.json({ message: 'Login successful', username:username });
    } catch (err) {
        console.log("error", err);
        res.status(500).json({ message: 'Error logging in', error: err });
    }
});

// Route to create a new category
router.post('/categories', adminAuth, upload.single('image'), async (req, res) => {
    const { name, description } = req.body; // Include description
    const image = req.file ? req.file.path.replace(/\\/g, '/') : null; // Replace backslashes with forward slashes

    if (!image) {
        return res.status(400).json({ message: 'Image file is required' });
    }

    const category = new Category({ name, description, image }); // Include description in the category
    try {
        await category.save();
        res.status(201).json({...category, id: category._id });
    } catch (err) {
        res.status(500).json({ message: 'Error creating category', error: err });
    }
});


// Route to get all categories
router.get('/categories', adminAuth, async (req, res) => {
    try {
        const categories = await Category.find();

        // Check if categories is an array
        if (!Array.isArray(categories)) {
            return res.status(500).json({ message: 'Data is not an array' });
        }

        // Add 'id' field to each category by mapping over the array
        const categoriesWithId = categories.map(category => ({
            ...category.toObject(),  // Keep all original fields
            id: category._id.toString() // Add 'id' field mapped from '_id'
        }));

        // Send the response in the required format
        res.status(200).json({
            data: categoriesWithId, // Data with 'id' field included
            total: categories.length // Total number of categories
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching categories', error: err });
    }
});


// Route to update a category by ID
router.put('/categories/:id', adminAuth, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        // Fetch the existing category to retain the current image if no new image is uploaded
        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const updateData = { name, description };

        // Check if a new image has been uploaded
        if (req.file) {
            console.log('Uploaded File:', req.file);
            const image = req.file.path.replace(/\\/g, '/'); // Replace backslashes with forward slashes
            updateData.image = image; // Update with the new image path
            console.log("Image is included");
        } else {
            // If no new image is provided, keep the existing image path
            console.log('No image included');
            updateData.image = existingCategory.image; // Retain the old image
        }

        // Update the category with the new data
        const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ ...category.toObject(), id: category._id.toString() }); // Send the updated category data
    } catch (err) {
        res.status(500).json({ message: 'Error updating category', error: err });
    }
});





// Route to get a category by ID
router.get('/categories/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({
            message: 'Category retrieved successfully',
            data: {...category.toObject(), 
                id: category._id.toString()} // Include the category data in the response
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching category', error: err.message });
    }
});



// Route to delete a category by ID
router.delete('/categories/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting category', error: err });
    }
});

// Route to delete multiple categories
router.delete('/categories', adminAuth, async (req, res) => {
    const { ids } = req.body; // Array of category IDs to delete
    console.log("this executed")
    try {
        const result = await Category.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No categories found for deletion' });
        }

        res.status(200).json({ message: `${result.deletedCount} categories deleted successfully` });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting categories', error: err });
    }
});




// Route to create a new product
router.post('/products', adminAuth, upload.single('image'), async (req, res) => {
    const { title, desc, categories, reports_within, contains_tests, price } = req.body;
    
    const updateData = { title, desc, category:categories, reports_within, contains_tests,price };
    console.log("updateDate:", updateData)

    if (req.file) {
        console.log('Uploaded File:', req.file);
        const image = req.file.path.replace(/\\/g, '/'); // Replace backslashes with forward slashes
        updateData.image = image; // Update with the new image path
        console.log("Image is included");
    } else {
        // If no new image is provided, keep the existing image path
        console.log('No image included');
        return res.status(400).json({ message: 'Image file is required' });
    }
    const product = new Product(updateData);
    try {
        await product.save();
        res.status(201).json({ ...product, id: product._id });
    } catch (err) {
        res.status(500).json({ message: 'Error creating product', error: err });
    }
});

// Route to get all products
router.get('/products', adminAuth, async (req, res) => {
    try {
        const products = await Product.find();

        // Fetch category names asynchronously
        const productsWithCategoryName = await Promise.all(products.map(async (product) => {
            const category = await Category.findById(product.category); // Fetch category by ID
            return {
                ...product.toObject(), // Convert MongoDB document to plain object
                id: product._id,       // Map MongoDB's _id to id
                categoryName: category ? category.name : 'Unknown', // Handle the case where category may not be found
            };
        }));

        res.status(200).json({ data: productsWithCategoryName, total: productsWithCategoryName.length });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching products', error: err });
    }
});

// Route to get a single product by ID
router.get('/products/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const category = await Category.findById(product.category);
        const productWithCategoryName = {
            ...product.toObject(),
            id: product._id,
            categoryName: category ? category.name : 'Unknown',
        };

        res.status(200).json({ data: productWithCategoryName });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching product', error: err });
    }
});


// Route to update a product by ID
router.put('/products/:id', adminAuth, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, desc, category, reports_within, contains_tests, price } = req.body;

    try {
        // Find the existing product
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Build the updateData object by checking each field
        const updateData = {
            title: title || existingProduct.title, // If title is missing, keep the existing one
            desc: desc || existingProduct.desc,
            category: category || existingProduct.category,
            reports_within: reports_within || existingProduct.reports_within,
            contains_tests: contains_tests || existingProduct.contains_tests,
            price: price || existingProduct.price,
        };

        console.log("updated product:", updateData)

        // Check if a new image has been uploaded
        if (req.file) {
            const image = req.file.path.replace(/\\/g, '/'); // Replace backslashes with forward slashes
            updateData.image = image; // Update with the new image path
        } else {
            // Retain the old image if no new image is provided
            updateData.image = existingProduct.image;
        }

        // Update the product in the database
        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find the category name (if exists) to include it in the response
        const categoryData = await Category.findById(product.category);
        const productWithCategoryName = {
            ...product.toObject(),
            id: product._id,
            categoryName: categoryData ? categoryData.name : 'Unknown',
        };

        res.status(200).json(productWithCategoryName);
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ message: 'Error updating product', error: err });
    }
});



// Route to delete a product by ID
router.delete('/products/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting product', error: err });
    }
});


// Route to delete multiple products by IDs
router.delete('/products', adminAuth, async (req, res) => {
    const { ids } = req.body; // Expect an array of IDs in the request body
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'No product IDs provided' });
    }

    try {
        const result = await Product.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Products deleted successfully', deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting products', error: err });
    }
});













//handle orders

// Route to schedule an order for a specific product
router.post('/orders/:orderId/product/:productOrderId/schedule', async (req, res) => {
    console.log("body:", req.body)
    const { userId, scheduledDate } = req.body.data; // Assume userId and scheduledDate are sent in the request body
    const { orderId, productOrderId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found.');

        const response = await user.scheduleOrderDate(orderId, productOrderId, scheduledDate);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

// Route to update the processing state of a specific product in an order
router.put('/orders/:orderId/product/:productOrderId/process', async (req, res) => {
    const { userId } = req.body.data; // Assume userId is sent in the request body
    const { orderId, productOrderId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found.');

        const response = await user.setOrderToProcessing(orderId, productOrderId);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(error.message);
    }
});



// Update multer to accept PDF uploads
const pdfStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/test-results/'); // Directory to save the test result PDFs
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Use a timestamp to avoid name collisions
    }
});

// Filter to accept only PDF files
const pdfFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDFs are allowed'), false);
    }
};

// Set up multer to use the PDF storage and filter
const uploadPDF = multer({ 
    storage: pdfStorage,
    fileFilter: pdfFilter
});

// Route to upload a test result (PDF) for a specific product in an order
router.post('/orders/:orderId/product/:productOrderId/test-result',adminAuth, uploadPDF.single('testResult'), async (req, res) => {
    console.log(req.body)
    const { userId } = req.body; // Assume userId is sent in the request body
    const { orderId, productOrderId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        if (!req.file) return res.status(400).json({ message: 'Test result PDF file is required.' });

        // Get the uploaded file path
        const testResultPath = req.file.path.replace(/\\/g, '/'); // Use forward slashes for consistency
        console.log(testResultPath)

        const TestResult = {
            pdfLink: testResultPath
        }

        // Update the user's order with the test result link for the specific product
        const response = await user.uploadTestResult(orderId, productOrderId, TestResult);

        res.status(200).json({ message: 'Test result uploaded successfully', testResultPath });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message });
    }
});

// Get all orders
router.get('/orders',adminAuth, async (req, res) => {
    try {
        const users = await User.find().populate('orders.products.productId'); // Populate product details
        const allOrders = users.flatMap(user => 
            user.orders.map(order => ({
                id: order._id, // Assuming each order has an ID
                products: order.products, // Include the products array
                userId: user._id, // Add user ID
                userPhone: user.phone, // Add user phone
                address: order.address,
                totalAmount: order.total,
            }))
        );

        res.status(200).json({ data: allOrders, total: allOrders.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get user details and their orders
router.get('/orderuser',adminAuth, async (req, res) => {
    const { userId } = req.body; // Assume userId is sent in the request body
    try {
        const user = await User.findById(userId).populate('orders.products.productId'); // Populate orders with product details
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a single order and its products
router.get('/orders/:orderId',adminAuth, async (req, res) => {
    const { orderId } = req.params;
    console.log("order id:", orderId)

    try {
        // Use mongoose.Types.ObjectId to convert orderId
        const userWithOrder = await User.findOne({
            orders: { 
                $elemMatch: { _id: new mongoose.Types.ObjectId(orderId) } // Use `new mongoose.Types.ObjectId(orderId)` if necessary
            }
        });

        if (!userWithOrder) {
            console.log("order not found")
            return res.status(404).json({ message: 'Order not found.' });
        }


        // Extract the specific order using the orderId
        const order = userWithOrder.orders.id(orderId); // Ensure this is valid
        // Check if the order exists
        
        if (!order) {
            console.log("order not found")
            return res.status(404).json({ message: 'Order not found.' });
        }

      

        // Return the specific order details
                // Include userId in the response along with the order data
                return res.status(200).json({
                    data: {
                        userId: userWithOrder._id, // Include the user's ID
                        ...order.toObject(),       // Spread the order details
                        id: order._id              // Ensure the order ID is included
                    }
                });
    } catch (error) {
        console.error('Error fetching order:', error); // Log the error for debugging
        return res.status(500).json({ message: 'Internal server error.' });
    }
});


// Route to delete multiple orders
router.delete('/orders',adminAuth, async (req, res) => {
    const { ids } = req.body; // Assume orderIds is sent in the request body as an array
    console.log("order body:", req.body)
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Order IDs must be provided as an array.' });
    }

    try {
        // Ensure all orderIds are valid ObjectId
        // const validOrderIds = ids.map(id => mongoose.Types.ObjectId(id));

        // Delete the orders from the database
        const result = await User.updateMany(
            {},
            { $pull: { orders: { _id: { $in: ids } } } } // Pull orders from the user collection
        );

        // Check if any orders were deleted
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'No orders found for the provided IDs.' });
        }

        res.status(200).json({ message: `${result.modifiedCount} orders deleted successfully.` });
    } catch (error) {
        console.error('Error deleting orders:', error); // Log the error for debugging
        return res.status(500).json({ message: 'Internal server error.' });
    }
});




// Route to delete a single order by orderId
router.delete('/orders/:orderId', async (req, res) => {
    const { orderId } = req.params; // Get the orderId from the route parameters

    try {
        // Find the user who has the order and delete the specific order
        const result = await User.updateOne(
            { 'orders._id': orderId }, // Match user with the specified order ID
            { $pull: { orders: { _id: orderId } } } // Remove the order from the user's orders array
        );

        // Check if the order was found and deleted
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.status(200).json({ message: 'Order deleted successfully.' });
    } catch (error) {
        console.error('Error deleting order:', error); // Log the error for debugging
        return res.status(500).json({ message: 'Internal server error.' });
    }
});




router.get('/check-auth',adminAuth,  async(req,res)=>{
    try{
        if(!req.admin){
            res.status(500).json({message:"admin doesn't exist"})
        }

        res.status(200).json({message:"authentication success"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})


// Route to get all users
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json({
            data: users.map(user => ({
                id: user._id,
                email: user.email,
                joinedAt: user.joinedAt, 
                phone:user.phone,
                address: user.address
            })),
            total: users.length
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

// Route to delete a user by ID
router.delete('/users/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id); // Delete user by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
});

// Route to delete multiple users by an array of IDs
router.delete('/users', adminAuth, async (req, res) => {
    const { ids } = req.body; // Accept array of user IDs in the request body
    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: 'No user IDs provided' });
    }
    
    try {
        // Delete multiple users using deleteMany
        const result = await User.deleteMany({ _id: { $in: ids } });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No users found with the provided IDs' });
        }
        
        res.status(200).json({
            message: `${result.deletedCount} user(s) deleted successfully`,
            deletedCount: result.deletedCount
        });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting users', error: err.message });
    }
});



// Route to add a new admin
router.post('/admins', async (req, res) => {
    const { username, password, role } = req.body.params.data;
    
    console.log("req:", req.body)
    try {
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const newAdmin = new Admin({ username, role });
        newAdmin.password = await newAdmin.hashPassword(password); // Hash the password before saving
        await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully', id: newAdmin._id });
        // res.status(201).json({ message: 'New admin created successfully', admin: { username: newAdmin.username } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error creating admin', error: err });
    }
});


// // Route to create a new admin (register)
// router.post('/admins', async (req, res) => {
//     const { username, password } = req.body; // Get username and password from request body

//     try {
//         const existingAdmin = await Admin.findOne({ username });
//         if (existingAdmin) {
//             return res.status(400).json({ message: 'Admin already exists' });
//         }

//         const admin = new Admin({ username, password }); // Create a new Admin instance

//         // Save the admin and return response
//         await admin.save();
        
//     } catch (err) {
//         res.status(500).json({ message: 'Error creating admin', error: err });
//     }
// });



// Route to get all admins
router.get('/admins', adminAuth, async (req, res) => {
    if (!req.admin || req.admin.role !== 'superadmin') {
        console.log("admin is not superadmin");
        return res.status(403).json({ message: 'Access denied: Superadmin role required' });
    }

    try {
        const admins = await Admin.find();
        
        // Transform admins to include id field
        const adminsWithId = admins.map(admin => ({
            ...admin.toObject(), // Convert Mongoose document to plain object
            id: admin._id.toString() // Add 'id' field mapped from '_id'
        }));

        res.status(200).json({
            data: adminsWithId, // Admins data with 'id' field included
            total: adminsWithId.length // Total number of admins
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching admins', error: err });
    }
});


// Route to delete a single admin by ID
router.delete('/admins/:id', adminAuth, async (req, res) => {

    if (req.admin && req.admin.role !== 'superadmin') {

        console.log("admin is not superadmin")
        res.status(403).json({ message: 'Access denied: Superadmin role required' });
    }else{
        console.log("admin is superadmin")
    }
    const { id } = req.params;
    try {
        const admin = await Admin.findByIdAndDelete(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting admin', error: err });
    }
});

// Route to delete multiple admins
router.delete('/admins', adminAuth, async (req, res) => {
    if (req.admin && req.admin.role !== 'superadmin') {

        console.log("admin is not superadmin")
        res.status(403).json({ message: 'Access denied: Superadmin role required' });
    }
    const { ids } = req.body; // Array of admin IDs to delete
    try {
        
        const result = await Admin.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No admins found for deletion' });
        }

        res.status(200).json({ message: `${result.deletedCount} admins deleted successfully` });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting admins', error: err });
    }
});

// Route to get one admin by ID (getOne)
router.get('/admins/:id', adminAuth, async (req, res) => {
    if (req.admin && req.admin.role !== 'superadmin') {

        console.log("admin is not superadmin")
        res.status(403).json({ message: 'Access denied: Superadmin role required' });
    }
    const { id } = req.params;
    try {
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ data: { ...admin, id: admin._id } });

    } catch (err) {
        res.status(500).json({ message: 'Error fetching admin', error: err });
    }
});


router.post('/logout', (req, res) => {
    // Clear the 'token' cookie
    res.clearCookie('token'); // This should match the cookie name you are using
    res.status(200).json({ message: 'Logged out successfully' });
});


router.get('/checkRole', adminAuth, async (req, res) => {

    try {
        // Check if the admin's role is "superadmin"
        console.log("req admin:",req.admin)
        if (req.admin.role != "superadmin") {
            // Return a 403 Forbidden status if not superadmin
            return res.status(200).json({ message: 'Access denied: You do not have the required permissions.', role:req.admin.role, "admin":req.admin, });
        }

        // If the role is superadmin, respond with a success message
        return res.status(200).json({ message: 'Access granted: You are a superadmin.', role:req.admin.role });
    } catch (error) {
        console.error(error);
        // Handle any other errors
        return res.status(500).json({ message: 'An error occurred while checking role.', error });
    }
});


router.get('/check-auth', adminAuth, async (req, res) => {


        return res.status(200).json({ message: 'Access granted: You are a superadmin.', role:req.admin.role });

});







// Export the router
module.exports = router;
