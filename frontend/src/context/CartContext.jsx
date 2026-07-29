import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size = "M", quantity = 1) => {
    const newItem = {
      id: product.id,
      name: product.name,
      image: product.images?.[0],
      price: product.prices?.[size],
      size,
      qty: Number(quantity)
    };

    const existingIndex = cart.findIndex(
      item => item.id === product.id && item.size === size
    );

    if (existingIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].qty += Number(quantity);
      setCart(updatedCart);
    } else {
      setCart([...cart, newItem]);
    }
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const increaseQty = (index) => {
    const newCart = [...cart];
    newCart[index].qty += 1;
    setCart(newCart);
  };

  const decreaseQty = (index) => {
    const newCart = [...cart];
    if (newCart[index].qty > 1) {
      newCart[index].qty -= 1;
    }
    setCart(newCart);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}