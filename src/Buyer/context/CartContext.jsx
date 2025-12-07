// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("agrilink_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("agrilink_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.productId === product.productId);
      if (exists) {
        return prev.map((i) =>
          i.productId === product.productId
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      // EXCLUDE IMAGE
      const { image, ...cartProduct } = product;
      return [...prev, { ...cartProduct, quantity: qty }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) return removeFromCart(productId);
    setCartItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => {
    const basePrice = cartItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const tax = basePrice * 0.15;
    const deliveryFee = basePrice * 0.1;
    const totalPrice = basePrice + tax + deliveryFee;
    const itemCount = cartItems.reduce((c, i) => c + i.quantity, 0);

    return { basePrice, tax, deliveryFee, totalPrice, itemCount };
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
