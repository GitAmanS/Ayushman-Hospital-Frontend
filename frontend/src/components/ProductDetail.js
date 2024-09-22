// src/components/ProductDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';
import items from './items.json'; // Import your items.json file

const ProductDetail = () => {
  const { productId } = useParams(); // Get the product ID from the URL

  // Function to find product by ID
  const findProductById = (id) => {
    let foundProduct = null;
    items.categories.forEach((category) => {
      const productItem = category.products.find((product) => product.product_id === parseInt(id));
      if (productItem) {
        foundProduct = productItem;
      }
    });
    return foundProduct;
  };

  const product = findProductById(productId); // Fetch product details after defining the function

  if (!product) {
    return <div>Product not found</div>; // Handle case when product is not found
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
      <img src={product.image} alt={product.title} className="w-full h-64 object-cover mb-4" />
      <p className="mb-2">{product.desc}</p>
      <p className="font-medium">Reports within: {product.reports_within}</p>
      <p className="font-medium">Tests included: {product.contains_tests}</p>
      <p className="text-blue-600 font-bold mt-4">Price: ₹{product.price}</p>
    </div>
  );
};

export default ProductDetail;
