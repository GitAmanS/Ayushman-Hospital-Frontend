import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from './Context/UserContext';

const CategoryProducts = () => {
  const { categories } = useContext(UserContext);
  const { categoryId } = useParams(); // Get the category name from the URL
  const { addItemToCart } = useContext(UserContext);

  // Find the category based on the categoryId
  const category = categories.find((cat) => cat._id === categoryId);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="flex flex-col p-4 pt-24 md:px-40">
      <h1 className="text-xl font-semibold pb-2">{category.category} Products</h1>
      {/* Display the products for the selected category */}
      <div className="">
        {category.products.map((product) => (
          <div key={product._id} className="bg-white py-6 border-b rounded-lg">
            {/* Set the image to a wide rectangle (4:3 ratio) */}
            <div className="w-full h-48 md:h-60">
              <img
                src={`http://localhost:5000/${product.image}`}
                alt={product.title}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <h3 className="text-md font-semibold mt-2">{product.title}</h3>
            <div className="text-sm">
              <p>Reports within: {product.reports_within}</p>
              <p>Contains {product.contains_tests} tests</p>
            </div>
            <div className="flex pt-4 items-end justify-center">
              <h1 className="font-bold mr-auto">₹{product.price}</h1>
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
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;
