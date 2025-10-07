import React from "react";

export default function Footer() {
  return (
    <footer>
      <img src="assets/LogoInvertido.png" alt="Logo Invertido" />
      <table>
        <tr>
          <td>Contacto</td>
          <td>Envios</td>
          <td>Sobre Nosotros</td>
        </tr>
        <tr>
          <td>Provedor</td>
          <td>Camisetas</td>
          <td>Redes Sociales</td>
        </tr>
      </table>
      <div className="copy">
        <p>© Copyright 2024 FutbolSK Inc. All Rights Reserved. All Images, Content and Conceptual Ideas are Exclusive Property of FutbolSK Inc.</p>
      </div>
    </footer>
  );
}