const express = require('express');
const multer = require('multer');
const { Product, Category } = require('../models/Product'); // Import both models

const router = express.Router();

// Set up Multer for file uploads (you can customize the destination folder)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Folder to store images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post('/category/add', upload.single('categoryImage'), async (req, res) => {
    try {
        const { name } = req.body;
        const image = req.file ? req.file.path : null;

        const category = new Category({
            name,
            image
        });

        await category.save();
        res.status(201).json({ message: 'Category added successfully', category });
    } catch (error) {
        res.status(400).json({ message: 'Error adding category', error: error.message });
    }
});


// Add a new product under a category
router.post('/product/add', upload.fields([{ name: 'categoryImage', maxCount: 1 }, { name: 'productImage', maxCount: 1 }]), async (req, res) => {
    try {
        const { title, desc, categoryName, reports_within, contains_tests, price } = req.body;

        // Create a new category (or find existing)
        const category = {
            name: categoryName,
            image: req.files['categoryImage'] ? req.files['categoryImage'][0].path : null
        };

        // Create a new product
        const product = new Product({
            title,
            desc,
            category,
            image: req.files['productImage'] ? req.files['productImage'][0].path : null,
            reports_within,
            contains_tests,
            price
        });

        await product.save();
        res.status(201).json({ message: 'Product added successfully', product: product.getProductDetails() });
    } catch (error) {
        res.status(400).json({ message: 'Error adding product', error: error.message });
    }
});

// Get all categories
router.get('/category', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
});

// Get all products
router.get('/product', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products.map(product => product.getProductDetails()));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// Get a product by ID
router.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product.getProductDetails());
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});

// Update a product by ID (also handle image updates)
router.put('/product/:id', upload.fields([{ name: 'categoryImage', maxCount: 1 }, { name: 'productImage', maxCount: 1 }]), async (req, res) => {
    try {
        const product = await Product.findProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { title, desc, categoryName, reports_within, contains_tests, price } = req.body;

        // Update product fields
        product.title = title || product.title;
        product.desc = desc || product.desc;
        product.category.name = categoryName || product.category.name;
        if (req.files['categoryImage']) {
            product.category.image = req.files['categoryImage'][0].path;
        }
        product.image = req.files['productImage'] ? req.files['productImage'][0].path : product.image;
        product.reports_within = reports_within || product.reports_within;
        product.contains_tests = contains_tests || product.contains_tests;
        product.price = price || product.price;

        await product.save();
        res.status(200).json({ message: 'Product updated successfully', product: product.getProductDetails() });
    } catch (error) {
        res.status(400).json({ message: 'Error updating product', error: error.message });
    }
});

// Delete a product by ID
router.delete('/product/:id', async (req, res) => {
    try {
        const product = await Product.findProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.remove();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

module.exports = router;
