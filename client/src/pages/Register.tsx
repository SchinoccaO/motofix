// ═══════════════════════════════════════════════════════════════════════════
// PÁGINA: Register.tsx - FORMULARIO DE REGISTRO DE USUARIOS
// ═══════════════════════════════════════════════════════════════════════════
// Permite crear una cuenta nueva en la aplicación

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  // ===== ESTADOS DEL FORMULARIO =====
  // useState guarda datos que pueden cambiar
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "cliente", // Por defecto es cliente
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Para redirigir después del registro

  // ===== MANEJAR CAMBIOS EN LOS INPUTS =====
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===== ENVIAR FORMULARIO =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    setError("");
    setLoading(true);

    try {
      // HACER PETICIÓN AL BACKEND
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ REGISTRO EXITOSO
        // Guardar el token en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        alert("¡Registro exitoso! Bienvenido " + data.usuario.nombre);

        // Redirigir según el rol
        if (data.usuario.rol === "mecanico") {
          navigate("/registro-taller");
        } else {
          navigate("/talleres");
        }
      } else {
        // ❌ ERROR DEL SERVIDOR
        setError(data.error || "Error al registrarse");
      }
    } catch (err) {
      // ❌ ERROR DE CONEXIÓN
      setError("Error de conexión. Verifica que el backend esté corriendo.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* ===== TÍTULO ===== */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Únete a la comunidad motera
          </p>
        </div>

        {/* ===== MENSAJE DE ERROR ===== */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* ===== FORMULARIO ===== */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo: Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Juan Pérez"
            />
          </div>

          {/* Campo: Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>

          {/* Campo: Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {/* Campo: Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Usuario
            </label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="cliente">Cliente (Busco talleres)</option>
              <option value="mecanico">Mecánico (Tengo un taller)</option>
            </select>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Registrando..." : "Crear Cuenta"}
          </button>
        </form>

        {/* ===== LINK A LOGIN ===== */}
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-yellow-600 hover:text-yellow-700 font-medium"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
