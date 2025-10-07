"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false) // <- para saber si ya cargó localStorage

  // Cargar carrito desde localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cartItems")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) setCartItems(parsed)
        } catch (err) {
          console.error("Error cargando carrito:", err)
        }
      }
      setIsHydrated(true) // marca que ya se cargó
    }
  }, [])

  // Guardar carrito cuando cambie y ya está hidratado
  useEffect(() => {
    if (isHydrated && typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(cartItems))
    }
  }, [cartItems, isHydrated])

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.name === product.name)
      if (existing) {
        return prev.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      const priceNumber =
        typeof product.price === "string"
          ? Number(product.price.replace(/\D/g, ""))
          : Number(product.price)

      return [...prev, { ...product, price: priceNumber, quantity: 1 }]
    })
  }

  const removeFromCart = (productName) => {
    setCartItems((prev) => prev.filter((item) => item.name !== productName))
  }

  const updateQuantity = (productName, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productName)
      return
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.name === productName ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    if (typeof window !== "undefined") localStorage.removeItem("cartItems")
  }

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0)

  const getCartCount = () =>
    cartItems.reduce((count, item) => count + item.quantity, 0)

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  const confirmPurchase = () => {
    setShowConfirmation(true)
    setIsCartOpen(false)
    clearCart()
  }

  const closeConfirmation = () => setShowConfirmation(false)

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
  )
}
