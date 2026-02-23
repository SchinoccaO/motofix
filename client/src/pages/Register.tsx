import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { registerUser, googleLogin } from "../services/api";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError("");
    setGoogleLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      navigate("/talleres");
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Error al registrarse con Google.";
      setError(msg);
      console.error("Google register error:", err);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(formData.name, formData.email, formData.password);
      navigate("/talleres");
    } catch (err: any) {
      const msg = err?.response?.data?.error
        || (err?.code === 'ERR_NETWORK' ? "Error de red. Verificá tu conexión o que el backend permita tu dominio (CORS)." : "Error de conexión. Verifica que el backend esté corriendo.");
      setError(msg);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar simple: Logo + Volver */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
        <div className="px-4 md:px-8 lg:px-12 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span className="text-xl font-bold text-gray-900">MotoFIX</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Volver
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Únete a la comunidad motera
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Juan Pérez"
            />
          </div>

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
              minLength={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Min 8 caracteres, mayúscula, minúscula y número"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Registrando..." : "Crear Cuenta"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O registrate con</span>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            {googleLoading ? (
              <p className="text-sm text-gray-500">Conectando con Google...</p>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Error al conectar con Google.")}
                text="signup_with"
                shape="rectangular"
                size="large"
                width={350}
              />
            )}
          </div>
        </div>

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

      <Footer />
    </div>
  );
}
