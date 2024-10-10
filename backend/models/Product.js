const mongoose = require('mongoose');

// Define Category schema
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }, // New description field
    image: { type: String }
});

// Define Product schema with category as a reference (ObjectId)
const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Referencing Category
    image: { type: String },
    reports_within: { type: String },
    contains_tests: { type: Number },
    price: { type: Number, required: true }
});


// Instance method to get product details
ProductSchema.methods.getProductDetails = function() {
    return {
        title: this.title,
        desc: this.desc,
        category: this.category, // category will now be populated as an ObjectId
        image: this.image,
        reports_within: this.reports_within,
        contains_tests: this.contains_tests,
        price: this.price
    };
};

// Static method to find product by ID
ProductSchema.statics.findProductById = function(id) {
    return this.findById(id).populate('category'); // Populate category details
};

// Create models for Product and Category
const Product = mongoose.model('Product', ProductSchema);
const Category = mongoose.model('Category', CategorySchema);

module.exports = { Product, Category };
