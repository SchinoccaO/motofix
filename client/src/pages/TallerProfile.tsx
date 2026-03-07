import { useState, useEffect, lazy, Suspense } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  getStoredUser,
  getProviderById,
  createReview,
  updateProviderStatus,
  type AuthUser,
  type Provider,
  type ReviewData,
} from "../services/api";
import { isOpenNow, getHorariosSemana, getDiaArgentina } from "../utils/horarios";
import { scrollToId } from "../utils/scroll";

const MiniMapa = lazy(() => import('../components/MiniMapa'));

// ─── Constants ────────────────────────────────────────────────────────────────
const TYPE_LABELS: Record<string, string> = {
  shop:        'Taller Mecánico',
  mechanic:    'Mecánico',
  parts_store: 'Casa de Repuestos',
};

const HERO_IMAGES: Record<string, string> = {
  shop:        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&h=500&fit=crop',
  mechanic:    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&h=500&fit=crop',
  parts_store: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=500&fit=crop',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)    return 'Hace un momento';
  if (diff < 3600)  return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} hs`;
  const days = Math.floor(diff / 86400);
  if (days === 1)  return 'Hace 1 día';
  if (days < 30)   return `Hace ${days} días`;
  if (days < 365)  return `Hace ${Math.floor(days / 30)} meses`;
  return `Hace ${Math.floor(days / 365)} años`;
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
            color: star <= rating ? undefined : '#d1d5db',
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}

function formatTime(hours: number): string {
  if (hours < 24) return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  const days      = Math.floor(hours / 24);
  const remaining = hours % 24;
  const dayStr    = `${days} ${days === 1 ? 'día' : 'días'}`;
  if (remaining === 0) return dayStr;
  return `${dayStr} y ${remaining} ${remaining === 1 ? 'hora' : 'horas'}`;
}

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

const COLORS = ['#E53E3E', '#DD6B20', '#38A169', '#3182CE', '#805AD5', '#D53F8C'];
function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

// Google Maps URL for directions
function mapsUrl(p: Provider): string {
  if (p.location?.latitude && p.location?.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${p.location.latitude},${p.location.longitude}`;
  }
  const q = [p.location?.address, p.location?.city].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TallerProfile() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser]         = useState<AuthUser | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  // Anchor nav active section
  const [activeSection, setActiveSection] = useState<'info' | 'resenas'>('info');

  // Review form
  const [showReviewForm,   setShowReviewForm]   = useState(false);
  const [reviewRating,     setReviewRating]     = useState(0);
  const [reviewHover,      setReviewHover]      = useState(0);
  const [reviewComment,    setReviewComment]    = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError,      setReviewError]      = useState<string | null>(null);
  const [estDays,  setEstDays]  = useState(0);
  const [estHours, setEstHours] = useState(0);
  const [actDays,  setActDays]  = useState(0);
  const [actHours, setActHours] = useState(0);

  const ratingLabels = ['', 'Muy mala', 'Mala', 'Regular', 'Buena', 'Excelente'];

  // Owner status toggle
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError,   setStatusError]   = useState<string | null>(null);

  // ── Init ────────────────────────────────────────────────────────────────────
  useEffect(() => { setUser(getStoredUser()); }, []);

  const fetchProvider = () => {
    if (!id) return;
    setLoading(true);
    getProviderById(Number(id))
      .then(setProvider)
      .catch(() => setError('No se pudo cargar el negocio'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProvider(); }, [id]);

  // IntersectionObserver — tracks which section is in view
  useEffect(() => {
    if (!provider) return;
    const ids: Array<'info' | 'resenas'> = ['info', 'resenas'];
    const els = ids.map((s) => document.getElementById(s)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id as 'info' | 'resenas');
        }
      },
      { rootMargin: '-120px 0px -55% 0px', threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [provider]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleStatusChange = async (override: boolean | null) => {
    if (!provider) return;
    setStatusLoading(true);
    setStatusError(null);
    try {
      const result = await updateProviderStatus(provider.id, override);
      setProvider((prev) => prev ? { ...prev, is_open_override: result.is_open_override } : prev);
    } catch {
      setStatusError('No se pudo cambiar el estado. Intentá de nuevo.');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!user) { navigate('/login'); return; }
    if (reviewRating === 0) { setReviewError('Seleccioná una calificación'); return; }
    if (!reviewComment.trim()) { setReviewError('Escribí un comentario'); return; }
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
        actTotal > 0 ? actTotal : null,
      );
      setReviewRating(0); setReviewComment('');
      setEstDays(0); setEstHours(0); setActDays(0); setActHours(0);
      setShowReviewForm(false);
      fetchProvider();
    } catch (err: any) {
      setReviewError(err?.response?.data?.error || 'Error al enviar la reseña');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const reviews      = provider?.reviews || [];
  const avgRating    = Number(provider?.average_rating || 0);
  const totalReviews = reviews.length;

  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => { if (r.rating >= 1 && r.rating <= 5) ratingCounts[r.rating - 1]++; });

  const isOwner = !!(user && provider && (user.id === provider.owner_id || user.role === 'admin'));
  const hasCoords = !!(provider?.location?.latitude && provider?.location?.longitude);

  // ── Tab pill shared style ────────────────────────────────────────────────────
  const tabCls = (active: boolean) =>
    `shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
      active
        ? 'bg-primary text-[#181611]'
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
    }`;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#f8f7f6] dark:bg-background-dark min-h-screen">
      <Navbar />

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-32 px-4">
          <span className="material-symbols-outlined text-5xl text-gray-400 mb-4 block">error</span>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <Link to="/talleres" className="text-primary font-bold hover:underline">
            Volver a talleres
          </Link>
        </div>
      )}

      {provider && !loading && (
        <>
          {/* ── Owner panel ──────────────────────────────────────────────────── */}
          {isOwner && (
            <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-4">
              <div className="rounded-xl border border-primary/20 dark:border-input-border-dark bg-primary/5 dark:bg-surface-dark px-4 py-3 flex flex-wrap items-center gap-3">
                <span className="material-symbols-outlined text-lg text-primary">storefront</span>
                <span className="text-sm font-semibold text-[#181611] dark:text-white shrink-0">Panel propietario:</span>

                {provider.is_open_override === null || provider.is_open_override === undefined ? (
                  <span className="text-xs text-gray-500 dark:text-gray-400">Usando horario programado</span>
                ) : provider.is_open_override ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-sm">circle</span>Abierto (manual)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-sm">circle</span>Cerrado (manual)
                  </span>
                )}

                <div className="flex gap-2 ml-auto flex-wrap">
                  {provider.is_open_override !== false && (
                    <button
                      onClick={() => handleStatusChange(false)}
                      disabled={statusLoading}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm align-middle mr-1">do_not_disturb_on</span>
                      Cerrar ahora
                    </button>
                  )}
                  {provider.is_open_override !== true && (
                    <button
                      onClick={() => handleStatusChange(true)}
                      disabled={statusLoading}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 dark:bg-green-500/10 dark:hover:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30 transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm align-middle mr-1">check_circle</span>
                      Abrir ahora
                    </button>
                  )}
                  {provider.is_open_override !== null && provider.is_open_override !== undefined && (
                    <button
                      onClick={() => handleStatusChange(null)}
                      disabled={statusLoading}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-elevated-dark dark:hover:bg-input-border-dark text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-input-border-dark transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm align-middle mr-1">schedule</span>
                      Usar horario
                    </button>
                  )}
                </div>

                {statusError && <p className="w-full text-xs text-red-500 mt-1">{statusError}</p>}
              </div>
            </div>
          )}

          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

            {/* ── Breadcrumbs (desktop) ──────────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 py-4">
              <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <Link to="/talleres" className="hover:text-primary transition-colors">Talleres</Link>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-gray-900 dark:text-white font-medium">{provider.name}</span>
            </div>

            {/* ── Hero image ─────────────────────────────────────────────── */}
            <div className="w-full aspect-video md:aspect-[21/9] bg-gray-200 dark:bg-elevated-dark rounded-xl overflow-hidden">
              <img
                src={HERO_IMAGES[provider.type] || HERO_IMAGES.shop}
                alt={provider.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* ── Name / rating / status header ──────────────────────────── */}
            <div className="py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="bg-primary/15 text-yellow-700 dark:text-yellow-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      {TYPE_LABELS[provider.type] || provider.type}
                    </span>
                    {provider.is_verified && (
                      <span className="flex items-center text-green-600 dark:text-green-400 text-[11px] font-bold gap-1">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        Verificado
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-gray-900 dark:text-white leading-tight mb-2">
                    {provider.name}
                  </h1>

                  {/* Rating + location + open badge */}
                  <div className="flex items-center gap-3 flex-wrap text-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-bold text-gray-900 dark:text-white">{avgRating.toFixed(1)}</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        ({totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'})
                      </span>
                    </div>
                    {provider.location && (
                      <>
                        <span className="text-gray-300 dark:text-gray-600">·</span>
                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">location_on</span>
                          {provider.location.city}
                        </span>
                      </>
                    )}
                    {provider.horarios && (() => {
                      const { open, opensAt } = isOpenNow(provider.horarios, provider.is_open_override);
                      return (
                        <>
                          <span className="text-gray-300 dark:text-gray-600">·</span>
                          <span className={`flex items-center gap-1 text-[12px] font-semibold ${open ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-green-500' : 'bg-red-500'}`} />
                            {open ? 'Abierto' : opensAt ? `Abre a las ${opensAt}` : 'Cerrado hoy'}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Edit button — desktop only */}
                {isOwner && (
                  <Link
                    to={`/taller/${id}/editar`}
                    className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-input-border-dark text-sm font-semibold text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors shrink-0"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Editar
                  </Link>
                )}
              </div>

              {/* ── Mobile quick actions ─────────────────────────────────── */}
              <div className="flex gap-2 mt-4 lg:hidden">
                {provider.phone && (
                  <a
                    href={`https://wa.me/${provider.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex flex-col items-center gap-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl py-3 border border-green-200 dark:border-green-800/50 transition-colors active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[22px]">chat</span>
                    <span className="text-[11px] font-semibold">WhatsApp</span>
                  </a>
                )}
                {provider.phone && (
                  <a
                    href={`tel:${provider.phone}`}
                    className="flex-1 flex flex-col items-center gap-1 bg-gray-100 dark:bg-elevated-dark text-gray-700 dark:text-gray-300 rounded-xl py-3 border border-gray-200 dark:border-input-border-dark transition-colors active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[22px]">call</span>
                    <span className="text-[11px] font-semibold">Llamar</span>
                  </a>
                )}
                <a
                  href={mapsUrl(provider)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex flex-col items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl py-3 border border-blue-100 dark:border-blue-800/50 transition-colors active:scale-95"
                >
                  <span className="material-symbols-outlined text-[22px]">directions</span>
                  <span className="text-[11px] font-semibold">Cómo llegar</span>
                </a>
                <Link
                  to={`/mapa?taller=${id}`}
                  className="flex-1 flex flex-col items-center gap-1 bg-primary/10 dark:bg-primary/15 text-primary rounded-xl py-3 border border-primary/20 transition-colors active:scale-95"
                >
                  <span className="material-symbols-outlined text-[22px]">map</span>
                  <span className="text-[11px] font-semibold">Ver mapa</span>
                </Link>
              </div>
            </div>

            {/* ── Sticky anchor nav ──────────────────────────────────────── */}
            <nav className="sticky top-16 z-30 -mx-4 px-4 bg-[#f8f7f6]/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-input-border-dark mb-6">
              <div className="flex items-center gap-1 py-2.5 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => scrollToId('info', 44)}
                  className={tabCls(activeSection === 'info')}
                >
                  Información
                </button>
                <button
                  onClick={() => scrollToId('resenas', 44)}
                  className={tabCls(activeSection === 'resenas')}
                >
                  Reseñas{totalReviews > 0 ? ` (${totalReviews})` : ''}
                </button>

                {/* Ver en mapa — desktop only, pushed to right */}
                {hasCoords && (
                  <Link
                    to={`/mapa?taller=${id}`}
                    className="hidden lg:flex items-center gap-1.5 ml-auto px-4 py-1.5 rounded-full text-sm font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-[#181611] border border-primary/20 transition-colors shrink-0"
                  >
                    <span className="material-symbols-outlined text-[15px]">map</span>
                    Ver en el mapa
                  </Link>
                )}
              </div>
            </nav>

            {/* ── Main 2-col grid ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-16">

              {/* ── SIDEBAR — first in HTML → first on mobile, last on desktop ── */}
              <div className="lg:col-span-1 order-first lg:order-last">
                <div className="lg:sticky lg:top-[112px] space-y-4">

                  {/* Mini mapa */}
                  {hasCoords && (
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-input-border-dark">
                      <Suspense fallback={
                        <div className="w-full bg-gray-100 dark:bg-elevated-dark rounded-xl flex items-center justify-center" style={{ height: 200 }}>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                        </div>
                      }>
                        <MiniMapa
                          lat={provider.location!.latitude!}
                          lng={provider.location!.longitude!}
                          name={provider.name}
                          height={200}
                        />
                      </Suspense>
                      <div className="border-t border-gray-200 dark:border-input-border-dark">
                        <a
                          href={mapsUrl(provider)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors bg-white dark:bg-card-dark"
                        >
                          <span className="material-symbols-outlined text-[16px]">directions</span>
                          Cómo llegar
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Contacto */}
                  <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-input-border-dark overflow-hidden">
                    <div className="p-5">
                      <h3 className="font-bold text-base mb-4">Contacto</h3>
                      <div className="space-y-3.5 mb-5">
                        {provider.location && (
                          <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-[18px] mt-0.5 shrink-0">location_on</span>
                            <div className="min-w-0">
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Dirección</p>
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                                {[provider.location.address, provider.location.city, provider.location.province].filter(Boolean).join(', ')}
                              </p>
                            </div>
                          </div>
                        )}
                        {provider.phone && (
                          <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-[18px] mt-0.5 shrink-0">call</span>
                            <div>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Teléfono</p>
                              <a href={`tel:${provider.phone}`} className="text-sm text-primary hover:underline font-medium">{provider.phone}</a>
                            </div>
                          </div>
                        )}
                        {provider.email && (
                          <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-[18px] mt-0.5 shrink-0">mail</span>
                            <div className="min-w-0">
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Email</p>
                              <a href={`mailto:${provider.email}`} className="text-sm text-primary hover:underline break-all">{provider.email}</a>
                            </div>
                          </div>
                        )}
                        {provider.website && (
                          <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-[18px] mt-0.5 shrink-0">language</span>
                            <div className="min-w-0">
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Web</p>
                              <a
                                href={provider.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline break-all"
                              >
                                {provider.website.replace(/^https?:\/\//, '')}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CTA buttons */}
                      {provider.phone && (
                        <div className="flex flex-col gap-2.5">
                          <a
                            href={`https://wa.me/${provider.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                          >
                            <span className="material-symbols-outlined text-[18px]">chat</span>
                            Enviar WhatsApp
                          </a>
                          <a
                            href={`tel:${provider.phone}`}
                            className="w-full bg-gray-100 dark:bg-elevated-dark hover:bg-gray-200 dark:hover:bg-input-border-dark text-gray-900 dark:text-white font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                          >
                            <span className="material-symbols-outlined text-[18px]">call</span>
                            Llamar
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Horarios */}
                  {provider.horarios && (() => {
                    const { open, opensAt } = isOpenNow(provider.horarios, provider.is_open_override);
                    const hoy = getDiaArgentina();
                    return (
                      <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-input-border-dark overflow-hidden">
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-base flex items-center gap-2">
                              <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                              Horarios
                            </h3>
                            <div className={`flex items-center gap-1.5 text-[11px] font-bold ${open ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-green-500' : 'bg-red-500'}`} />
                              {open ? 'Abierto ahora' : opensAt ? `Abre a las ${opensAt}` : 'Cerrado hoy'}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            {getHorariosSemana(provider.horarios).map(({ dia, label, horario }) => {
                              const isToday = dia === hoy;
                              return (
                                <div
                                  key={dia}
                                  className={`flex items-center justify-between text-sm py-0.5 ${
                                    isToday ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                                  }`}
                                >
                                  <span className={isToday ? 'text-primary' : ''}>{label}</span>
                                  <span className="text-right">
                                    {horario?.abre && horario?.cierra
                                      ? `${horario.abre} – ${horario.cierra}`
                                      : <span className="text-gray-400 dark:text-gray-600 text-xs font-normal">Cerrado</span>}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Verificado */}
                  {provider.is_verified && (
                    <div className="bg-primary/8 dark:bg-primary/10 rounded-xl p-4 border border-primary/20">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        <div>
                          <h4 className="font-bold text-sm mb-0.5">Certificado MotoFIX</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Este negocio cumple con nuestros estándares de calidad y transparencia.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Editar — mobile only */}
                  {isOwner && (
                    <Link
                      to={`/taller/${id}/editar`}
                      className="lg:hidden flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-300 dark:border-input-border-dark text-sm font-semibold text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                      Editar taller
                    </Link>
                  )}
                </div>
              </div>

              {/* ── MAIN CONTENT — second in HTML, first visually on desktop ── */}
              <div className="lg:col-span-2 order-last lg:order-first space-y-8">

                {/* ── Sección: Información ───────────────────────────────── */}
                <section id="info">
                  {provider.description && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Sobre el negocio</h2>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                        {provider.description}
                      </p>
                    </div>
                  )}

                  {provider.tags && provider.tags.length > 0 && (
                    <div>
                      <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Especialidades</h2>
                      <div className="flex flex-wrap gap-2">
                        {provider.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-card-dark border border-gray-200 dark:border-input-border-dark rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300"
                          >
                            <span className="material-symbols-outlined text-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>build</span>
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {!provider.description && (!provider.tags || provider.tags.length === 0) && (
                    <div className="bg-gray-50 dark:bg-card-dark rounded-xl p-8 text-center border border-gray-200 dark:border-input-border-dark">
                      <span className="material-symbols-outlined text-3xl text-gray-300 mb-2 block">info</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Este taller aún no completó su información.</p>
                    </div>
                  )}
                </section>

                <hr className="border-gray-200 dark:border-elevated-dark" />

                {/* ── Sección: Reseñas ──────────────────────────────────── */}
                <section id="resenas">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reseñas y opiniones</h2>
                    <button
                      onClick={() => {
                        if (!user) { navigate('/login'); return; }
                        setShowReviewForm(!showReviewForm);
                        if (!showReviewForm) setTimeout(() => scrollToId('resenas', 44), 50);
                      }}
                      className="bg-primary hover:bg-primary-hover text-[#181611] font-bold py-2 px-4 md:px-6 rounded-lg transition-colors flex items-center gap-1.5 text-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">rate_review</span>
                      <span className="hidden sm:inline">Dejar reseña</span>
                      <span className="sm:hidden">Reseñar</span>
                    </button>
                  </div>

                  {/* Formulario inline */}
                  {showReviewForm && (
                    <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-gray-200 dark:border-input-border-dark mb-8">
                      <h4 className="font-bold text-base mb-4">Tu reseña para {provider.name}</h4>

                      {reviewError && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
                          {reviewError}
                        </div>
                      )}

                      {/* Estrellas */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Calificación</p>
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
                                  star <= (reviewHover || reviewRating) ? 'text-primary' : 'text-gray-300 dark:text-gray-600'
                                }`}
                                style={star <= (reviewHover || reviewRating) ? { fontVariationSettings: "'FILL' 1" } : {}}
                              >
                                star
                              </span>
                            </button>
                          ))}
                          {(reviewHover || reviewRating) > 0 && (
                            <span className="ml-2 text-sm font-semibold text-primary">
                              {ratingLabels[reviewHover || reviewRating]}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Comentario */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Comentario</p>
                        <div className="relative">
                          <textarea
                            className="w-full rounded-lg border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark text-gray-900 dark:text-white text-sm p-3 resize-y min-h-[100px] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                            placeholder="Contá tu experiencia..."
                            rows={4}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value.slice(0, 500))}
                          />
                          <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                            {reviewComment.length}/500
                          </div>
                        </div>
                      </div>

                      {/* Tiempos */}
                      <div className="mb-5">
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                          Tiempos del trabajo <span className="text-xs font-normal">(opcional)</span>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { label: 'Tiempo estimado', icon: 'schedule', days: estDays, setDays: setEstDays, hours: estHours, setHours: setEstHours },
                            { label: 'Tiempo real',     icon: 'timer',    days: actDays, setDays: setActDays,  hours: actHours, setHours: setActHours },
                          ].map(({ label, icon, days, setDays, hours, setHours }) => (
                            <div key={label} className="bg-gray-50 dark:bg-elevated-dark rounded-lg p-3 border border-gray-200 dark:border-input-border-dark">
                              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">{icon}</span>
                                {label}
                              </p>
                              <div className="flex gap-2">
                                <select
                                  value={days}
                                  onChange={(e) => setDays(Number(e.target.value))}
                                  className="flex-1 rounded border border-gray-300 dark:border-input-border-dark bg-white dark:bg-card-dark text-sm py-1.5 px-2 focus:border-primary focus:outline-none"
                                >
                                  {Array.from({ length: 31 }, (_, i) => (
                                    <option key={i} value={i}>{i} {i === 1 ? 'día' : 'días'}</option>
                                  ))}
                                </select>
                                <select
                                  value={hours}
                                  onChange={(e) => setHours(Number(e.target.value))}
                                  className="flex-1 rounded border border-gray-300 dark:border-input-border-dark bg-white dark:bg-card-dark text-sm py-1.5 px-2 focus:border-primary focus:outline-none"
                                >
                                  {Array.from({ length: 24 }, (_, i) => (
                                    <option key={i} value={i}>{i} {i === 1 ? 'hora' : 'horas'}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex gap-3 justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setShowReviewForm(false);
                            setReviewRating(0); setReviewComment('');
                            setEstDays(0); setEstHours(0); setActDays(0); setActHours(0);
                            setReviewError(null);
                          }}
                          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          disabled={reviewSubmitting}
                          onClick={handleReviewSubmit}
                          className="bg-primary hover:bg-primary-hover text-[#181611] font-bold text-sm px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {reviewSubmitting ? 'Publicando...' : 'Publicar'}
                          {!reviewSubmitting && <span className="material-symbols-outlined text-[16px]">send</span>}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Resumen de rating */}
                  {totalReviews > 0 && (
                    <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-gray-200 dark:border-input-border-dark mb-6">
                      <div className="flex flex-col sm:flex-row gap-6 items-center">
                        <div className="flex flex-col items-center justify-center shrink-0">
                          <span className="text-5xl font-black text-gray-900 dark:text-white">{avgRating.toFixed(1)}</span>
                          <div className="flex text-primary my-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className="material-symbols-outlined text-[20px]"
                                style={{
                                  fontVariationSettings: `'FILL' ${star <= Math.round(avgRating) ? 1 : 0}`,
                                  color: star <= Math.round(avgRating) ? undefined : '#d1d5db',
                                }}
                              >
                                star
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            {totalReviews} {totalReviews === 1 ? 'opinión' : 'opiniones'}
                          </span>
                        </div>
                        <div className="flex-1 w-full space-y-1.5">
                          {[5, 4, 3, 2, 1].map((stars) => {
                            const count = ratingCounts[stars - 1];
                            const pct   = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                            return (
                              <div key={stars} className="flex items-center gap-3 text-sm">
                                <span className="font-bold w-3 text-gray-700 dark:text-gray-300">{stars}</span>
                                <div className="flex-1 h-2 bg-gray-200 dark:bg-elevated-dark rounded-full overflow-hidden">
                                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-gray-500 dark:text-gray-400 w-8 text-right text-xs">{pct}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sin reseñas */}
                  {totalReviews === 0 && !showReviewForm && (
                    <div className="bg-gray-50 dark:bg-card-dark rounded-xl p-12 text-center border border-gray-200 dark:border-input-border-dark">
                      <span className="material-symbols-outlined text-gray-300 text-5xl mb-3 block">chat_bubble</span>
                      <h4 className="font-bold text-base mb-1">Aún no hay reseñas</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Sé el primero en dejar tu opinión sobre este negocio.
                      </p>
                    </div>
                  )}

                  {/* Lista de reseñas */}
                  {totalReviews > 0 && (
                    <div className="space-y-5">
                      {reviews.map((review: ReviewData) => (
                        <div key={review.id} className="border-b border-gray-200 dark:border-elevated-dark pb-5 last:border-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                                style={{ backgroundColor: getColor(review.user.name) }}
                              >
                                {getInitials(review.user.name)}
                              </div>
                              <div>
                                <p className="font-bold text-sm text-gray-900 dark:text-white">{review.user.name}</p>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{timeAgo(review.created_at)}</span>
                              </div>
                            </div>
                            <StarRating rating={review.rating} />
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed ml-12">{review.comment}</p>
                          {(review.estimated_time || review.actual_time) && (
                            <div className="flex flex-wrap gap-2 mt-2.5 ml-12">
                              {review.estimated_time && (
                                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full">
                                  <span className="material-symbols-outlined text-sm">schedule</span>
                                  Estimado: {formatTime(review.estimated_time)}
                                </span>
                              )}
                              {review.actual_time && (
                                <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${
                                  review.estimated_time && review.actual_time > review.estimated_time
                                    ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                    : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
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
                </section>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
