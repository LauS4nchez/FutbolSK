import { useParams, useNavigate } from "react-router-dom"; // ✅ importamos useNavigate
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../lib/supaBaseClient";
import styles from "../styles/ProductDetail.module.css";
import { useCart } from "../components/CartContext";

// 🌀 Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate(); // ✅ hook de navegación
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [talleSeleccionado, setTalleSeleccionado] = useState(null);
  const [errorMensaje, setErrorMensaje] = useState("");
  const { addToCart } = useCart();

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

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (!talleSeleccionado) {
      setErrorMensaje("Por favor selecciona un talle antes de agregar al carrito.");
      return;
    }

    setErrorMensaje("");

    const item = {
      name: producto.nombre,
      price: Number(producto.precio),
      img: producto.imagen_frente || producto.imagen_dorso,
      link: `/producto/${producto.slug}`,
      quantity: Number(cantidad),
      talle: talleSeleccionado,
    };

    addToCart(item);
  };

  const handleVolver = () => {
    navigate("/"); // ✅ vuelve a la página principal
  };

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
                  onClick={() => {
                    setTalleSeleccionado(t);
                    setErrorMensaje("");
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            {errorMensaje && <p className={styles.errorText}>{errorMensaje}</p>}
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
            <button className={styles.addButton} onClick={handleAddToCart}>
              Añadir al carrito
            </button>
            <button
              className={styles.volverButton} // ✅ nuevo botón
              onClick={handleVolver}
            >
              Volver
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
