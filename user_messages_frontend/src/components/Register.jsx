import { useState } from "react";
import { useToast } from "../services/getExportToastManager";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("register/", {
        username,
        email,
        password,
      });
      showToast("Usuario registrado", "success");

      // Limpiar los campos
      setUsername("");
      setEmail("");
      setPassword("");

      // Redirigir al usuario a la página de inicio de sesión
      // TODO : Cambiar la ruta a la página de inicio de sesión y añadir icono de espera
      setTimeout(() => {
        navigate("/"); // Redirigir a la página de login (/)
      }, 1000); // Esperar 1 segundo antes de redirigir
    } catch (err) {
      console.error(err);
      const detail =
        err.response?.data?.detail || "Error al registrar el usuario";
      showToast(detail, "danger");
    }
  };
  return (
    <div className="container mt-4">
      <h2>Registro</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Register;
// src/components/Register.jsx