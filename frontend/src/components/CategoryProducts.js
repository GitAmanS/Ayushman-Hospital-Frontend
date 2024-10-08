import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import itemsData from './items.json'; // Adjust the path as needed
import { UserContext } from './Context/UserContext';

const CategoryProducts = () => {
  const { categoryName } = useParams(); // Get the category name from the URL
  const { cartProducts, addItemToCart } = useContext(UserContext);
  // Find the category based on the categoryName
  const category = itemsData.categories.find(cat => cat.category === categoryName);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="flex flex-col p-4 pt-24">
      <h1 className='text-xl font-semibold pb-2'>{category.category} Products</h1>
      {/* Display the products for the selected category */}
      <div className="">
        {category.products.map((product, index) => (
          <div key={index} className="bg-white py-6 border-b  rounded-lg">
            <img src={product.image} alt={product.title} className="w-fit object-cover rounded-md" />
            <h3 className="text-md font-semibold mt-2">{product.title}</h3>
            <div className='text-sm'>
                <p>Reports within: {product.reports_within}</p>
                <p>Contains {product.contains_tests} tests</p>
            </div>
            <div className='flex pt-4 items-end justify-center'>
                <h1 className='font-bold mr-auto'>₹{product.price}</h1>
                <button onClick={()=>{addItemToCart(product.product_id)}} className='flex text-sm justify-center items-center rounded-lg border text-semibold ml-auto text-red-500 shadow-b-md p-3'>
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
