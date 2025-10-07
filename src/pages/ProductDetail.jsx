// src/pages/ProductDetail.jsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabaseClient";
import styles from "../styles/ProductDetail.module.css";

// 🌀 Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function ProductDetail() {
  const { slug } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [talleSeleccionado, setTalleSeleccionado] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error al cargar producto:", error);
      } else {
        setProducto(data);
      }
    };

    fetchProducto();
  }, [slug]);

  if (!producto) return <p className={styles.loading}>Cargando producto...</p>;

  const talles = ["S", "M", "L", "XL"];

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.productSection}>
        <div className={styles.imageContainer}>
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={1}
            className={styles.swiper}
          >
            {producto.imagen_frente && (
              <SwiperSlide>
                <img
                  src={producto.imagen_frente}
                  alt="Frente"
                  className={styles.productImage}
                />
              </SwiperSlide>
            )}
            {producto.imagen_dorso && (
              <SwiperSlide>
                <img
                  src={producto.imagen_dorso}
                  alt="Dorso"
                  className={styles.productImage}
                />
              </SwiperSlide>
            )}
          </Swiper>
        </div>

        <div className={styles.infoContainer}>
          <h2>{producto.nombre}</h2>
          <p className={styles.price}>${Number(producto.precio).toFixed(2)}</p>

          <div className={styles.talles}>
            <p>Talles</p>
            <div className={styles.talleButtons}>
              {talles.map((t) => (
                <button
                  key={t}
                  className={`${styles.talleButton} ${
                    talleSeleccionado === t ? styles.active : ""
                  }`}
                  onClick={() => setTalleSeleccionado(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.cantidad}>
            <p>Cantidad</p>
            <input
              type="number"
              value={cantidad}
              min="1"
              max={producto.stock}
              onChange={(e) => setCantidad(e.target.value)}
              className={styles.inputCantidad}
            />
          </div>

          <div className={styles.buttons}>
            <button className={styles.addButton}>Añadir al carrito</button>
            <button className={styles.buyButton}>Comprar</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
