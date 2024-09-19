import React, { createContext, useState, useEffect } from 'react';
import productData from '../items.json'; // Import your JSON file with product data

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
    { productId: 1, quantity: 2 }, // Only store product IDs and quantities
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
  const [user, setUser] = useState(dummyUser);
  const [cartProducts, setCartProducts] = useState([]);

  // Add an item to the cart or increase quantity
  const addItemToCart = (productId) => {
    const updatedCart = user.cart.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    // If product not found in cart, add it with quantity 1
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
      .filter((item) => item.quantity > 0); // Remove items with quantity 0

    setUser({ ...user, cart: updatedCart });
  };

  // Simulate login with dummy data
  const login = () => {
    setUser(dummyUser);
  };

  // Simulate logout
  const logout = () => {
    setUser(null);
    setCartProducts([]);
  };

  // Simulate user authentication (dummy)
  const checkAuth = () => {
    return user !== null;
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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      fetchCartProducts(); // Fetch cart products when user logs in or updates
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{ user, login, logout, checkAuth, cartProducts, addItemToCart, decreaseItemQuantity }}
    >
      {children}
    </UserContext.Provider>
  );
};
