import React, { createContext, useState, useEffect } from 'react';
import productData from '../items.json'; // Import your JSON file with product data
import { useNavigate } from 'react-router-dom';
import axios from "axios";
// Create the context
export const UserContext = createContext();

// Dummy data for testing
// const dummyUser = {
//   id: 1,
//   name: 'John Doe',
//   profilePic: 'https://via.placeholder.com/150',
//   email: 'john.doe@example.com',
//   address: '123 Main St, Cityville',
//   cart: [
//     { productId: 1, quantity: 2 },
//     { productId: 3, quantity: 1 },
//   ],
//   orders: [
//     { id: 201, name: 'Order 1', date: '2023-09-10', total: 200 },
//     { id: 202, name: 'Order 2', date: '2023-09-15', total: 300 },
//   ],
//   addresses: [
//     { id: 301, address: '123 Main St, Cityville' },
//     { id: 302, address: '456 Oak St, Townville' },
//   ],
//   consultations: [
//     { id: 401, doctor: 'Dr. Smith', date: '2023-09-20', status: 'completed' },
//     { id: 402, doctor: 'Dr. Adams', date: '2023-09-25', status: 'upcoming' },
//   ],
//   tests: [
//     { id: 501, test: 'Blood Test', date: '2023-09-22', result: 'Normal' },
//     { id: 502, test: 'X-ray', date: '2023-09-27', result: 'Pending' },
//   ],
// };

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [mostBookedProductIds, setMostBookedProductIds] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [isOtpVerified, setIsOtpVerified] = useState(false); // To track OTP verification
  const [isNewUser, setIsNewUser] = useState(false); // To track if user is new
  const [categories, setCategories] = useState([]);
  const [cartTotal, setCartTotal] =useState(null);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState();
  const [addresses, setAddresses] = useState([]);


  const fetchCart = async()=>{
    try {
    
      const response = await axios.get('http://localhost:5000/api/cart', {
        withCredentials: true, // Send cookies along with the request
      });
      console.log("cart recieved:",response.data.cart)
      setCartProducts(response.data.cart)
      setCartTotal(response.data.cartTotal)
  
    } catch (error) {
      console.error('Error recieving cart:', error);
    }
  }



  useEffect(() => {
    // Fetch orders from the backend
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders', {
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

  

  // Effect to retrieve user from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchCart()
    }
  }, []);

  // Effect to store user in local storage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);


  
  useEffect(() => {
    const fetchAddresses = async () => {
        try {
            const response = await axios.get('/api/address');
            await setAddresses(response.data.addresses || []);
            console.log(response.data.addresses)
        } catch (err) {
            console.error('Error fetching addresses:', err);
        }
    };
    fetchAddresses();
}, []);
  const clearOrders = async()=>{
    try{
      const response = await axios.delete('/api/clearorders', 
        {},
        { withCredentials: true })

        setOrders(response.data.orders);
    }catch(err){
      console.log("error clearing order", err)
    }
  }


  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data.categories); // Assuming the API returns an array of categories
      console.log("categories", data.categories)
    } catch (error) {
      console.error('An error occurred while fetching categories:', error);
    }
  };




  

  // Call fetchCategories when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

// Add item to cart function
const addItemToCart = async (productId) => {
  // Check if the product is already in the user's cart
  // const isProductInCart = user.cart.some((item) => item.productId === productId);
  
  // let updatedCart;
  
  // if (isProductInCart) {
  //   // If the product is already in the cart, increase the quantity
  //   updatedCart = user.cart.map((item) =>
  //     item.productId === productId
  //       ? { ...item, quantity: item.quantity + 1 }
  //       : item
  //   );
  // } else {
  //   // If the product is not in the cart, add it with a quantity of 1
  //   updatedCart = [...user.cart, { productId, quantity: 1 }];
  // }

  // // Update the user's cart state
  // setUser({ ...user, cart: updatedCart });

  // Update the cart products to reflect the changes
  

  // Send request to the backend to update the cart in the database
  try {
    
    const response = await axios.post('http://localhost:5000/api/cart/add', 
      { productId, quantity: 1 }, // Data to send
      { withCredentials: true } // Sending cookies
    );

    setCartProducts(response.data.cart)
    setCartTotal(response.data.cartTotal)

  } catch (error) {
    console.error('Error adding item to cart:', error);
  }
};

// Decrease item quantity or remove it from cart if quantity becomes 0
const decreaseItemQuantity = async (productId) => {
  // Check if the product exists in the cart
  const updatedCart = user.cart
  //   .map((item) => 
  //     item.productId === productId 
  //       ? { ...item, quantity: item.quantity - 1 } 
  //       : item
  //   )
  //   .filter((item) => item.quantity > 0); // Filter out items with 0 quantity

  // // Update the user's cart state
  // setUser({ ...user, cart: updatedCart });

  // Update the cart products to reflect the changes
  
  // Send request to the backend to update the cart in the database
  try {
    console.log("product id", productId)
    const response = await axios.post('http://localhost:5000/api/cart/remove', 
      { productId, quantity: 1 }, // Data to send
      { withCredentials: true } // Sending cookies
    );
    setCartProducts(response.data.cart)
    setCartTotal(response.data.cartTotal)


  } catch (error) {
    console.error('Error removing item from cart:', error);
  }
};


const clearCart = async()=>{
  try {
    const response = await axios.post('http://localhost:5000/api/cart/clear', 
      {}, 
      { withCredentials: true } // Sending cookies
    );
    setCartProducts(response.data.cart)
    setCartTotal(response.data.cartTotal)


  } catch (error) {
    console.error('Error removing item from cart:', error);
  }
}

  // OTP login and signup methods
  const requestOtp = async (phoneNumber) => {
    const phone = `91${phoneNumber.toString()}`;
    const response = await fetch('/api/auth/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    console.log(await response.json());
  };

  const submitEmailF = async (email) => {
    try {
      const response = await fetch('/api/auth/submit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        console.log("user",data.user)
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // OTP verification function
  const verifyOtp = async (phoneNumber, otp) => {
    const phone = `91${phoneNumber.toString()}`;

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);

        console.log("user", data.user)
        setCartProducts(data.user.cart)
        setIsNewUser(data.isNewUser);
        setIsOtpVerified(true);
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // Simulate logout
  const logout = () => {
    // Clear state and localStorage
    setUser(null);
    setCartProducts([]);
    localStorage.removeItem('user');
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/profile");
  };


  return (
    <UserContext.Provider
      value={{addresses,fetchCart, setAddresses, selectedAddress, setSelectedAddress,  isNewUser,orders, clearOrders ,setOrders, cartTotal,categories,clearCart, setIsNewUser, user, setIsOtpVerified, isOtpVerified, requestOtp, verifyOtp, submitEmailF, logout, cartProducts, addItemToCart, decreaseItemQuantity }}
    >
      {children}
    </UserContext.Provider>
  );
};
