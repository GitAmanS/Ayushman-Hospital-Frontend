import React, { useContext, useEffect } from 'react';
import axios from "axios";
import { UserContext } from './Context/UserContext';

const OrderPage = () => {
  const { orders, setOrders, clearOrders } = useContext(UserContext);

  useEffect(() => {
    // Fetch orders from the backend
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          withCredentials: true, // Send cookies along with the request
        });
        const data = response.data.orders;
        console.log("orders:", data);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [setOrders]);

  const getStepStatus = (status) => {
    switch (status) {
      case 'pending':
        return 0; // 0% progress
      case 'scheduled':
        return 1; // Step 1 completed
      case 'processed':
        return 2; // Step 2 completed
      case 'completed':
        return 3; // Step 3 completed
      default:
        return -1; // Default to -1 if status is unknown
    }
  };

  return (
    <div className="container mx-auto p-4 md:mt-24">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      <button onClick={clearOrders} className="mb-4 p-2 bg-red-500 text-white rounded">Clear Orders</button>
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="border rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
              <p className="text-gray-600">Date: {new Date(order.date).toLocaleDateString()}</p>
              <div className="mt-4">
                {order.products.map((product) => (
                  <div key={product._id} className="border rounded-lg p-3 mb-2 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{product.title}</h3>
                        <p>Quantity: {product.quantity}</p>
                      </div>
                      <div className="font-bold">₹{product.price * product.quantity}</div>
                    </div>
                    <div className="mt-2">
                      <p className="font-medium">Status:</p>
                      <div className="flex items-center text-xs">
                        {['pending', 'scheduled', 'processed', 'completed'].map((step, index) => (
                          <React.Fragment key={index}>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center 
                              ${getStepStatus(product.productStatus) >= index ? 'bg-black' : 'bg-gray-300'}`}>
                              {getStepStatus(product.productStatus) > index ? (
                                <span className="text-white font-bold">✓</span>
                              ) : (
                                <span className="text-white">{index + 1}</span>
                              )}
                            </div>
                            {index < 3 && (
                              <div className={`flex-1 h-1 ${getStepStatus(product.productStatus) > index ? 'bg-black' : 'bg-gray-300'}`}></div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <p className={`text-sm mt-2 ${product.productStatus === 'pending' ? 'text-yellow-600' :
                          product.productStatus === 'scheduled' ? 'text-blue-600' :
                          product.productStatus === 'processed' ? 'text-orange-600' :
                          'text-green-600'}`}>
                        {product.productStatus.charAt(0).toUpperCase() + product.productStatus.slice(1)}
                      </p>

                      {/* Show scheduled date if status is scheduled */}
                      {product.productStatus === 'scheduled' && product.scheduledDate && (
                        <p className="text-sm text-blue-600 mt-2">
                          Scheduled Date: {new Date(product.scheduledDate).toLocaleDateString()}
                        </p>
                      )}

                      {/* Show download link if status is completed */}
                      {product.productStatus === 'completed' && product.downloadLink && (
                        <a href={product.downloadLink} className="text-sm text-green-500 mt-2 underline" target="_blank" rel="noopener noreferrer">
                          Download Result
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">No orders found.</div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
