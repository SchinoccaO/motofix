// ═══════════════════════════════════════════════════════════════════════════
// PÁGINA: Login.tsx - FORMULARIO DE INICIO DE SESIÓN
// ═══════════════════════════════════════════════════════════════════════════
// Permite a usuarios existentes acceder a su cuenta

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  // ===== ESTADOS DEL FORMULARIO =====
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ===== MANEJAR CAMBIOS EN LOS INPUTS =====
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===== ENVIAR FORMULARIO =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // HACER PETICIÓN AL BACKEND
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ LOGIN EXITOSO
        // Guardar el token y datos del usuario
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        alert("¡Bienvenido de nuevo, " + data.usuario.nombre + "!");

        // Redirigir a talleres
        navigate("/talleres");
      } else {
        // ❌ ERROR DEL SERVIDOR
        setError(data.error || "Credenciales inválidas");
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
          <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
          <p className="mt-2 text-sm text-gray-600">
            Accede a tu cuenta de MotoYA
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Tu contraseña"
            />
          </div>

          {/* Link: ¿Olvidaste tu contraseña? */}
          <div className="text-right">
            <a
              href="#"
              className="text-sm text-yellow-600 hover:text-yellow-700"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* ===== LINK A REGISTRO ===== */}
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-yellow-600 hover:text-yellow-700 font-medium"
          >
            Regístrate gratis
          </Link>
        </p>

        {/* ===== DATOS DE PRUEBA ===== */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs font-semibold text-blue-800 mb-2">
            🧪 Datos de prueba (si existen en tu BD):
          </p>
          <p className="text-xs text-blue-700">
            Email: ana@gmail.com
            <br />
            Contraseña: 123456
          </p>
        </div>
      </div>
    </div>
  );
}
