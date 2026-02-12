import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  getMyProfile,
  getMyProviders,
  getStoredUser,
  getStoredToken,
  updateMyProfile,
  type UserProfile,
  type Provider,
} from "../services/api";

const COLORS = ["#E53E3E", "#DD6B20", "#38A169", "#3182CE", "#805AD5", "#D53F8C"];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function formatMemberSince(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "Hace un momento";
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} hs`;
  const days = Math.floor(diff / 86400);
  if (days === 1) return "Hace 1 dia";
  if (days < 30) return `Hace ${days} dias`;
  if (days < 365) return `Hace ${Math.floor(days / 30)} meses`;
  return `Hace ${Math.floor(days / 365)} anos`;
}

const PROVINCIAS = [
  "", "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Cordoba",
  "Corrientes", "Entre Rios", "Formosa", "Jujuy", "La Pampa", "La Rioja",
  "Mendoza", "Misiones", "Neuquen", "Rio Negro", "Salta", "San Juan",
  "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
  "Tierra del Fuego", "Tucuman",
];

const TYPE_LABELS: Record<string, string> = {
  shop: "Taller",
  mechanic: "Mecanico",
  parts_store: "Repuestos",
};

export default function MiPerfil() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [myProviders, setMyProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formProvince, setFormProvince] = useState("");

  // Confirmation state
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      navigate("/login");
      return;
    }
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [prof, provs] = await Promise.all([
        getMyProfile(),
        getMyProviders().catch(() => [] as Provider[]),
      ]);
      setProfile(prof);
      setMyProviders(provs);
      setFormName(prof.name || "");
      setFormPhone(prof.phone || "");
      setFormCity(prof.city || "");
      setFormProvince(prof.province || "");
    } catch {
      setError("No se pudo cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = profile && (
    formName !== (profile.name || "") ||
    formPhone !== (profile.phone || "") ||
    formCity !== (profile.city || "") ||
    formProvince !== (profile.province || "")
  );

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setSaving(true);
    try {
      const updated = await updateMyProfile({
        name: formName,
        phone: formPhone || null,
        city: formCity || null,
        province: formProvince || null,
      });
      setProfile({ ...profile!, ...updated });
      const storedUser = getStoredUser();
      if (storedUser) {
        storedUser.name = formName;
        localStorage.setItem("usuario", JSON.stringify(storedUser));
      }
      setShowConfirm(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setError("Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormName(profile.name || "");
      setFormPhone(profile.phone || "");
      setFormCity(profile.city || "");
      setFormProvince(profile.province || "");
    }
  };

  const reviews = profile?.reviews || [];
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
    : "0.0";

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-[#181611] dark:text-gray-100">
      <Navbar activePage="mi-perfil" />

      {/* Main */}
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center mb-6 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-red-500 text-xl">error</span>
            <p className="text-red-600 dark:text-red-400 font-medium text-sm">{error}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center mb-6 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-green-600 text-xl">check_circle</span>
            <p className="text-green-700 dark:text-green-400 font-medium text-sm">Perfil actualizado correctamente</p>
          </div>
        )}

        {profile && !loading && (
          <form onSubmit={handleSaveClick}>
            {/* Header Card: Banner + Avatar + Name + Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
              {/* Banner */}
              <div className="h-32 bg-gradient-to-r from-[#181611] to-[#5c584a] dark:from-[#111] dark:to-[#3a3830] relative">
                <div className="absolute inset-0 bg-primary/10"></div>
              </div>

              {/* Avatar + Name area */}
              <div className="px-6 pb-8 relative">
                {/* Avatar */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 sm:left-10 sm:translate-x-0 group cursor-pointer">
                  <div
                    className="relative w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-md flex items-center justify-center"
                    style={{ backgroundColor: profile.avatar_url ? undefined : getColor(profile.name) }}
                  >
                    {profile.avatar_url ? (
                      <img alt={profile.name} className="w-full h-full object-cover transition-opacity group-hover:opacity-75" src={profile.avatar_url} />
                    ) : (
                      <span className="text-white font-bold text-4xl transition-opacity group-hover:opacity-75">{getInitials(formName || profile.name)}</span>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white text-2xl">camera_alt</span>
                    </div>
                  </div>
                </div>

                {/* Name + Badge + Stats */}
                <div className="mt-24 sm:mt-4 sm:ml-40">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    {/* Name input */}
                    <div className="w-full sm:max-w-md">
                      <label className="block text-sm font-medium text-[#887f63] dark:text-gray-400 mb-1">Nombre Completo</label>
                      <input
                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm bg-white dark:bg-gray-900 dark:text-white px-3 py-2"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Tu nombre completo"
                      />

                      {/* Badge + Member Since */}
                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-yellow-700 dark:text-primary border border-primary/30 cursor-default">
                          <span className="material-symbols-outlined text-sm mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                          Miembro Verificado
                        </span>
                        {profile.created_at && (
                          <p className="text-sm text-[#887f63] dark:text-gray-400 flex items-center">
                            <span className="material-symbols-outlined text-sm mr-1 text-gray-400">calendar_today</span>
                            Miembro desde {formatMemberSince(profile.created_at)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 justify-center sm:justify-end opacity-75">
                      <div className="text-center">
                        <span className="block text-xl font-bold text-[#181611] dark:text-white">{reviewCount}</span>
                        <span className="text-xs font-medium text-[#887f63] dark:text-gray-400 uppercase tracking-wide">Opiniones</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-0.5">
                          <span className="text-xl font-bold text-[#181611] dark:text-white">{avgRating}</span>
                          <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        </div>
                        <span className="text-xs font-medium text-[#887f63] dark:text-gray-400 uppercase tracking-wide">Media</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy footer */}
              <div className="bg-[#f8f7f6] dark:bg-gray-900/50 px-6 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <p className="text-xs text-[#887f63] dark:text-gray-400 flex items-center">
                  <span className="material-symbols-outlined text-sm mr-2 text-primary">visibility</span>
                  Estas editando tu perfil. Los campos privados no seran visibles para otros usuarios.
                </p>
                <Link to={`/usuario/${profile.id}`} className="text-xs text-primary font-medium hover:underline whitespace-nowrap ml-4">
                  Ver perfil publico
                </Link>
              </div>
            </div>

            {/* Contact Data (Private) */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
              <h2 className="text-lg font-bold text-[#181611] dark:text-white mb-1 flex items-center">
                <span className="material-symbols-outlined mr-2 text-gray-400">lock</span>
                Datos de Contacto (Privado)
              </h2>
              <p className="text-sm text-[#887f63] dark:text-gray-400 mb-6 ml-8">
                Esta informacion solo la usaremos para contactarte sobre tus servicios en MotoYA.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-0 md:ml-8">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#5c584a] dark:text-gray-300" htmlFor="phone">Telefono Movil</label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-[#887f63] sm:text-sm">+54</span>
                    </div>
                    <input
                      className="focus:ring-1 focus:ring-primary focus:border-primary block w-full pl-12 sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white py-2"
                      id="phone"
                      placeholder="351 123 4567"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Email (locked) */}
                <div>
                  <label className="block text-sm font-medium text-[#5c584a] dark:text-gray-300" htmlFor="email">Email</label>
                  <div className="mt-1">
                    <input
                      className="block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed py-2 px-3"
                      disabled
                      id="email"
                      type="email"
                      value={profile.email}
                    />
                    <p className="mt-1 text-xs text-gray-400">El email no se puede cambiar directamente.</p>
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-[#5c584a] dark:text-gray-300" htmlFor="city">Ciudad</label>
                  <div className="mt-1">
                    <input
                      className="focus:ring-1 focus:ring-primary focus:border-primary block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white py-2 px-3"
                      id="city"
                      placeholder="Ej: Cordoba"
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                    />
                  </div>
                </div>

                {/* Province */}
                <div>
                  <label className="block text-sm font-medium text-[#5c584a] dark:text-gray-300" htmlFor="province">Provincia</label>
                  <div className="mt-1">
                    <select
                      className="focus:ring-1 focus:ring-primary focus:border-primary block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white py-2 px-3"
                      id="province"
                      value={formProvince}
                      onChange={(e) => setFormProvince(e.target.value)}
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

            {/* Security Link */}
            <Link
              to="/mi-perfil/seguridad"
              className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-6 group hover:border-primary/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-red-500">shield</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#181611] dark:text-white group-hover:text-primary transition-colors">
                    Centro de Seguridad
                  </h3>
                  <p className="text-xs text-[#887f63] dark:text-gray-400">Cambiar contraseña y verificacion de telefono</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary text-[20px]">chevron_right</span>
            </Link>

            {/* Mis Negocios (if any) */}
            {myProviders.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
                <h2 className="text-lg font-bold text-[#181611] dark:text-white mb-4 flex items-center">
                  <span className="material-symbols-outlined mr-2 text-primary">storefront</span>
                  Mis Negocios
                </h2>
                <div className="space-y-3">
                  {myProviders.map((prov) => (
                    <Link
                      key={prov.id}
                      to={`/taller/${prov.id}`}
                      className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-primary/50 hover:shadow-sm transition-all group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary">
                          {prov.type === "shop" ? "home_repair_service" : prov.type === "mechanic" ? "build" : "inventory_2"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{prov.name}</h4>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-[#887f63] dark:text-gray-400">{TYPE_LABELS[prov.type] || prov.type}</span>
                          <span className="text-xs text-[#887f63] dark:text-gray-400 flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            {Number(prov.average_rating).toFixed(1)}
                          </span>
                          {prov.location && (
                            <span className="text-xs text-[#887f63] dark:text-gray-400">{prov.location.city}</span>
                          )}
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-gray-400 group-hover:text-primary text-[20px]">chevron_right</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Save / Cancel Buttons */}
            <div className="flex justify-end gap-3 mb-10 sticky bottom-4 z-40 bg-background-light dark:bg-background-dark py-4 border-t border-gray-200 dark:border-gray-800 md:static md:bg-transparent md:border-0 md:py-0">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-[#5c584a] dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!hasChanges}
                className="inline-flex justify-center px-5 py-2 border border-transparent text-sm font-bold rounded-lg shadow-sm text-[#181611] bg-primary hover:bg-[#d6aa28] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Guardar Cambios
              </button>
            </div>

            {/* Review History (read-only) */}
            <div className="mt-8 opacity-75">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#181611] dark:text-white flex items-center">
                  <span className="material-symbols-outlined mr-2 text-primary">rate_review</span>
                  Historial de Opiniones
                </h2>
                <span className="text-xs text-[#887f63] dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 flex items-center">
                  <span className="material-symbols-outlined text-xs mr-1">info</span>
                  Las resenas no son editables
                </span>
              </div>

              {reviews.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-700">
                  <span className="material-symbols-outlined text-gray-400 text-5xl mb-3 block">chat_bubble</span>
                  <h3 className="font-bold text-lg mb-1">Sin opiniones todavia</h3>
                  <p className="text-[#887f63] dark:text-gray-400 text-sm">Todavia no dejaste ninguna resena.</p>
                  <Link to="/talleres" className="text-primary font-bold mt-4 inline-block hover:underline text-sm">Explorar talleres</Link>
                </div>
              )}

              {reviews.length > 0 && (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          {review.provider ? (
                            <Link to={`/taller/${review.provider.id}`} className="font-bold text-lg text-[#181611] dark:text-white hover:text-primary transition-colors">
                              {review.provider.name}
                            </Link>
                          ) : (
                            <span className="font-bold text-lg text-gray-400">Negocio eliminado</span>
                          )}
                          <div className="flex text-primary mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className="material-symbols-outlined text-sm"
                                style={{
                                  fontVariationSettings: `'FILL' ${star <= review.rating ? 1 : 0}`,
                                  color: star <= review.rating ? undefined : "#d1d5db",
                                }}
                              >
                                star
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-[#887f63] dark:text-gray-500 whitespace-nowrap ml-4">{timeAgo(review.created_at)}</span>
                      </div>
                      <p className="text-[#5c584a] dark:text-gray-300 text-sm leading-relaxed mt-3">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        )}
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">shield</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Confirmar cambios</h3>
                <p className="text-xs text-[#887f63] dark:text-gray-400">Revisa antes de guardar</p>
              </div>
            </div>

            <div className="space-y-2 mb-6 bg-[#f8f7f6] dark:bg-gray-900 rounded-lg p-4">
              {formName !== (profile?.name || "") && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#887f63] dark:text-gray-400">Nombre</span>
                  <span className="font-medium">{formName}</span>
                </div>
              )}
              {formPhone !== (profile?.phone || "") && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#887f63] dark:text-gray-400">Telefono</span>
                  <span className="font-medium">{formPhone || "\u2014"}</span>
                </div>
              )}
              {formCity !== (profile?.city || "") && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#887f63] dark:text-gray-400">Ciudad</span>
                  <span className="font-medium">{formCity || "\u2014"}</span>
                </div>
              )}
              {formProvince !== (profile?.province || "") && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#887f63] dark:text-gray-400">Provincia</span>
                  <span className="font-medium">{formProvince || "\u2014"}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                disabled={saving}
                className="flex-1 bg-primary hover:bg-[#d6aa28] text-[#181611] font-bold text-sm px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#181611]"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    Confirmar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
