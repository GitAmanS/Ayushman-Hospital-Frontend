import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './Context/UserContext';
import { IoMdArrowRoundBack } from "react-icons/io";
import { EmojioneShoppingCart } from './icons/EmojioneShoppingCart';
import AddressSlidingSection from './slidingSections/AddressSlidingSection';
import LoginSlidingSection from './slidingSections/LoginSlidingSection';

const Cart = () => {
  const { cartProducts, user, clearCart, localCart, fetchCart,removeProductFromCart, setAddresses, cartTotal, selectedAddress, setSelectedAddress, addItemToCart, decreaseItemQuantity } = useContext(UserContext);
  
  let currentCart = user ? cartProducts : localCart; // Use localCart if user is not logged in
  const navigate = useNavigate();
  const [isAddressSlideOpen, setIsAddressSlideOpen] = useState(false);
  const [isLoginSlideOpen, setIsLoginSlideOpen] = useState(false);

  useEffect(()=>{
    fetchCart();
  }, [])

  // Toggle the sliding sections
  const handleContinueClick = () => {
    if (user) {
      setIsAddressSlideOpen(true); // Open Address section if user is logged in
    } else {
      setIsLoginSlideOpen(true); // Open Login section if user is not logged in
    }
  };

  // This will be called after successful login
  const handleLoginSuccess = () => {
    setIsLoginSlideOpen(false); // Close Login section
    setIsAddressSlideOpen(true); // Open Address section after login
  };

  const initiateRazorpayPayment = async () => {
    const response = await fetch('/api/start-payment', { method: 'POST' });
    const data = await response.json();
    
    const options = {
        key: data.razorpaykeyId,
        amount: data.amount * 100,
        currency: data.currency,
        name: 'Ayushman Hospital',
        description: `Products purchased: ${cartProducts}`,
        order_id: data.razorpayOrderId,
        handler: async function (response) {
            const paymentData = {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                addressId: selectedAddress._id
            };
            
            const verifyResponse = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData),
            });

            const result = await verifyResponse.json();

            fetchCart();

            if (result.success) {
                alert('Payment Successful and Order Placed!');
            } else {
                alert('Payment failed.');
            }
        },
        prefill: {
            name: 'Customer Name',
            email: 'customer@example.com',
            contact: '9999999999',
        },
        theme: {
            color: '#F37254',
        },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="open-sans flex flex-col min-h-screen">
      <div className="flex flex-row items-center p-4 border-b md:px-36 gap-4">
        <button onClick={() => { navigate("/") }} className="bg-gray-100 p-3 rounded-full">
          <IoMdArrowRoundBack />
        </button>
        <h1 className="font-bold">Cart</h1>
      </div>
      <div className="p-4 flex flex-col justify-end md:px-36">
        {currentCart && currentCart.length > 0 ? (
          <div>
            <h1 className="font-bold pb-2">Tests added</h1>
            <button onClick={clearCart}>Clear Cart</button>
            {currentCart.map((item) => (

  <div key={item.productId} className="flex flex-col py-2">
    <div className='flex flex-row py-2'>
      <img src={item.image} className="h-10 w-10 object-cover rounded-lg" />

    <div className="flex px-2 flex-col gap-1 justify-start">
      <h3 className="font-bold text-sm">{item.title}</h3>
      <p className="text-base"> ₹{item.price * item.quantity}</p>
    </div>

    <div className="flex flex-col items-center ml-auto">
      
      <div className="flex flex-row border ml-auto h-fit text-red-400 font-bold rounded">
        <button onClick={() => decreaseItemQuantity(item.productId)} className="px-3 py-1 hover:bg-gray-200">-</button>
        <span className="px-3 py-1">{item.quantity}</span>
        <button onClick={() => addItemToCart(item.productId)} className="px-3 py-1 hover:bg-gray-200">+</button>
      </div>
      <h1 className="text-xs text-gray-500">Patient(s)</h1>
      
    </div>
    </div>
    

        {/* Remove button */}
        <button
          onClick={() => removeProductFromCart(item.productId)}
          className="py-2 w-full border border-gray-300 text-red-600 font-semibold hover:bg-gray-100 rounded"
        >
      Remove
    </button>
    

  </div>
))}

          </div>
        ) : (
          <div className="flex flex-col items-center md:px-36">
            <EmojioneShoppingCart alt="basket-image" className="w-fit px-24 mr-3 object-cover rounded-md" />
            <p className="font-bold text-lg">Your cart is empty</p>
            <button onClick={() => navigate('/')} className="text-red-500 border p-2 px-8 mt-2 rounded font-bold">Go to Home</button>
          </div>
        )}
      </div>

      {/* Fixed Bottom Total and Continue Button */}
      <div className="fixed md:px-36 bottom-0 left-0 right-0 p-4 border-t bg-white flex justify-between items-center">
        <h2 className="font-bold text-lg">Total: ₹{cartTotal}</h2>
        <button onClick={handleContinueClick} className={`bg-red-500 text-white px-8 py-3 rounded ${cartTotal === 0 && 'hidden'}`}>
          Continue
        </button>
      </div>

      {/* Address and Login Sliding Sections */}
      <AddressSlidingSection isOpen={isAddressSlideOpen} initiateRazorpayPayment={initiateRazorpayPayment} toggleSlide={() => setIsAddressSlideOpen(false)} />
      <LoginSlidingSection isOpen={isLoginSlideOpen} toggleSlide={() => setIsLoginSlideOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default Cart;
