import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  getMyProfile,
  getMyProviders,
  getStoredToken,
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
    } catch {
      setError("No se pudo cargar el perfil");
    } finally {
      setLoading(false);
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

        {profile && !loading && (
          <>
            {/* Header Card: Banner + Avatar + Name + Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
              {/* Banner */}
              <div className="h-28 sm:h-32 bg-gradient-to-r from-[#181611] to-[#5c584a] dark:from-[#111] dark:to-[#3a3830] relative">
                <div className="absolute inset-0 bg-primary/10"></div>
              </div>

              {/* Avatar + Info */}
              <div className="px-4 sm:px-6 pb-6 relative flex flex-col items-center sm:items-start">
                {/* Avatar - centered on mobile, left on desktop */}
                <div className="-mt-14 sm:-mt-16 mb-4 relative z-10">
                  <div
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-md flex items-center justify-center"
                    style={{ backgroundColor: profile.avatar_url ? undefined : getColor(profile.name) }}
                  >
                    {profile.avatar_url ? (
                      <img alt={profile.name} className="w-full h-full object-cover" src={profile.avatar_url} />
                    ) : (
                      <span className="text-white font-bold text-4xl">{getInitials(profile.name)}</span>
                    )}
                  </div>
                </div>

                {/* Name + Badge + Member Since */}
                <div className="text-center sm:text-left w-full">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#181611] dark:text-white leading-tight">
                    {profile.name}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-yellow-700 dark:text-primary border border-primary/30">
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
                <div className="mt-6 w-full border-t border-gray-100 dark:border-gray-700 pt-4">
                  <div className="grid grid-cols-2 divide-x divide-gray-100 dark:divide-gray-700">
                    <div className="text-center px-4">
                      <span className="block text-2xl font-bold text-[#181611] dark:text-white">{reviewCount}</span>
                      <span className="text-xs font-medium text-[#887f63] dark:text-gray-400 uppercase tracking-wide">Opiniones</span>
                    </div>
                    <div className="text-center px-4">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-2xl font-bold text-[#181611] dark:text-white">{avgRating}</span>
                        <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                      <span className="text-xs font-medium text-[#887f63] dark:text-gray-400 uppercase tracking-wide">Media</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy footer */}
              <div className="bg-[#f8f7f6] dark:bg-gray-900/50 px-4 sm:px-6 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <p className="text-xs text-[#887f63] dark:text-gray-400 flex items-center">
                  <span className="material-symbols-outlined text-sm mr-2 text-primary">visibility</span>
                  Perfil con privacidad protegida
                </p>
                <Link to={`/usuario/${profile.id}`} className="text-xs text-primary font-medium hover:underline whitespace-nowrap ml-4">
                  Ver perfil publico
                </Link>
              </div>
            </div>

            {/* Contact Info (read-only) */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-6 mb-6">
              <h2 className="text-lg font-bold text-[#181611] dark:text-white mb-1 flex items-center">
                <span className="material-symbols-outlined mr-2 text-gray-400">lock</span>
                Datos de Contacto
              </h2>
              <p className="text-sm text-[#887f63] dark:text-gray-400 mb-5 ml-8">
                Para modificar estos datos, ingresa al Centro de Seguridad.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-0 sm:ml-8">
                {/* Email */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f8f7f6] dark:bg-gray-900/50">
                  <span className="material-symbols-outlined text-gray-400 text-xl">email</span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#887f63] dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium text-[#181611] dark:text-white truncate">{profile.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f8f7f6] dark:bg-gray-900/50">
                  <span className="material-symbols-outlined text-gray-400 text-xl">phone</span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#887f63] dark:text-gray-400">Telefono</p>
                    <p className="text-sm font-medium text-[#181611] dark:text-white">
                      {profile.phone ? `+54 ${profile.phone}` : "No registrado"}
                    </p>
                  </div>
                </div>

                {/* City */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f8f7f6] dark:bg-gray-900/50">
                  <span className="material-symbols-outlined text-gray-400 text-xl">location_city</span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#887f63] dark:text-gray-400">Ciudad</p>
                    <p className="text-sm font-medium text-[#181611] dark:text-white">
                      {profile.city || "No registrada"}
                    </p>
                  </div>
                </div>

                {/* Province */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f8f7f6] dark:bg-gray-900/50">
                  <span className="material-symbols-outlined text-gray-400 text-xl">map</span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#887f63] dark:text-gray-400">Provincia</p>
                    <p className="text-sm font-medium text-[#181611] dark:text-white">
                      {profile.province || "No registrada"}
                    </p>
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
                  <p className="text-xs text-[#887f63] dark:text-gray-400">Cambiar contraseña, telefono, ciudad y provincia</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary text-[20px]">chevron_right</span>
            </Link>

            {/* Mis Negocios (if any) */}
            {myProviders.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-6 mb-6">
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

            {/* Review History (read-only) */}
            <div className="mt-8">
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
                    <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          {review.provider ? (
                            <Link to={`/taller/${review.provider.id}`} className="font-bold text-base sm:text-lg text-[#181611] dark:text-white hover:text-primary transition-colors">
                              {review.provider.name}
                            </Link>
                          ) : (
                            <span className="font-bold text-base sm:text-lg text-gray-400">Negocio eliminado</span>
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
