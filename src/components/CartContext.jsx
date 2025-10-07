// CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Cargar carrito desde localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cartItems");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setCartItems(parsed);
        } catch (err) {
          console.error("Error cargando carrito:", err);
        }
      }
      setIsHydrated(true);
    }
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    if (isHydrated && typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, isHydrated]);

  // ✅ Agregar producto con cantidad personalizada
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.name === product.name &&
          item.talle === product.talle // diferencia por talle si existe
      );

      const priceNumber =
        typeof product.price === "string"
          ? Number(product.price.replace(/\D/g, "")) || 0
          : Number(product.price);

      if (existing) {
        // Si ya existe, sumamos la cantidad seleccionada
        return prev.map((item) =>
          item.name === product.name && item.talle === product.talle
            ? {
                ...item,
                quantity: item.quantity + (Number(product.quantity) || 1),
              }
            : item
        );
      }

      // Si no existe, lo agregamos con la cantidad elegida
      return [
        ...prev,
        {
          ...product,
          price: priceNumber,
          quantity: Number(product.quantity) || 1,
        },
      ];
    });
  };

  const removeFromCart = (productName, talle) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.name === productName && item.talle === talle)
      )
    );
  };

  const updateQuantity = (productName, talleOrQuantity, maybeQuantity) => {
  let talle = null;
  let newQuantity;

  if (typeof maybeQuantity === "undefined") {
    newQuantity = talleOrQuantity;
  } else {
    talle = talleOrQuantity;
    newQuantity = maybeQuantity;
  }

  if (newQuantity < 1) {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.name === productName && (!talle || item.talle === talle))
      )
    );
    return;
  }

  setCartItems((prev) =>
    prev.map((item) =>
      item.name === productName && (!talle || item.talle === talle)
        ? { ...item, quantity: newQuantity }
        : item
    )
  );
};


  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== "undefined") localStorage.removeItem("cartItems");
  };

  const getCartTotal = () =>
    cartItems.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0
    );

  const getCartCount = () =>
    cartItems.reduce((count, item) => count + item.quantity, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const confirmPurchase = () => {
    setShowConfirmation(true);
    setIsCartOpen(false);
    clearCart();
  };

  const closeConfirmation = () => setShowConfirmation(false);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isCartOpen,
        openCart,
        closeCart,
        showConfirmation,
        confirmPurchase,
        closeConfirmation,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
