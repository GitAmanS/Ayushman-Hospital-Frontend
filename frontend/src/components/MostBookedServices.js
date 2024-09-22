import React from 'react';
import { useNavigate } from 'react-router-dom'; // Updated to useNavigate
import items from './items.json'; // Import your items.json file

const mostBookedProductIds = [1, 3, 5]; // Dummy data for most booked product IDs

const MostBookedServices = () => {
  const navigate = useNavigate(); // Updated to useNavigate

  // Function to get the most booked products based on product IDs
  const getMostBookedProducts = () => {
    let mostBookedProducts = [];

    // Loop through the categories to find products that match the IDs
    items.categories.forEach((category) => {
      category.products.forEach((product) => {
        if (mostBookedProductIds.includes(product.product_id)) {
          mostBookedProducts.push(product);
        }
      });
    });

    return mostBookedProducts;
  };

  const mostBookedProducts = getMostBookedProducts();

  // Redirect to product page when a product is clicked
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Updated to use navigate
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Most Booked Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mostBookedProducts.map((product) => (
          <div
            key={product.product_id}
            onClick={() => handleProductClick(product.product_id)}
            className="cursor-pointer bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-600 mb-2">{product.desc}</p>
              <p className="text-gray-800 font-medium">Reports within: {product.reports_within}</p>
              <p className="text-gray-800 font-medium">Tests included: {product.contains_tests}</p>
              <p className="text-blue-600 font-bold mt-4">Price: ₹{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MostBookedServices;
