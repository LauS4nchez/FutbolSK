import { useCart } from "../components/CartContext";
import React from "react";

export default function OrderConfirmation() {
  const { showConfirmation, closeConfirmation } = useCart()

  if (!showConfirmation) return null

  return (
    <div className="confirmation-overlay">
      <div className="confirmation-modal">
        <div className="confirmation-content">
          <div className="confirmation-icon">✓</div>
          <h1>Gracias por comprar en Futbol SK</h1>
          <button className="confirmation-btn" onClick={closeConfirmation}>
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  )
}
