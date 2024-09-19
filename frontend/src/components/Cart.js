import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './Context/UserContext'; // Assume the cart data is stored in UserContext
import { IoMdArrowRoundBack } from "react-icons/io";
const Cart = () => {
  const { cartProducts } = useContext(UserContext); // Access cart data from UserContext
  console.log("card product:", cartProducts)
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className='open-sans'>
        <div className='flex flex-row items-center p-4 border-b gap-4'>
            <button onClick={handleGoHome} className='bg-gray-100 p-3 rounded-full'><IoMdArrowRoundBack/></button>
            <h1 className='font-bold'>Cart</h1>
        </div>
        <div className='p-4 flex flex-col justify-end '>
            <div>
                <h1 className='font-bold pb-2'>Tests added</h1>
            </div>
            {/* Check if cart has items */}
            {cartProducts && cartProducts.length > 0? (
                <div>
                {cartProducts.map((item) => (
                    
                    <div key={item.id} className='flex flex-row py-2'>
                    <img src={item.image} className='h-10 w-10 object-cover rounded-lg'/>
                    <div className='flex px-2 flex-col gap-1 justify-start'>
                    <h3 className='font-bold text-sm'>{item.title}</h3>
                    <p className='text-xs text-gray-500'>
                        {item.desc}
                    </p>
                    <p className='text-base'> ₹{item.price}</p>
                    {/* <p>Quantity: {item.quantity}</p> */}
                    </div>
                    <div className='flex flex-col items-center ml-auto'>
                    <div className="flex flex-row border ml-auto h-fit text-red-400 font-bold  rounded">
                        <button className='px-3 py-1 hover:bg-gray-200'>-</button>
                        <span className='px-3 py-1'>{item.quantity}</span>
                        <button className='px-3 py-1 hover:bg-gray-200'>+</button>
                    </div>
                    <div>
                        <h1 className='text-xs text-gray-500'>Patient(s)</h1>
                    </div>
                    </div>


                    </div>
                ))}
                </div>
            ) : (
                // Display "Your cart is empty" if no items in cart
                <div className='flex flex-col items-center '>
                    <img src="./basket.png" alt="basket-image" className="w-fit px-24 mb-[-16px] object-cover rounded-md" />
                    <p className='font-bold'>Your cart is empty</p>
                    <button onClick={handleGoHome} className='text-red-500 border p-2 px-8 mt-2 rounded font-bold'>
                        Go to Home
                    </button>
                </div>
            )}
        </div>
      
    </div>
  );
};

export default Cart;
