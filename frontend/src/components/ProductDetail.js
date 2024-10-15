// src/components/ProductDetail.js
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { UserContext } from './Context/UserContext';

const ProductDetail = () => {
  const { productId } = useParams(); // Get the product ID from the URL
  console.log("productId:",productId)
  const {user, categories, addItemToCart} = useContext(UserContext)
  // Function to find product by ID
  const findProductById = (id) => {
    let foundProduct = null;
    categories.forEach((category) => {
      const productItem = category.products.find((product) => product._id === id);
      if (productItem) {
        foundProduct = productItem;
        console.log("product found")
      }else{
        console.log("productnotfound")
      }
    });
    return foundProduct;
  };

  const product = findProductById(productId); // Fetch product details after defining the function

  if (!product) {
    return <div>Product not found</div>; // Handle case when product is not found
  }

  return (
    <div className="flex flex-col p-6 pb-12 h-screen pt-24">
      <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
      <img src={`/${product.image}`} alt={product.title} className="w-full rounded h-64 object-cover mb-4" />
      <p className="mb-2">{product.desc}</p>
      <p className="font-medium">Reports within: {product.reports_within}</p>
      <p className="font-medium">Tests included: {product.contains_tests}</p>


      <div className="flex flex-row fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg">
        <p className="text-black font-bold mt-4">Price: ₹{product.price}</p>
        <button
          onClick={() => {
            addItemToCart(product._id);
          }}
          className="flex text-sm justify-center items-center rounded-lg border font-semibold ml-auto text-red-500 shadow-md p-3"
        >
          ADD TO CART
        </button>
      </div>


    </div>
  );
};

export default ProductDetail;
