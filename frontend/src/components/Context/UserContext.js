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
  const [cartTotal, setCartTotal] =useState(0);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState();
  const [addresses, setAddresses] = useState([]);
  const [localCart, setLocalCart] = useState(() => {
    // Retrieve initial localCart from localStorage
    const storedCart = localStorage.getItem('localCart');
    return storedCart ? JSON.parse(storedCart) : [];
  });


  const fetchCart = async()=>{
    try {
    
      const response = await axios.get('/api/cart', {
        withCredentials: true, // Send cookies along with the request
      });
      console.log("cart recieved:",response.data.cart)
      setCartProducts(response.data.cart)
      setCartTotal(response.data.cartTotal)
  
    } catch (error) {
      console.error('Error recieving cart:', error);
    }
  }
  // Store localCart and cartTotal in localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('localCart', JSON.stringify(localCart));
    localStorage.setItem('cartTotal', JSON.stringify(cartTotal));
  }, [localCart, cartTotal]);



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


  useEffect(() => {


    fetchOrders();
  }, [setOrders]);

  

  // Effect to retrieve user from local storage on mount
  useEffect(() => {

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchCart()
    }else{
      if (localCart && localCart.length > 0) {
        let total = localCart.reduce((total, item) => total + (item.price * item.quantity), 0);
        setCartTotal(total);  // Assuming you're setting the total in `cartTotal`
        console.log("Cart total:", total);
      } else {
        setCartTotal(0);  // If no items are in the cart, set total to 0
      }
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

  const addItemToCart = async (productId) => {
    if (user) {
      try {
        const response = await axios.post(
          '/api/cart/add',
          { productId, quantity: 1 },
          { withCredentials: true }
        );
        setCartProducts(response.data.cart);
        setCartTotal(response.data.cartTotal);
      } catch (error) {
        console.error('Error adding item to cart:', error);
      }
    } else {
      try {
        const product = await axios.get(`/api/products/${productId}`);
        setLocalCart((prevCart) => {
          const existingProductIndex = prevCart.findIndex(item => item.productId === productId);
          let updatedCart;
          if (existingProductIndex !== -1) {
            updatedCart = prevCart.map((item, index) =>
              index === existingProductIndex
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            updatedCart = [...prevCart, { ...product.data, productId: product.data._id, quantity: 1 }];
          }
          const updatedTotal = updatedCart.reduce((total, item) => total + (item.price * item.quantity), 0);
          setCartTotal(updatedTotal);
          return updatedCart;
        });
      } catch (err) {
        console.error('Error adding item to local cart:', err);
      }
    }
  };

  const decreaseItemQuantity = async (productId) => {
    if (user) {
      try {
        const response = await axios.post(
          '/api/cart/remove',
          { productId, quantity: 1 },
          { withCredentials: true }
        );
        setCartProducts(response.data.cart);
        setCartTotal(response.data.cartTotal);
      } catch (error) {
        console.error('Error decreasing item quantity in cart:', error);
      }
    } else {
      setLocalCart((prevCart) => {
        const existingProductIndex = prevCart.findIndex(item => item.productId === productId);
        if (existingProductIndex !== -1) {
          const existingProduct = prevCart[existingProductIndex];
          let updatedCart;
          if (existingProduct.quantity > 1) {
            updatedCart = prevCart.map((item, index) =>
              index === existingProductIndex
                ? { ...item, quantity: item.quantity - 1 }
                : item
            );
          } else {
            updatedCart = prevCart.filter((item) => item.productId !== productId);
          }
          const updatedTotal = updatedCart.reduce((total, item) => total + (item.price * item.quantity), 0);
          setCartTotal(updatedTotal);
          return updatedCart;
        }
        return prevCart;
      });
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        const response = await axios.post('/api/cart/clear', {}, { withCredentials: true });
        setCartProducts(response.data.cart);
        setCartTotal(response.data.cartTotal);
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else {
      setLocalCart([]);
      setCartTotal(0);
    }
  };



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
      const response = await axios.post('http://localhost:5000/api/auth/submit-email', {email:email}, { withCredentials: true });

      
        
        setUser(response.data.user);
        console.log("user",response.data.user)
      
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

      console.log("user", data.user);
      setCartProducts(data.user.cart); // Set the user's cart after login
      setIsNewUser(data.isNewUser);
      setIsOtpVerified(true);

      // Now handle merging local cart with user cart
      if (localCart && localCart.length > 0) {
        console.log('Merging local cart with user cart...');
        for (let item of localCart) {
          // Call your add to cart API for each item in the local cart
          await axios.post('/api/cart/add', { productId: item.productId, quantity: item.quantity }, { withCredentials: true });
        }
        // Clear local cart after transferring to the server-side cart
        setLocalCart([]);
        localStorage.removeItem('localCart'); // Optional: Also remove from localStorage
        fetchCart();
      }
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
    setUser(null);
    setCartProducts([]);
    localStorage.removeItem('user');
    localStorage.removeItem('localCart');
    localStorage.removeItem('cartTotal');
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/profile");
  };


  return (
    <UserContext.Provider
      value={{addresses,fetchCart,localCart,fetchOrders,  setAddresses, selectedAddress, setSelectedAddress,  isNewUser,orders, clearOrders ,setOrders, cartTotal,categories,clearCart, setIsNewUser, user, setIsOtpVerified, isOtpVerified, requestOtp, verifyOtp, submitEmailF, logout, cartProducts, addItemToCart, decreaseItemQuantity }}
    >
      {children}
    </UserContext.Provider>
  );
};
