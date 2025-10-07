import { useState } from "react"
import { useCart } from "../context/CartContext"

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    isCartOpen,
    closeCart,
    confirmPurchase,
  } = useCart()

  const [isReadyToConfirm, setIsReadyToConfirm] = useState(false)

  const subtotal = getCartTotal()
  const shipping = cartItems.length > 0 ? (subtotal >= 12000 ? 0 : 2500) : 0
  const total = subtotal + shipping

  const handlePurchaseClick = () => {
    if (isReadyToConfirm) {
      confirmPurchase()
      setIsReadyToConfirm(false)
    } else {
      setIsReadyToConfirm(true)
    }
  }

  const handleContinueShopping = () => {
    closeCart()
    setIsReadyToConfirm(false)
  }

  if (!isCartOpen) return null

  return (
    <>
      <div className="cart-overlay" onClick={handleContinueShopping}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>Carrito de Compras</h2>
          <button className="cart-close" onClick={handleContinueShopping}>✕</button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <img src={item.img || "/placeholder.svg"} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p className="cart-item-price">${item.price.toLocaleString("es-AR")}</p>
                      <div className="cart-item-quantity">
                        <button onClick={() => updateQuantity(item.name, Math.max(1, item.quantity - 1))} className="quantity-btn">-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.name, item.quantity + 1)} className="quantity-btn">+</button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.name)} className="cart-item-remove">✕</button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span>Subtotal:</span>
                  <span>${subtotal.toLocaleString("es-AR")}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Envío:</span>
                  <span>{shipping === 0 ? "Gratis" : `$${shipping.toLocaleString("es-AR")}`}</span>
                </div>
                <div className="cart-summary-row cart-total">
                  <span>Total:</span>
                  <span>${total.toLocaleString("es-AR")}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="cart-footer">
          <button className="cart-btn-secondary" onClick={handleContinueShopping}>Seguir comprando</button>
          {cartItems.length > 0 && (
            <button className="cart-btn-primary" onClick={handlePurchaseClick}>
              {isReadyToConfirm ? "Confirmar compra" : "Realizar compra"}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
