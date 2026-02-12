import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Logo from "../components/Logo";
import Footer from "../components/Footer";
import { getPublicProfile, getStoredUser, logout, type AuthUser, type UserProfile } from "../services/api";
import UserAvatar from "../components/UserAvatar";

const COLORS = ["#E53E3E", "#DD6B20", "#38A169", "#3182CE", "#805AD5", "#D53F8C"];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
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

function formatMemberSince(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

const TYPE_LABELS: Record<string, string> = {
  shop: "Taller",
  mechanic: "Mecanico",
  parts_store: "Repuestos",
};

const TYPE_BADGE_STYLES: Record<string, string> = {
  shop: "bg-primary/20 text-yellow-700 dark:text-primary",
  mechanic: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  parts_store: "bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300",
};

export default function PerfilPublico() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPublicProfile(Number(id))
      .then(setProfile)
      .catch(() => setError("No se pudo cargar el perfil"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const reviews = profile?.reviews || [];
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
    : "0.0";

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-[#181611] dark:text-gray-100">
      {/* Navbar */}
      <nav className="bg-white dark:bg-background-dark border-b border-[#f4f3f0] dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <Logo />
              <h2 className="text-xl font-bold tracking-tight">MotoFIX</h2>
            </Link>
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/talleres" className="text-sm font-medium hover:text-primary transition-colors">Talleres</Link>
              <Link to="/registro-taller" className="text-sm font-medium hover:text-primary transition-colors">Registrar taller</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <UserAvatar user={user} />
                <button onClick={handleLogout} className="text-sm font-bold px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Cerrar sesion
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Ingresar</Link>
                <Link to="/register" className="text-sm font-bold px-4 py-2 rounded-lg bg-primary hover:bg-[#d6aa28] text-[#181611] transition-colors">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-grow w-full max-w-lg mx-auto sm:max-w-2xl lg:max-w-4xl px-4 py-6 sm:py-8 lg:py-12">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-gray-400 mb-4 block">error</span>
            <p className="text-gray-500">{error}</p>
            <Link to="/talleres" className="text-primary font-bold mt-4 inline-block hover:underline">Volver a talleres</Link>
          </div>
        )}

        {profile && !loading && (
          <>
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
              {/* Banner */}
              <div className="h-24 sm:h-32 bg-gradient-to-r from-[#181611] to-[#5c584a] relative">
                <div className="absolute inset-0 bg-primary/10"></div>
              </div>

              {/* Avatar + Info */}
              <div className="px-4 pb-6 relative flex flex-col items-center">
                <div className="-mt-12 mb-4 relative z-10">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-md flex items-center justify-center"
                    style={{ backgroundColor: profile.avatar_url ? undefined : getColor(profile.name) }}
                  >
                    {profile.avatar_url ? (
                      <img alt={profile.name} className="w-full h-full object-cover" src={profile.avatar_url} />
                    ) : (
                      <span className="text-white font-bold text-3xl sm:text-4xl">{getInitials(profile.name)}</span>
                    )}
                  </div>
                </div>

                <div className="text-center w-full">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#181611] dark:text-white leading-tight">{profile.name}</h1>
                  <div className="mt-2 flex flex-col items-center gap-2">
                    {(profile.city || profile.province) && (
                      <p className="text-sm text-[#887f63] dark:text-gray-400 flex items-center">
                        <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                        {[profile.city, profile.province].filter(Boolean).join(", ")}
                      </p>
                    )}
                    {profile.created_at && (
                      <p className="text-sm text-[#887f63] dark:text-gray-400 flex items-center">
                        <span className="material-symbols-outlined text-sm mr-1">calendar_today</span>
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
              <div className="bg-[#f8f7f6] dark:bg-gray-900/50 px-4 py-3 border-t border-gray-100 dark:border-gray-700 text-center">
                <p className="text-xs text-[#887f63] dark:text-gray-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm mr-2">privacy_tip</span>
                  Perfil con privacidad protegida
                </p>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-6">
              <h2 className="text-lg font-bold text-[#181611] dark:text-white mb-4 flex items-center px-1">
                <span className="material-symbols-outlined mr-2 text-primary">rate_review</span>
                Historial de Opiniones
              </h2>

              {reviews.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-700">
                  <span className="material-symbols-outlined text-gray-400 text-5xl mb-3 block">chat_bubble</span>
                  <h3 className="font-bold text-lg mb-1">Sin opiniones todavia</h3>
                  <p className="text-[#887f63] dark:text-gray-400 text-sm">Este usuario aun no dejo resenas.</p>
                </div>
              )}

              {reviews.length > 0 && (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start w-full">
                          {review.provider ? (
                            <Link to={`/taller/${review.provider.id}`} className="font-bold text-base text-[#181611] dark:text-white hover:text-primary transition-colors line-clamp-1">
                              {review.provider.name}
                            </Link>
                          ) : (
                            <span className="font-bold text-base text-[#181611] dark:text-white line-clamp-1">Negocio eliminado</span>
                          )}
                          <span className="text-xs text-[#887f63] dark:text-gray-500 whitespace-nowrap ml-2">{timeAgo(review.created_at)}</span>
                        </div>

                        {/* Provider badge */}
                        {review.provider && (
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${TYPE_BADGE_STYLES[review.provider.type] || "bg-gray-100 text-gray-600"}`}>
                              {TYPE_LABELS[review.provider.type] || review.provider.type}
                            </span>
                            {review.provider.location && (
                              <span className="text-xs text-[#887f63] dark:text-gray-400 flex items-center">
                                <span className="material-symbols-outlined text-[14px] mr-0.5">location_on</span>
                                {review.provider.location.city}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Stars */}
                        <div className="flex text-primary">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className="material-symbols-outlined text-[18px]"
                              style={{
                                fontVariationSettings: `'FILL' ${star <= review.rating ? 1 : 0}`,
                                color: star <= review.rating ? undefined : "#d1d5db",
                              }}
                            >
                              star
                            </span>
                          ))}
                        </div>

                        <p className="text-[#5c584a] dark:text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                      </div>
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
