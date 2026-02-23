import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getStoredToken, getStoredUser, getMyProfile, updateMyProfile, changePassword } from "../services/api";

const PROVINCIAS = [
  "", "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Cordoba",
  "Corrientes", "Entre Rios", "Formosa", "Jujuy", "La Pampa", "La Rioja",
  "Mendoza", "Misiones", "Neuquen", "Rio Negro", "Salta", "San Juan",
  "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
  "Tierra del Fuego", "Tucuman",
];

export default function Seguridad() {
  const navigate = useNavigate();

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Phone form
  const [phone, setPhone] = useState("");

  // Location form
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  // State
  const [saving, setSaving] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      navigate("/login");
      return;
    }
    const u = getStoredUser();
    setPhone(u?.phone || "");

    getMyProfile()
      .then((prof) => {
        setPhone(prof.phone || "");
        setCity(prof.city || "");
        setProvince(prof.province || "");
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
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

  const handleContactSave = async () => {
    setSavingContact(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await updateMyProfile({
        phone: phone || null,
        city: city || null,
        province: province || null,
      });
      const storedUser = getStoredUser();
      if (storedUser) {
        if (updated.phone !== undefined) storedUser.phone = updated.phone;
        if (updated.city !== undefined) storedUser.city = updated.city;
        if (updated.province !== undefined) storedUser.province = updated.province;
        localStorage.setItem("usuario", JSON.stringify(storedUser));
      }
      setSuccess("Datos de contacto actualizados correctamente");
    } catch {
      setError("Error al guardar los datos de contacto");
    } finally {
      setSavingContact(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-[#181611] dark:text-gray-100">
      <Navbar activePage="seguridad" />

      <main className="flex-grow py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-[#887f63] dark:text-gray-400 mb-2">
              <Link to="/mi-perfil" className="hover:text-primary transition-colors flex items-center">
                <span className="material-symbols-outlined text-base mr-1">arrow_back</span>
                Volver a Mi Perfil
              </Link>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-[#181611] dark:text-white">
              Centro de Seguridad
            </h2>
            <p className="mt-2 text-sm text-[#887f63] dark:text-gray-400">
              Gestiona tu contraseña, telefono y ubicacion.
            </p>
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

          {/* Password Card */}
          <div className="bg-white dark:bg-card-dark shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-input-border-dark mb-6">
            <div className="px-5 sm:px-6 py-5 border-b border-gray-100 dark:border-input-border-dark">
              <h3 className="text-lg font-bold text-[#181611] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">lock_reset</span>
                Cambio de Contraseña
              </h3>
            </div>

            <div className="px-5 sm:px-6 py-6 space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-[#5c584a] dark:text-gray-300" htmlFor="current-password">
                  Contraseña actual
                </label>
                <div className="mt-1 relative">
                  <input
                    className="block w-full rounded-lg border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark text-[#181611] dark:text-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm pl-3 pr-10 py-2.5"
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

              <hr className="border-gray-100 dark:border-input-border-dark" />

              {/* New Password Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#5c584a] dark:text-gray-300" htmlFor="new-password">
                    Nueva contraseña
                  </label>
                  <div className="mt-1 relative">
                    <input
                      className="block w-full rounded-lg border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark text-[#181611] dark:text-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm pl-3 pr-10 py-2.5"
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
                      className="block w-full rounded-lg border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark text-[#181611] dark:text-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm pl-3 pr-10 py-2.5"
                      id="confirm-password"
                      type={showConfirmPw ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <span className="material-symbols-outlined text-sm">{showConfirmPw ? "visibility" : "visibility_off"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-[#f8f7f6] dark:bg-elevated-dark/50 rounded-lg p-4">
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
            <div className="px-5 sm:px-6 py-4 bg-[#f8f7f6] dark:bg-elevated-dark/30 border-t border-gray-100 dark:border-input-border-dark flex justify-end gap-3">
              <button
                type="button"
                onClick={handlePasswordCancel}
                className="px-4 py-2 border border-gray-300 dark:border-input-border-dark rounded-lg shadow-sm text-sm font-medium text-[#5c584a] dark:text-gray-200 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-elevated-dark transition-colors"
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

          {/* Contact Data Card (Phone + City + Province) */}
          <div className="bg-white dark:bg-card-dark shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-input-border-dark mb-6">
            <div className="px-5 sm:px-6 py-5 border-b border-gray-100 dark:border-input-border-dark">
              <h3 className="text-lg font-bold text-[#181611] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">contact_phone</span>
                Datos de Contacto
              </h3>
              <p className="text-sm text-[#887f63] dark:text-gray-400 mt-1">
                Modifica tu telefono y ubicacion. El email no se puede cambiar.
              </p>
            </div>

            {loadingProfile ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="px-5 sm:px-6 py-6 space-y-6">
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-[#5c584a] dark:text-gray-300" htmlFor="phone-edit">
                      Telefono Movil
                    </label>
                    <div className="mt-1 flex rounded-lg shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-input-border-dark bg-gray-50 dark:bg-elevated-dark text-[#887f63] dark:text-gray-400 text-sm">
                        +54
                      </span>
                      <input
                        className="flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none rounded-r-lg border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark text-[#181611] dark:text-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                        id="phone-edit"
                        placeholder="351 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* City + Province */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#5c584a] dark:text-gray-300" htmlFor="city-edit">
                        Ciudad
                      </label>
                      <div className="mt-1">
                        <input
                          className="focus:ring-1 focus:ring-primary focus:border-primary block w-full sm:text-sm border border-gray-300 dark:border-input-border-dark rounded-lg bg-white dark:bg-elevated-dark dark:text-white py-2.5 px-3"
                          id="city-edit"
                          placeholder="Ej: Cordoba"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#5c584a] dark:text-gray-300" htmlFor="province-edit">
                        Provincia
                      </label>
                      <div className="mt-1">
                        <select
                          className="focus:ring-1 focus:ring-primary focus:border-primary block w-full sm:text-sm border border-gray-300 dark:border-input-border-dark rounded-lg bg-white dark:bg-elevated-dark dark:text-white py-2.5 px-3"
                          id="province-edit"
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                        >
                          <option value="">Seleccionar provincia</option>
                          {PROVINCIAS.filter(Boolean).map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Card Footer */}
                <div className="px-5 sm:px-6 py-4 bg-[#f8f7f6] dark:bg-elevated-dark/30 border-t border-gray-100 dark:border-input-border-dark flex justify-end">
                  <button
                    type="button"
                    onClick={handleContactSave}
                    disabled={savingContact}
                    className="px-5 py-2 border border-transparent rounded-lg shadow-sm text-sm font-bold text-[#181611] bg-primary hover:bg-[#d6aa28] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {savingContact ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#181611]"></div>
                        Guardando...
                      </>
                    ) : (
                      "Guardar Datos"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Help Card */}
          <div className="bg-[#f8f7f6] dark:bg-card-dark/40 rounded-xl p-5 border border-gray-100 dark:border-input-border-dark">
            <h4 className="text-sm font-semibold text-[#181611] dark:text-white mb-2">Necesitas ayuda?</h4>
            <p className="text-xs text-[#887f63] dark:text-gray-400 mb-4">
              Si tenes problemas con tu cuenta o no reconoces algun cambio, contacta soporte inmediatamente.
            </p>
            <span className="text-xs font-medium text-primary flex items-center gap-1 cursor-pointer hover:underline">
              Contactar Soporte MotoYA
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
