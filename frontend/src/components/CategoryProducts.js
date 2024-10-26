import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from './Context/UserContext';

const CategoryProducts = () => {
  const { categoryId } = useParams(); // Get the category name from the URL
  const { addItemToCart, categories, cartProducts, decreaseItemQuantity } = useContext(UserContext);

  // Find the category based on the categoryId
  const category = categories.find((cat) => cat._id === categoryId);
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Updated to use navigate
  };

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="flex flex-col p-4 pt-24 md:px-40">
      <h1 className="text-xl font-semibold pb-2">{category.category} Products</h1>
      {/* Display the products for the selected category */}
      <div className="">
        {category.products.map((product) => {
          // Check if the product is already in the cart
          const cartItem = cartProducts.find(item => item.productId === product._id);
          const itemInCart = cartItem ? cartItem.quantity : 0; // Get the quantity or default to 0

          return (
            <div key={product._id} className="bg-white py-6 border-b rounded-lg">
              {/* Set the image to a wide rectangle (4:3 ratio) */}
              <div className="w-full h-48 md:h-60" onClick={() => handleProductClick(product._id)}>
                <img
                  src={`/${product.image}`}
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
                {itemInCart > 0 ? (
                  <div className="flex flex-col items-center ml-auto">
                    <div className="flex flex-row border h-fit text-red-400 font-bold rounded">
                      <button onClick={() => decreaseItemQuantity(product._id)} className="px-3 py-1 hover:bg-gray-200">-</button>
                      <span className="px-3 py-1">{itemInCart}</span>
                      <button onClick={() => addItemToCart(product._id)} className="px-3 py-1 hover:bg-gray-200">+</button>
                    </div>
                    <h1 className="text-xs text-gray-500">Patient(s)</h1>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      addItemToCart(product._id);
                    }}
                    className="flex text-sm justify-center items-center rounded-lg border font-semibold ml-auto text-red-500 shadow-md p-3"
                  >
                    ADD TO CART
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryProducts;
