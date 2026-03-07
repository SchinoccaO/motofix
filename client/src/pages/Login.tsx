import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginUser, googleLogin } from "../services/api";
import Logo from "../components/Logo";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/talleres";

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError("");
    setGoogleLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Error al iniciar sesión con Google.";
      setError(msg);
      console.error("Google login error:", err);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginUser(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        (err?.code === "ERR_NETWORK"
          ? "Error de red. Verificá tu conexión o que el backend permita tu dominio (CORS)."
          : "Error de conexión. Verificá que el backend esté corriendo.");
      setError(msg);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-elevated-dark bg-white dark:bg-[#0F1621] shrink-0">
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

      {/* ── Contenido: split en desktop ── */}
      <div className="flex-1 flex flex-col lg:flex-row">

        {/* Panel izquierdo — solo desktop */}
        <div className="hidden lg:flex flex-col justify-between bg-[#0F1621] border-r border-white/[0.06] p-12 lg:w-[42%] xl:w-[38%]">
          <div className="flex flex-col gap-5">
            <h2 className="font-black text-[68px] xl:text-[82px] leading-[0.9] text-white tracking-tight">
              De vuelta<br />a<br /><span className="text-primary">rodar.</span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed max-w-[300px]">
              Encontrá el taller que necesitás, comparé reseñas reales y resolvé tu moto hoy.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            +1000 moteros confían en MotoFIX
          </div>
        </div>

        {/* Panel derecho — formulario */}
        <div className="flex-1 flex items-center justify-center py-12 px-4 bg-[#f8f7f6] dark:bg-background-dark">
          <div className="max-w-md w-full">

            {/* Logo visible solo en mobile */}
            <div className="flex items-center gap-2 justify-center mb-6 lg:hidden">
              <Logo size={28} />
              <span className="font-bold text-xl">MotoFIX</span>
            </div>

            <div className="mb-7">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Iniciá sesión</h2>
              <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
                Ingresá a tu cuenta para continuar
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-input-border-dark rounded-lg bg-white dark:bg-elevated-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-input-border-dark rounded-lg bg-white dark:bg-elevated-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Tu contraseña"
                />
              </div>

              <div className="text-right">
                <Link
                  to="/olvide-contrasena"
                  className="text-sm text-primary hover:text-primary-hover"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-[#181611] font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-input-border-dark" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#f8f7f6] dark:bg-background-dark text-gray-500 dark:text-gray-400">
                    O continuá con
                  </span>
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
              ¿No tenés cuenta?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-primary-hover font-medium"
              >
                Registrate gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
