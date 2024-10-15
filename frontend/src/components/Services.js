import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './Context/UserContext';

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { categories, addItemToCart } = useContext(UserContext);
  
  const navigate = useNavigate();

  // Filter products based on the selected category
  const filteredProducts = selectedCategory === 'All'
    ? categories.flatMap(category => category.products)
    : categories.find(cat => cat.category === selectedCategory)?.products || [];

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to the product page
  };

  return (
    <div className="p-4 mt-20 md:px-40">
      <h1 className="text-2xl font-bold mb-4">Our Services</h1>
      
      {/* Category Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            selectedCategory === 'All'
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-gray-100 text-blue-600 hover:bg-blue-500 hover:text-white'
          }`}
          onClick={() => setSelectedCategory('All')}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selectedCategory === category.category
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-gray-100 text-blue-600 hover:bg-blue-500 hover:text-white'
            }`}
            onClick={() => setSelectedCategory(category.category)}
          >
            {category.category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product._id)}  // Only use navigate here
              className="border p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-medium">{product.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{product.desc}</p>
              <p>Reports within: {product.reports_within}</p>
              <p>Contains tests: {product.contains_tests}</p>
              <p>Price: ₹{product.price}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent navigating to the product page when clicking the button
                  addItemToCart(product._id);
                }}
                className="flex text-sm justify-center items-center rounded-lg border font-semibold ml-auto text-red-500 shadow-md p-3"
              >
                Book Now
              </button>
            </div>
          ))
        ) : (
          <p>No products available for this category.</p>
        )}
      </div>
    </div>
  );
};

export default Services;
