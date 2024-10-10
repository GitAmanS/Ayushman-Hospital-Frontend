import React, { useState } from 'react';
import servicesData from './items.json'; // Adjust the path accordingly
import { Link } from 'react-router-dom';

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter products based on the selected category
  const filteredProducts = selectedCategory === 'All'
    ? servicesData.categories.flatMap(category => category.products)
    : servicesData.categories.find(cat => cat.category === selectedCategory)?.products || [];

  return (
    <div className="p-4 mt-20 md:px-40">
      <h1 className="text-2xl font-bold mb-4">Our Services</h1>
      
      {/* Category Filter Buttons */}
      <div className="mb-4">
        <button
          className="text-blue-600 hover:underline mr-4"
          onClick={() => setSelectedCategory('All')}
        >
          All
        </button>
        {servicesData.categories.map(category => (
          <button
            key={category.category}
            className="text-blue-600 hover:underline mr-4"
            onClick={() => setSelectedCategory(category.category)}
          >
            {category.category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.product_id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
            <Link to={`/product/${product.product_id}`}>
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-medium">{product.title}</h3>
              <p className="text-sm text-gray-600">{product.desc}</p>
              <p>Reports within: {product.reports_within}</p>
              <p>Contains tests: {product.contains_tests}</p>
              <p>Price: ₹{product.price}</p>
              <span className="mt-2 inline-block text-blue-600 hover:underline cursor-pointer">
                Book Now
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
