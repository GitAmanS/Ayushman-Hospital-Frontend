const express = require('express');
const multer = require('multer');
const path = require('path');
const { Product, Category } = require('../models/Product'); // Update with your actual model paths
const Admin = require('../models/Admin');
const User = require('../models/User'); // Import User model
const adminAuth = require('../middleware/adminAuth'); // Middleware for admin authentication
const jwt = require('jsonwebtoken'); // For generating JWT

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
    const { title, desc, categories, reports_within, contains_tests, price } = req.body;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = { title, desc, category:categories, reports_within, contains_tests,price };
    // const image = req.file ? req.file.path.replace(/\\/g, '/') : null; // Get the uploaded image path


            // Check if a new image has been uploaded
            if (req.file) {
                console.log('Uploaded File:', req.file);
                const image = req.file.path.replace(/\\/g, '/'); // Replace backslashes with forward slashes
                updateData.image = image; // Update with the new image path
                console.log("Image is included");
            } else {
                // If no new image is provided, keep the existing image path
                console.log('No image included');
                updateData.image = existingProduct.image; // Retain the old image
            }
    // const updateData = { title, desc, category:categories, reports_within, contains_tests, price };
    // if (image) {
    //     updateData.image = image;
    // }

    try {
        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        const categoryData = await Category.findById(product.category);
        const productWithCategoryName = {
            ...product.toObject(),
            id: product._id,
            categoryName: categoryData ? categoryData.name : 'Unknown',
        };

        res.status(200).json( productWithCategoryName );
    } catch (err) {
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

// Route to add a new admin
router.post('/admins', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const newAdmin = new Admin({ username });
        newAdmin.password = await newAdmin.hashPassword(password); // Hash the password before saving
        await newAdmin.save();

        res.status(201).json({ message: 'New admin created successfully', admin: { username: newAdmin.username } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error creating admin', error: err });
    }
});











//handle orders

router.post('/order/:orderId/schedule/:productOrderId', async (req, res) => {
    const { userId } = req.body; // Assume userId is sent in the request body
    const { orderId, productOrderId } = req.params;

    console.log("orderId", orderId, "productId", productOrderId)
    const { scheduledDate } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found.');

        const response = await user.scheduleOrderDate(orderId, productOrderId, scheduledDate);
        console.log("orderId", orderId, "productId", productOrderId, "scheduledDate:", scheduledDate)
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

router.put('/order/:orderId/process/:productOrderId', async (req, res) => {
    const { userId } = req.body; // Assume userId is sent in the request body
    const { orderId, productOrderId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found.');

        const response = await user.setOrderToProcessing(orderId, productOrderId);
        return res.status(200).json(response);
    } catch (error) {
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

// Route to upload test result (PDF)
router.post('/order/:orderId/test-result/:productOrderId', uploadPDF.single('testResult'), async (req, res) => {
    const { userId } = req.body; // Assume userId is sent in the request body
    const { orderId, productOrderId } = req.params;

    try {
        // Validate user and request
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        if (!req.file) return res.status(400).json({ message: 'Test result PDF file is required.' });

        // Get the uploaded file path
        const testResultPath = req.file.path.replace(/\\/g, '/'); // Use forward slashes for consistency

        // Update the user's order with the test result link
        const response = await user.uploadTestResult(orderId, productOrderId, testResultPath);

        res.status(200).json({ message: 'Test result uploaded successfully', testResultPath });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


router.get('/orders', async (req, res) => {
    try {
        const users = await User.find().populate('orders.products.productId'); // Populate product details
        const allOrders = users.flatMap(user => 
            user.orders.map(order => ({
                // Include only necessary properties from the order
                id: order._id, // Assuming each order has an ID
                products: order.products, // Include the products array
                status: order.status, // Include other order-specific fields as needed
                userId: user._id, // Add user ID
                userPhone: user.phone // Add user phone
            }))
        );

        const olorders = users.flatMap(user=>
            user.orders.map(order =>({
                order
            }))
        )
        res.status(200).json({data:allOrders, total: allOrders.length});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/orderuser', async (req, res) => {
    const { userId } = await req.body;
    console.log("userID:", userId)
    try {
        const user = await User.findOne({ userId });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msessage: error.message });
    }
});

// Route to get a single order
router.get('/orders/:orderId', async (req, res) => {
    const { userId } = req.body; // Assume userId is sent in the request body
    const { orderId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        // Find the order based on the orderId and productOrderId
        const order = user.orders.id(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found.' });

        // const product = order.products.id(productOrderId);
        // if (!product) return res.status(404).json({ message: 'Product order not found.' });

        // Return the specific order and product details
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: error.message });
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





// Export the router
module.exports = router;
