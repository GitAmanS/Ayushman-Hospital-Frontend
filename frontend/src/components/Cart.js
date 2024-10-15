import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './Context/UserContext'; // Assume the cart data is stored in UserContext
import { IoMdArrowRoundBack } from "react-icons/io";
import { EmojioneShoppingCart } from './icons/EmojioneShoppingCart';
import BackButton from './buttons/BackButton'
import AddressSlidingSection from './slidingSections/AddressSlidingSection';
const Cart = () => {
  const { cartProducts,user,clearCart,addresses, fetchCart,setAddresses, cartTotal,selectedAddress, setSelectedAddress, addItemToCart,decreaseItemQuantity } = useContext(UserContext); // Access cart data from UserContext
  
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const [isSlidingOpen, setIsSlidingOpen] = useState(false);
  // Toggle the sliding section
  const toggleSlide = () => {
    setIsSlidingOpen(!isSlidingOpen);
  };

  const initiateRazorpayPayment = async () => {
    const response = await fetch('/api/start-payment', { method: 'POST' });
    const data = await response.json();
    
    const options = {
        key: data.razorpaykeyId,  
        amount: data.amount * 100,  
        currency: data.currency,
        name: 'Ayushman Hospital',
        description: "Products purchased: "+cartProducts,
        order_id: data.razorpayOrderId,
        handler: async function (response) {
            const paymentData = {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                addressId: selectedAddress._id
            };
            
            // Verify payment success and create order in the backend
            const verifyResponse = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData),
            });

            const result = await verifyResponse.json();

            fetchCart()

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
    <div className='open-sans flex flex-col min-h-screen '>
        <div className='flex flex-row items-center p-4 border-b md:px-36 gap-4'>
        <button onClick={()=>{navigate("/")}} className='bg-gray-100 p-3 rounded-full'>
        <IoMdArrowRoundBack />
      </button>
            <h1 className='font-bold'>Cart</h1>
        </div>
        <div className='p-4 flex flex-col justify-end  md:px-36'>

            {/* Check if cart has items */}
            {cartProducts && cartProducts.length > 0? (
                
                <div>
                                <div>
                <h1 className='font-bold pb-2'>Tests added</h1>
            </div>
            <button onClick={()=>{clearCart()}}>Clear Cart</button>
                {cartProducts.map((item) => (
                
                    <div key={item.productId} className='flex flex-row py-2'>
                        
                    <img src={item.image} className='h-10 w-10 object-cover rounded-lg'/>
                    <div className='flex px-2 flex-col gap-1 justify-start'>
                    <h3 className='font-bold text-sm'>{item.title}</h3>
                    <p className='text-xs text-gray-500'>
                        {item.desc}
                    </p>
                    <p className='text-base'> ₹{item.price*item.quantity}</p>
                    {/* <p>Quantity: {item.quantity}</p> */}
                    </div>
                    <div className='flex flex-col items-center ml-auto'>
                    <div className="flex flex-row border ml-auto h-fit text-red-400 font-bold  rounded">
                        <button onClick={()=>{decreaseItemQuantity(item.productId)}} className='px-3 py-1 hover:bg-gray-200'>-</button>
                        <span className='px-3 py-1'>{item.quantity}</span>
                        <button onClick={()=>addItemToCart(item.productId)} className='px-3 py-1 hover:bg-gray-200'>+</button>
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
                <div className='flex flex-col items-center md:px-36 '>
                    <EmojioneShoppingCart alt="basket-image" className="w-fit px-24 mr-3 object-cover rounded-md" />
                    <p className='font-bold text-lg'>Your cart is empty</p>
                    <button onClick={handleGoHome} className='text-red-500 border p-2 px-8 mt-2 rounded font-bold'>
                        Go to Home
                    </button>
                </div>
            )}
        </div>

            {/* Fixed Bottom Total and Continue Button */}
            <div className="fixed md:px-36 bottom-0 left-0 right-0 p-4 border-t bg-white flex justify-between items-center">
                <h2 className='font-bold text-lg'>Total: ₹{cartTotal}</h2>
                <button 
                    onClick={toggleSlide}
                    className={`bg-red-500 text-white px-8 py-3 rounded ${cartTotal==0 && 'hidden'}` }
                >
                    Continue
                </button>
            </div>

            <AddressSlidingSection isOpen={isSlidingOpen} initiateRazorpayPayment={initiateRazorpayPayment} toggleSlide={toggleSlide} />
      
    </div>
  );
};

export default Cart;
