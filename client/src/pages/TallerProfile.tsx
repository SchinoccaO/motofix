import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Footer from "../components/Footer";
import {
  getStoredUser,
  logout,
  getProviderById,
  createReview,
  type AuthUser,
  type Provider,
  type ReviewData,
} from "../services/api";

const TYPE_LABELS: Record<string, string> = {
  shop: "Taller Mecanico",
  mechanic: "Mecanico",
  parts_store: "Casa de Repuestos",
};

const HERO_IMAGES: Record<string, string> = {
  shop: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&h=500&fit=crop",
  mechanic: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&h=500&fit=crop",
  parts_store: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=500&fit=crop",
};

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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex text-primary text-sm">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="material-symbols-outlined text-[18px]"
          style={{
            fontVariationSettings: `'FILL' ${star <= rating ? 1 : 0}`,
            color: star <= rating ? undefined : "#d1d5db",
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}

function formatTime(hours: number): string {
  if (hours < 24) return `${hours} ${hours === 1 ? "hora" : "horas"}`;
  const days = Math.floor(hours / 24);
  const remaining = hours % 24;
  const dayStr = `${days} ${days === 1 ? "dia" : "dias"}`;
  if (remaining === 0) return dayStr;
  return `${dayStr} y ${remaining} ${remaining === 1 ? "hora" : "horas"}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const COLORS = ["#E53E3E", "#DD6B20", "#38A169", "#3182CE", "#805AD5", "#D53F8C"];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function TallerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inline review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [estDays, setEstDays] = useState(0);
  const [estHours, setEstHours] = useState(0);
  const [actDays, setActDays] = useState(0);
  const [actHours, setActHours] = useState(0);

  const ratingLabels = ["", "Muy mala", "Mala", "Regular", "Buena", "Excelente"];

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const fetchProvider = () => {
    if (!id) return;
    setLoading(true);
    getProviderById(Number(id))
      .then(setProvider)
      .catch(() => setError("No se pudo cargar el negocio"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProvider();
  }, [id]);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const handleReviewSubmit = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (reviewRating === 0) {
      setReviewError("Selecciona una calificacion");
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError("Escribe un comentario");
      return;
    }
    setReviewError(null);
    setReviewSubmitting(true);
    try {
      const estTotal = estDays * 24 + estHours;
      const actTotal = actDays * 24 + actHours;
      await createReview(
        Number(id),
        reviewRating,
        reviewComment.trim(),
        estTotal > 0 ? estTotal : null,
        actTotal > 0 ? actTotal : null
      );
      // Reset form and reload provider to see the new review
      setReviewRating(0);
      setReviewComment("");
      setEstDays(0);
      setEstHours(0);
      setActDays(0);
      setActHours(0);
      setShowReviewForm(false);
      fetchProvider();
    } catch (err: any) {
      setReviewError(err?.response?.data?.error || "Error al enviar la resena");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const reviews = provider?.reviews || [];
  const avgRating = Number(provider?.average_rating || 0);

  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) ratingCounts[r.rating - 1]++;
  });
  const totalReviews = reviews.length;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white overflow-x-hidden min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:bg-background-dark dark:border-gray-800">
        <div className="px-4 md:px-8 lg:px-12 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span className="text-xl font-bold text-gray-900 dark:text-white">MotoFIX</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/registro-taller" className="hidden md:block text-sm font-medium hover:text-primary transition-colors">
              Registrar taller
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-bold px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cerrar sesion
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Ingresar
                </Link>
                <Link to="/register" className="text-sm font-bold px-4 py-2 rounded-lg bg-primary hover:bg-[#d6aa28] text-[#181611] transition-colors">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-gray-400 mb-4 block">error</span>
            <p className="text-gray-500">{error}</p>
            <Link to="/talleres" className="text-primary font-bold mt-4 inline-block hover:underline">
              Volver a talleres
            </Link>
          </div>
        )}

        {provider && !loading && (
          <>
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
              <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <Link to="/talleres" className="hover:text-primary transition-colors">Talleres</Link>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-text-main font-medium dark:text-white">{provider.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT COLUMN */}
              <div className="lg:col-span-2 space-y-8">
                {/* Hero Image */}
                <div className="w-full aspect-video md:aspect-[21/9] bg-gray-200 rounded-xl overflow-hidden relative">
                  <img
                    src={HERO_IMAGES[provider.type] || HERO_IMAGES.shop}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Header Info */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-primary/20 text-yellow-700 dark:text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                          {TYPE_LABELS[provider.type] || provider.type}
                        </span>
                        {provider.is_verified && (
                          <span className="flex items-center text-green-600 dark:text-green-400 text-xs font-bold gap-1">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            Verificado
                          </span>
                        )}
                      </div>
                      <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-main dark:text-white mb-2">
                        {provider.name}
                      </h1>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-primary">
                          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="font-bold text-lg text-text-main dark:text-white">
                            {avgRating.toFixed(1)}
                          </span>
                          <span className="text-text-secondary">
                            ({provider.total_reviews} {provider.total_reviews === 1 ? "resena" : "resenas"})
                          </span>
                        </div>
                        {provider.location && (
                          <>
                            <span className="text-gray-300">|</span>
                            <span className="text-text-secondary flex items-center gap-1">
                              <span className="material-symbols-outlined text-lg">location_on</span>
                              {provider.location.city}, {provider.location.province}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {provider.description && (
                  <div>
                    <h3 className="text-lg font-bold mb-2">Sobre el negocio</h3>
                    <p className="text-text-secondary leading-relaxed text-base">{provider.description}</p>
                  </div>
                )}

                <hr className="border-gray-200 dark:border-gray-800" />

                {/* Reviews Section */}
                <div id="reviews">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">Resenas y Opiniones</h3>
                    <button
                      onClick={() => {
                        if (!user) {
                          navigate("/login");
                          return;
                        }
                        setShowReviewForm(!showReviewForm);
                      }}
                      className="bg-primary hover:bg-yellow-500 text-text-main font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined">rate_review</span>
                      Dejar resena
                    </button>
                  </div>

                  {/* Inline Review Form */}
                  {showReviewForm && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 mb-8">
                      <h4 className="font-bold text-lg mb-4">Tu resena para {provider.name}</h4>

                      {reviewError && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                          {reviewError}
                        </div>
                      )}

                      {/* Stars */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Calificacion</p>
                        <div className="flex gap-1 items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="focus:outline-none transition-transform active:scale-95"
                              onMouseEnter={() => setReviewHover(star)}
                              onMouseLeave={() => setReviewHover(0)}
                              onClick={() => setReviewRating(star)}
                            >
                              <span
                                className={`material-symbols-outlined text-3xl transition-colors ${
                                  star <= (reviewHover || reviewRating)
                                    ? "text-primary"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                                style={
                                  star <= (reviewHover || reviewRating)
                                    ? { fontVariationSettings: "'FILL' 1" }
                                    : {}
                                }
                              >
                                star
                              </span>
                            </button>
                          ))}
                          {(reviewHover || reviewRating) > 0 && (
                            <span className="ml-2 text-sm font-medium text-primary">
                              {ratingLabels[reviewHover || reviewRating]}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Comment */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Comentario</p>
                        <div className="relative">
                          <textarea
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm p-3 resize-y min-h-[100px] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                            placeholder="Conta tu experiencia..."
                            rows={4}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value.slice(0, 500))}
                          />
                          <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                            {reviewComment.length}/500
                          </div>
                        </div>
                      </div>

                      {/* Time fields */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Tiempos del trabajo <span className="text-xs text-gray-400 font-normal">(opcional)</span>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Estimated */}
                          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">schedule</span>
                              Tiempo estimado
                            </p>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <select
                                  value={estDays}
                                  onChange={(e) => setEstDays(Number(e.target.value))}
                                  className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm py-1.5 px-2 focus:border-primary focus:outline-none"
                                >
                                  {Array.from({ length: 31 }, (_, i) => (
                                    <option key={i} value={i}>{i} {i === 1 ? "dia" : "dias"}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex-1">
                                <select
                                  value={estHours}
                                  onChange={(e) => setEstHours(Number(e.target.value))}
                                  className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm py-1.5 px-2 focus:border-primary focus:outline-none"
                                >
                                  {Array.from({ length: 24 }, (_, i) => (
                                    <option key={i} value={i}>{i} {i === 1 ? "hora" : "horas"}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                          {/* Actual */}
                          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">timer</span>
                              Tiempo real
                            </p>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <select
                                  value={actDays}
                                  onChange={(e) => setActDays(Number(e.target.value))}
                                  className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm py-1.5 px-2 focus:border-primary focus:outline-none"
                                >
                                  {Array.from({ length: 31 }, (_, i) => (
                                    <option key={i} value={i}>{i} {i === 1 ? "dia" : "dias"}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex-1">
                                <select
                                  value={actHours}
                                  onChange={(e) => setActHours(Number(e.target.value))}
                                  className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm py-1.5 px-2 focus:border-primary focus:outline-none"
                                >
                                  {Array.from({ length: 24 }, (_, i) => (
                                    <option key={i} value={i}>{i} {i === 1 ? "hora" : "horas"}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setShowReviewForm(false);
                            setReviewRating(0);
                            setReviewComment("");
                            setEstDays(0);
                            setEstHours(0);
                            setActDays(0);
                            setActHours(0);
                            setReviewError(null);
                          }}
                          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          disabled={reviewSubmitting}
                          onClick={handleReviewSubmit}
                          className="bg-primary hover:bg-[#d6aa28] text-[#181611] font-bold text-sm px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {reviewSubmitting ? "Publicando..." : "Publicar"}
                          {!reviewSubmitting && (
                            <span className="material-symbols-outlined text-[16px]">send</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Ratings Summary */}
                  {totalReviews > 0 && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 mb-8">
                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex flex-col items-center justify-center min-w-[140px]">
                          <span className="text-6xl font-black text-text-main dark:text-white">
                            {avgRating.toFixed(1)}
                          </span>
                          <div className="flex text-primary my-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className="material-symbols-outlined"
                                style={{
                                  fontVariationSettings: `'FILL' ${star <= Math.round(avgRating) ? 1 : 0}`,
                                  color: star <= Math.round(avgRating) ? undefined : "#d1d5db",
                                }}
                              >
                                star
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-text-secondary">
                            Basado en {totalReviews} {totalReviews === 1 ? "opinion" : "opiniones"}
                          </span>
                        </div>
                        <div className="flex-1 w-full space-y-2">
                          {[5, 4, 3, 2, 1].map((stars) => {
                            const count = ratingCounts[stars - 1];
                            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                            return (
                              <div key={stars} className="flex items-center gap-3 text-sm">
                                <span className="font-bold w-3">{stars}</span>
                                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }}></div>
                                </div>
                                <span className="text-text-secondary w-8 text-right">{pct}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Individual Reviews */}
                  {totalReviews === 0 && !showReviewForm && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center">
                      <span className="material-symbols-outlined text-gray-400 text-5xl mb-3 block">chat_bubble</span>
                      <h4 className="font-bold text-lg mb-1">Aun no hay resenas</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Se el primero en dejar tu opinion sobre este negocio.
                      </p>
                    </div>
                  )}

                  {totalReviews > 0 && (
                    <div className="space-y-6">
                      {reviews.map((review: ReviewData) => (
                        <div key={review.id} className="border-b border-gray-100 dark:border-gray-800 pb-6">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                style={{ backgroundColor: getColor(review.user.name) }}
                              >
                                {getInitials(review.user.name)}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm">{review.user.name}</h4>
                                <span className="text-xs text-text-secondary">{timeAgo(review.created_at)}</span>
                              </div>
                            </div>
                            <StarRating rating={review.rating} />
                          </div>
                          <p className="text-text-main dark:text-gray-300 text-sm mt-2">{review.comment}</p>
                          {(review.estimated_time || review.actual_time) && (
                            <div className="flex flex-wrap gap-3 mt-3">
                              {review.estimated_time && (
                                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full">
                                  <span className="material-symbols-outlined text-sm">schedule</span>
                                  Estimado: {formatTime(review.estimated_time)}
                                </span>
                              )}
                              {review.actual_time && (
                                <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${
                                  review.estimated_time && review.actual_time > review.estimated_time
                                    ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                    : "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                }`}>
                                  <span className="material-symbols-outlined text-sm">timer</span>
                                  Real: {formatTime(review.actual_time)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN (Sidebar) */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Contact Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-4">Contacto</h3>
                      <div className="space-y-4 mb-6">
                        {provider.location && (
                          <div className="flex items-start gap-3">
                            <div className="mt-1 bg-gray-100 dark:bg-gray-700 p-1.5 rounded text-gray-600 dark:text-gray-300">
                              <span className="material-symbols-outlined text-sm">location_on</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold">Direccion</p>
                              <p className="text-sm text-text-secondary">
                                {provider.location.address}, {provider.location.city}, {provider.location.province}
                              </p>
                            </div>
                          </div>
                        )}
                        {provider.phone && (
                          <div className="flex items-start gap-3">
                            <div className="mt-1 bg-gray-100 dark:bg-gray-700 p-1.5 rounded text-gray-600 dark:text-gray-300">
                              <span className="material-symbols-outlined text-sm">call</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold">Telefono</p>
                              <p className="text-sm text-text-secondary">{provider.phone}</p>
                            </div>
                          </div>
                        )}
                        {provider.email && (
                          <div className="flex items-start gap-3">
                            <div className="mt-1 bg-gray-100 dark:bg-gray-700 p-1.5 rounded text-gray-600 dark:text-gray-300">
                              <span className="material-symbols-outlined text-sm">mail</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold">Email</p>
                              <p className="text-sm text-text-secondary">{provider.email}</p>
                            </div>
                          </div>
                        )}
                        {provider.website && (
                          <div className="flex items-start gap-3">
                            <div className="mt-1 bg-gray-100 dark:bg-gray-700 p-1.5 rounded text-gray-600 dark:text-gray-300">
                              <span className="material-symbols-outlined text-sm">language</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold">Web</p>
                              <a
                                href={provider.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                              >
                                {provider.website.replace(/^https?:\/\//, "")}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                      {provider.phone && (
                        <div className="flex flex-col gap-3">
                          <a
                            href={`https://wa.me/${provider.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-xl">chat</span>
                            Enviar WhatsApp
                          </a>
                          <a
                            href={`tel:${provider.phone}`}
                            className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-text-main dark:text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-xl">call</span>
                            Llamar
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verified Badge */}
                  {provider.is_verified && (
                    <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">verified</span>
                        <div>
                          <h4 className="font-bold text-sm mb-1">Certificado MotoFIX</h4>
                          <p className="text-xs text-text-secondary">
                            Este negocio cumple con nuestros estandares de calidad y transparencia.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
