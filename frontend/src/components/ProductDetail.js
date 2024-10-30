import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from './Context/UserContext';

const ProductDetail = () => {
  const { productId } = useParams();
  console.log("productId:", productId);
  const { user, categories, cartProducts, addItemToCart, decreaseItemQuantity } = useContext(UserContext);

  const findProductById = (id) => {
    let foundProduct = null;
    categories.forEach((category) => {
      const productItem = category.products.find((product) => product._id === id);
      if (productItem) {
        foundProduct = productItem;
        console.log("product found");
      } else {
        console.log("product not found");
      }
    });
    return foundProduct;
  };

  const product = findProductById(productId);

  if (!product) {
    return <div>Product not found</div>;
  }

  const cartItem = cartProducts.find(item => item.productId === product._id);
  const itemInCart = cartItem ? cartItem.quantity : 0;

  return (
    <div className="flex flex-col h-screen pt-24 overflow-y-auto scrollbar-hide">
      {/* Scrollable Content with Hidden Scrollbar */}
      <div className="md:flex h-full p-6 pb-4 md:mx-32 overflow-y-auto scrollbar-hide">
        <div className='md:flex-1  '>
          <img src={product.image} alt={product.title} className="w-full rounded h-64 object-cover mb-4" />
    
        </div> 
        <div className='flex md:flex-1 flex-col px-4'>
          <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
          <p className="mb-2">{product.desc}</p>
          <div className='mt-auto md:mb-0 md:mt-0'>
            <p className="font-medium text-lg">Reports within: {product.reports_within}</p>
            <p className="font-medium text-lg">Tests included: {product.contains_tests}</p> 
          </div>
    
    
        </div>
      </div>

      {/* Fixed Bottom Section */}
      <div className="flex flex-row fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg md:px-32">
        <p className="text-black font-bold mt-4">Price: ₹{product.price}</p>
        {itemInCart > 0 ? (
          <div className="flex flex-col items-center ml-auto">
            <div className="flex flex-row border ml-auto h-fit text-red-400 font-bold rounded">
              <button onClick={() => decreaseItemQuantity(product._id)} className="px-3 py-1 hover:bg-gray-200">-</button>
              <span className="px-3 py-1">{itemInCart}</span>
              <button onClick={() => addItemToCart(product._id)} className="px-3 py-1 hover:bg-gray-200">+</button>
            </div>
            <h1 className="text-xs text-gray-500">Patient(s)</h1>
          </div>
        ) : (
          <button
            onClick={() => addItemToCart(product._id)}
            className="flex text-sm justify-center items-center rounded-lg border font-semibold ml-auto text-red-500 shadow-md p-3"
          >
            ADD TO CART
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
