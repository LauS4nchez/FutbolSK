import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegistering) {
        if (!username || !email || !password) {
          toast.error("Completa todos los campos", { autoClose: 3000 });
          setLoading(false);
          return;
        }

        // ✅ Verificar si el nombre de usuario o email ya existen
        const { data: existingUsers, error: checkError } = await supabase
          .from("usuarios")
          .select("id")
          .or(`email.eq.${email},user.eq.${username}`);

        if (checkError) {
          console.error(checkError);
          toast.error("Error al verificar usuario existente", { autoClose: 3000 });
          setLoading(false);
          return;
        }

        if (existingUsers.length > 0) {
          toast.warning("Esa cuenta ya existe. Inicia sesión", { autoClose: 3000 });
          setLoading(false);
          return;
        }

        // ✅ Insertar nuevo usuario
        const { data, error } = await supabase.from("usuarios").insert([
          {
            user: username,
            email: email,
            password: password,
            role: "cliente",
          },
        ]);

        if (error) {
          console.error(error);
          toast.error("Error al crear la cuenta: " + error.message, {
            autoClose: 3000,
          });
          setLoading(false);
          return;
        }

        toast.success("Cuenta creada correctamente", { autoClose: 2000 });
        setUsername("");
        setEmail("");
        setPassword("");
        setIsRegistering(false);
      } else {
        // Iniciar sesión
        const { data, error } = await supabase
          .from("usuarios")
          .select("*")
          .eq("email", email)
          .eq("password", password)
          .single();

        if (error || !data) {
          toast.error("Usuario o contraseña incorrectos", { autoClose: 3000 });
        } else {
          toast.success("Bienvenido " + data.user, { autoClose: 1000 });
          login(data);
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error inesperado", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (e) => {
    e.preventDefault();
    setIsRegistering(!isRegistering);
    setEmail("");
    setPassword("");
    setUsername("");
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-left">
        <img
          src="https://elcomercio.pe/resizer/A98ct1ylirxLLIoGjGSuuD2o5l4=/4096x2731/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/L37WDBJDKNACHN7JIZBNXHBZGI.jfif"
          alt="Futbol"
        />
      </div>
      <div className="login-right">
        <div className="login-form">
          <div className="login-header">
            <span className="login-brand">Futbol SK</span>
          </div>

          <h2>{isRegistering ? "Bienvenido" : "¡Qué bueno verte de nuevo!"}</h2>

          {isRegistering && (
            <>
              <label>Nombre de usuario</label>
              <input
                type="text"
                placeholder="Ingresa tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </>
          )}

          <label>Correo Electrónico</label>
          <input
            type="text"
            placeholder="Ingresa tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="login-options">
            {!isRegistering && <a href="#">¿Olvidaste tu contraseña?</a>}
          </div>

          <button onClick={handleSubmit} disabled={loading}>
            {loading
              ? isRegistering
                ? "Creando cuenta..."
                : "Iniciando sesión..."
              : isRegistering
              ? "Crear cuenta"
              : "Iniciar sesión"}
          </button>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
             Volver
          </button>

          <p>
            {isRegistering
              ? "¿Ya tenés una cuenta? "
              : "¿No tenés una cuenta? "}
            <a href="#" onClick={toggleMode}>
              {isRegistering ? "Inicia sesión ahora" : "Crea una nueva ahora"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
