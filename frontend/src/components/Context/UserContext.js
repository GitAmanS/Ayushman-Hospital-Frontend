import React, { createContext, useState, useEffect } from 'react';
import productData from '../items.json'; // Import your JSON file with product data
import { useNavigate } from 'react-router-dom';

// Create the context
export const UserContext = createContext();

// Dummy data for testing
const dummyUser = {
  id: 1,
  name: 'John Doe',
  profilePic: 'https://via.placeholder.com/150',
  email: 'john.doe@example.com',
  address: '123 Main St, Cityville',
  cart: [
    { productId: 1, quantity: 2 },
    { productId: 3, quantity: 1 },
  ],
  orders: [
    { id: 201, name: 'Order 1', date: '2023-09-10', total: 200 },
    { id: 202, name: 'Order 2', date: '2023-09-15', total: 300 },
  ],
  addresses: [
    { id: 301, address: '123 Main St, Cityville' },
    { id: 302, address: '456 Oak St, Townville' },
  ],
  consultations: [
    { id: 401, doctor: 'Dr. Smith', date: '2023-09-20', status: 'completed' },
    { id: 402, doctor: 'Dr. Adams', date: '2023-09-25', status: 'upcoming' },
  ],
  tests: [
    { id: 501, test: 'Blood Test', date: '2023-09-22', result: 'Normal' },
    { id: 502, test: 'X-ray', date: '2023-09-27', result: 'Pending' },
  ],
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [isOtpVerified, setIsOtpVerified] = useState(false); // To track OTP verification
  const [isNewUser, setIsNewUser] = useState(false); // To track if user is new
  const navigate = useNavigate();

  // Effect to retrieve user from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Effect to store user in local storage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  // Add an item to the cart or increase quantity
  const addItemToCart = (productId) => {
    const updatedCart = user.cart.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    const isProductInCart = user.cart.some((item) => item.productId === productId);
    if (!isProductInCart) {
      updatedCart.push({ productId, quantity: 1 });
    }

    setUser({ ...user, cart: updatedCart });
  };

  // Decrease item quantity or remove if quantity is 0
  const decreaseItemQuantity = (productId) => {
    const updatedCart = user.cart
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    setUser({ ...user, cart: updatedCart });
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

  // Fetch products in the cart
  const fetchCartProducts = () => {
    if (user?.cart) {
      const productsInCart = user.cart.map((cartItem) => {
        const product = productData.categories
          .flatMap((category) => category.products)
          .find((product) => product.product_id === cartItem.productId);
        return { ...product, quantity: cartItem.quantity };
      });
      setCartProducts(productsInCart);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCartProducts(); // Fetch cart products when user logs in or updates
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{ isNewUser, setIsNewUser, user, isOtpVerified, requestOtp, verifyOtp, submitEmailF, logout, cartProducts, addItemToCart, decreaseItemQuantity }}
    >
      {children}
    </UserContext.Provider>
  );
};
