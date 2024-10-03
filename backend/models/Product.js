const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String }
});

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    category: { type: CategorySchema, required: true },
    image: { type: String },
    reports_within: { type: String },
    contains_tests: { type: Number },
    price: { type: Number, required: true }
});

ProductSchema.methods.getProductDetails = function() {
    return {
        title: this.title,
        desc: this.desc,
        category: this.category,
        image: this.image,
        reports_within: this.reports_within,
        contains_tests: this.contains_tests,
        price: this.price
    };
};

// Static method to find product by ID
ProductSchema.statics.findProductById = function(id) {
    return this.findById(id);
};

const Product = mongoose.model('Product', ProductSchema);
const Category = mongoose.model('Category', CategorySchema);

module.exports = { Product, Category };
