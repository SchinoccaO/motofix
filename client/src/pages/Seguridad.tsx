import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getStoredToken, getStoredUser, changePassword, type AuthUser } from "../services/api";

export default function Seguridad() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Phone form
  const [phone, setPhone] = useState("");

  // State
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      navigate("/login");
      return;
    }
    const u = getStoredUser();
    setUser(u);
    setPhone(u?.phone || "");
  }, []);

  // Password validation
  const hasMinLength = newPassword.length >= 8;
  const hasNumberOrSymbol = /[\d\W]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const canSubmitPassword = currentPassword.length > 0 && hasMinLength && hasNumberOrSymbol && passwordsMatch;

  const handlePasswordSubmit = async () => {
    if (!canSubmitPassword) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await changePassword(currentPassword, newPassword);
      setSuccess(result.mensaje);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Error al cambiar la contraseña";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-[#181611] dark:text-gray-100">
      <Navbar activePage="seguridad" />

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center text-sm text-[#887f63] dark:text-gray-400 mb-2">
                <Link to="/mi-perfil" className="hover:text-primary transition-colors flex items-center">
                  <span className="material-symbols-outlined text-base mr-1">arrow_back</span>
                  Volver a Mi Perfil
                </Link>
                <span className="mx-2">/</span>
                <span className="material-symbols-outlined text-base mr-1">security</span>
                <span>Seguridad de la cuenta</span>
              </div>
              <h2 className="text-3xl font-bold leading-tight text-[#181611] dark:text-white sm:text-4xl">
                Verificacion y Credenciales
              </h2>
              <p className="mt-2 text-sm text-[#887f63] dark:text-gray-400 max-w-2xl">
                Gestiona tu contraseña y metodos de verificacion. Estas acciones son criticas para mantener tu cuenta MotoYA segura.
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                <span className="w-2 h-2 mr-2 bg-green-500 rounded-full inline-block"></span>
                Conexion Segura SSL
              </span>
            </div>
          </div>

          {/* Alerts */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-green-600">check_circle</span>
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500">error</span>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Password Change (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Info Banner */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 dark:bg-blue-900/20 dark:border-blue-500 rounded-r-lg">
                <div className="flex">
                  <span className="material-symbols-outlined text-blue-400 dark:text-blue-300 mr-3 flex-shrink-0">info</span>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Por tu seguridad, te enviaremos un correo de confirmacion cada vez que realices cambios importantes en esta seccion.
                  </p>
                </div>
              </div>

              {/* Password Card */}
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#181611] dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">lock_reset</span>
                    Cambio de Contraseña
                  </h3>
                </div>

                <div className="px-6 py-6 space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-[#5c584a] dark:text-gray-300" htmlFor="current-password">
                      Contraseña actual
                    </label>
                    <div className="mt-1 relative">
                      <input
                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#181611] dark:text-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm pl-3 pr-10 py-2.5"
                        id="current-password"
                        placeholder="Tu contraseña actual"
                        type={showCurrent ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <span className="material-symbols-outlined text-sm">{showCurrent ? "visibility" : "visibility_off"}</span>
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-[#887f63] dark:text-gray-500">Necesaria para verificar tu identidad.</p>
                  </div>

                  <hr className="border-gray-100 dark:border-gray-700" />

                  {/* New Password Group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#5c584a] dark:text-gray-300" htmlFor="new-password">
                        Nueva contraseña
                      </label>
                      <div className="mt-1 relative">
                        <input
                          className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#181611] dark:text-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm pl-3 pr-10 py-2.5"
                          id="new-password"
                          type={showNew ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <span className="material-symbols-outlined text-sm">{showNew ? "visibility" : "visibility_off"}</span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#5c584a] dark:text-gray-300" htmlFor="confirm-password">
                        Confirmar nueva contraseña
                      </label>
                      <div className="mt-1 relative">
                        <input
                          className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#181611] dark:text-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm pl-3 pr-10 py-2.5"
                          id="confirm-password"
                          type={showConfirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <span className="material-symbols-outlined text-sm">{showConfirm ? "visibility" : "visibility_off"}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-[#f8f7f6] dark:bg-gray-900/50 rounded-lg p-4">
                    <h4 className="text-xs font-semibold text-[#887f63] dark:text-gray-400 uppercase tracking-wider mb-3">
                      Requisitos de seguridad
                    </h4>
                    <ul className="space-y-2 text-sm text-[#5c584a] dark:text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-sm ${hasMinLength ? "text-green-500" : "text-gray-400"}`}>
                          {hasMinLength ? "check_circle" : "radio_button_unchecked"}
                        </span>
                        <span>Minimo 8 caracteres</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-sm ${hasNumberOrSymbol ? "text-green-500" : "text-gray-400"}`}>
                          {hasNumberOrSymbol ? "check_circle" : "radio_button_unchecked"}
                        </span>
                        <span>Al menos un numero o un simbolo</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-sm ${passwordsMatch ? "text-green-500" : "text-gray-400"}`}>
                          {passwordsMatch ? "check_circle" : "radio_button_unchecked"}
                        </span>
                        <span>Las contraseñas coinciden</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Password Card Footer */}
                <div className="px-6 py-4 bg-[#f8f7f6] dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handlePasswordCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-[#5c584a] dark:text-gray-200 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handlePasswordSubmit}
                    disabled={!canSubmitPassword || saving}
                    className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-bold text-[#181611] bg-primary hover:bg-[#d6aa28] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#181611]"></div>
                        Actualizando...
                      </>
                    ) : (
                      "Actualizar Contraseña"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Phone Verification (1/3) */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 sticky top-24">
                <div className="h-2 bg-primary w-full"></div>
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-[#181611] dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">phonelink_lock</span>
                    Verificacion de Telefono
                  </h3>
                </div>

                <div className="px-6 py-6 space-y-6">
                  <p className="text-sm text-[#887f63] dark:text-gray-400">
                    Vincula tu numero de telefono para recibir alertas y recuperar tu cuenta si pierdes el acceso.
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-[#5c584a] dark:text-gray-300" htmlFor="phone-verify">
                      Numero de movil
                    </label>
                    <div className="mt-1 flex rounded-lg shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-[#887f63] dark:text-gray-400 text-sm">
                        +54
                      </span>
                      <input
                        className="flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none rounded-r-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#181611] dark:text-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                        id="phone-verify"
                        placeholder="351 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {user?.phone && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-lg p-3 flex gap-3 items-start">
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5">warning</span>
                      <p className="text-xs text-yellow-800 dark:text-yellow-200">
                        El numero terminado en **{user.phone.slice(-2)} no esta verificado.
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-[#181611] bg-primary hover:bg-[#d6aa28] transition-all"
                  >
                    Enviar codigo de verificacion
                  </button>

                  <p className="text-center text-xs text-[#887f63] dark:text-gray-500">
                    Se enviara un SMS con un codigo de 6 digitos. Proximamente disponible.
                  </p>
                </div>
              </div>

              {/* Help Card */}
              <div className="mt-6 bg-[#f8f7f6] dark:bg-gray-800/40 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-[#181611] dark:text-white mb-2">Necesitas ayuda?</h4>
                <p className="text-xs text-[#887f63] dark:text-gray-400 mb-4">
                  Si tenes problemas para recibir el codigo o no reconoces algun cambio, contacta soporte inmediatamente.
                </p>
                <span className="text-xs font-medium text-primary flex items-center gap-1 cursor-pointer hover:underline">
                  Contactar Soporte MotoYA
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
