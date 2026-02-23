import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginUser, googleLogin } from "../services/api";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

export default function Login() {
  const [formData, setFormData] = useState({
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
      const msg = err?.response?.data?.error || "Error al iniciar sesión con Google.";
      setError(msg);
      console.error("Google login error:", err);
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
      await loginUser(formData.email, formData.password);
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
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark flex flex-col">
      {/* Navbar simple: Logo + Volver */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-elevated-dark bg-white dark:bg-background-dark">
        <div className="px-4 md:px-8 lg:px-12 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span className="text-xl font-bold text-gray-900 dark:text-white">MotoFIX</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Volver
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-card-dark rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Iniciar Sesión</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Ingresá a tu cuenta de MotoFIX
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-input-border-dark rounded-lg bg-white dark:bg-elevated-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-input-border-dark rounded-lg bg-white dark:bg-elevated-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Tu contraseña"
            />
          </div>

          <div className="text-right">
            <a
              href="#"
              className="text-sm text-yellow-600 hover:text-yellow-700 dark:text-yellow-500 dark:hover:text-yellow-400"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-input-border-dark" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-card-dark text-gray-500 dark:text-gray-400">O continuá con</span>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            {googleLoading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Conectando con Google...</p>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Error al conectar con Google.")}
                text="signin_with"
                shape="rectangular"
                size="large"
                width={350}
              />
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-500 dark:hover:text-yellow-400 font-medium"
          >
            Regístrate gratis
          </Link>
        </p>

      </div>
      </div>

      <Footer />
    </div>
  );
}
