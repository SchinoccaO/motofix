// ─── EDITAR TALLER ────────────────────────────────────────────────────────────
// Ruta protegida: /taller/:id/editar  (solo owner o admin)
//
// Campos editables: description, phone, email, horarios, ubicación.
// La ubicación NO se actualiza directamente — genera un email de revisión.
// Campos no editables: name, type.

import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HorariosEditor, {
  type HorariosForm,
  horariosFromBackend,
  horariosToBackend,
  HORARIOS_INIT,
} from '../components/HorariosEditor';
import {
  getProviderById,
  getStoredToken,
  getStoredUser,
  requestLocationChange,
  updateProvider,
  type Provider,
} from '../services/api';
import type { LocationData } from '../components/SelectorUbicacion';

// SelectorUbicacion SIEMPRE lazy — ver MEMORY.md §MapLibre
const SelectorUbicacion = lazy(() => import('../components/SelectorUbicacion'));

// ─── Constantes ────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  shop: 'Taller Mecánico',
  mechanic: 'Mecánico Independiente',
  parts_store: 'Casa de Repuestos',
};

// Clases reutilizables — idénticas a RegistroTaller
const inputCls =
  'w-full rounded-lg border border-[#dbdce0] dark:border-input-border-dark ' +
  'bg-white dark:bg-elevated-dark px-4 py-3 text-sm text-[#181611] dark:text-white ' +
  'focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ' +
  'placeholder:text-gray-400';

const labelCls = 'text-sm font-medium text-[#181611] dark:text-gray-300';

// ─── Helper de errores ─────────────────────────────────────────────────────────

function extractApiError(err: unknown): string {
  const e = err as { response?: { data?: { details?: { msg: string }[]; error?: string } }; message?: string };
  if (e?.response?.data?.details?.length) return e.response.data.details.map(d => d.msg).join(' ');
  return e?.response?.data?.error || e?.message || 'Error desconocido.';
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function EditarTaller() {
  const { id }      = useParams<{ id: string }>();
  const navigate    = useNavigate();
  const token       = getStoredToken();
  const currentUser = getStoredUser();

  // ── Carga inicial ──────────────────────────────────────────────────────────
  const [provider,        setProvider]        = useState<Provider | null>(null);
  const [loadingProvider, setLoadingProvider] = useState(true);

  // ── Campos editables ───────────────────────────────────────────────────────
  const [description,     setDescription]     = useState('');
  const [phone,           setPhone]           = useState('');
  const [email,           setEmail]           = useState('');
  const [horarios,        setHorarios]        = useState<HorariosForm>(HORARIOS_INIT);
  const [location,        setLocation]        = useState<LocationData | null>(null);
  // Solo muestra el mapa si el owner activa explícitamente la opción de cambio
  const [cambiarUbicacion, setCambiarUbicacion] = useState(false);

  // ── Estado del submit ──────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [success,   setSuccess]   = useState<string | null>(null);

  // ── Cargar provider al montar ──────────────────────────────────────────────
  useEffect(() => {
    if (!token)  { navigate('/login'); return; }
    if (!id)     { navigate('/');      return; }

    getProviderById(Number(id))
      .then(p => {
        if (
          p.owner_id !== undefined &&
          currentUser &&
          p.owner_id !== currentUser.id &&
          currentUser.role !== 'admin'
        ) {
          navigate(`/taller/${id}`);
          return;
        }
        setProvider(p);
        setDescription(p.description || '');
        setPhone(p.phone || '');
        setEmail(p.email || '');
        setHorarios(horariosFromBackend(
          p.horarios as Record<string, { abre: string; cierra: string } | null> | null
        ));
        if (p.location?.latitude && p.location?.longitude) {
          setLocation({
            lat:            p.location.latitude,
            lng:            p.location.longitude,
            address:        p.location.address,
            displayAddress: p.location.address,
            city:           p.location.city,
            province:       p.location.province,
          });
        }
      })
      .catch(() => navigate('/'))
      .finally(() => setLoadingProvider(false));
  }, [id, token]);

  // ── handleSubmit ──────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !id) return;
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // 1. Actualizar campos básicos + horarios
      //    Pasamos type y name (no editables) para satisfacer validateCreateProvider.
      await updateProvider(Number(id), {
        type:        provider.type,
        name:        provider.name,
        description,
        phone,
        email,
        horarios: horariosToBackend(horarios) as Provider['horarios'],
      });

      // 2. Si el owner habilitó el cambio de ubicación y seleccionó una nueva
      if (cambiarUbicacion && location) {
        await requestLocationChange(Number(id), {
          newLat:      location.lat,
          newLng:      location.lng,
          newAddress:  location.address,
          newCity:     location.city,
          newProvince: location.province,
        });
        setSuccess('¡Datos actualizados! Tu solicitud de cambio de ubicación fue enviada para revisión (24 hs).');
      } else {
        setSuccess('¡Cambios guardados correctamente!');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Loading / guards ───────────────────────────────────────────────────────
  if (!token) return null;

  if (loadingProvider) {
    return (
      <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!provider) return null;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-[#181611] dark:text-white transition-colors duration-200 min-h-screen">
      <Navbar />

      <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-10">
        <div className="flex flex-col w-full max-w-[800px] bg-white dark:bg-card-dark rounded-xl shadow-sm border border-[#f4f3f0] dark:border-input-border-dark overflow-hidden">

          {/* ── Cabecera ────────────────────────────────────────────────────── */}
          <div className="px-8 pt-8 pb-4">
            <Link
              to={`/taller/${id}`}
              className="inline-flex items-center gap-1.5 text-sm text-[#887f63] dark:text-gray-400 hover:text-primary transition-colors mb-5"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Volver al perfil
            </Link>

            {/* Identidad del negocio (solo lectura) */}
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-primary/15 text-yellow-700 dark:text-yellow-400">
                {TYPE_LABELS[provider.type] || provider.type}
              </span>
              {provider.is_verified && (
                <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Verificado
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#181611] dark:text-white">
              {provider.name}
            </h1>
            <p className="mt-1 text-sm text-[#887f63] dark:text-gray-400">
              Editá los datos de tu negocio. El nombre y tipo no se pueden cambiar desde aquí.
            </p>
          </div>

          {/* Banner de éxito */}
          {success && (
            <div className="mx-8 mb-2 flex items-start gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3">
              <span className="material-symbols-outlined text-base shrink-0 mt-0.5">check_circle</span>
              <span>{success}</span>
            </div>
          )}

          <form className="flex flex-col gap-0 px-8 pb-8 pt-4" onSubmit={handleSubmit} noValidate>

            {/* ── Descripción ─────────────────────────────────────────────── */}
            <section className="grid gap-4 py-6">
              <h2 className="text-xl font-bold text-[#181611] dark:text-white">
                Descripción
              </h2>
              <div className="flex flex-col gap-2">
                <label className={labelCls}>
                  Describí tu negocio
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Contá qué servicios ofrecés, tu experiencia, especialidades, marcas que atendés..."
                  className={`${inputCls} resize-y min-h-[100px]`}
                />
              </div>
            </section>

            <div className="w-full h-px bg-[#f4f3f0] dark:bg-elevated-dark" />

            {/* ── Contacto ────────────────────────────────────────────────── */}
            <section className="grid gap-4 py-6">
              <h2 className="text-xl font-bold text-[#181611] dark:text-white">
                Contacto
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className={labelCls}>Teléfono</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+54 351 123 4567"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className={labelCls}>Email de contacto</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="contacto@tuempresa.com"
                    className={inputCls}
                  />
                </div>
              </div>
            </section>

            <div className="w-full h-px bg-[#f4f3f0] dark:bg-elevated-dark" />

            {/* ── Horarios ────────────────────────────────────────────────── */}
            <section className="grid gap-4 py-6">
              <div>
                <h2 className="text-xl font-bold text-[#181611] dark:text-white">
                  Horarios de atención
                </h2>
                <p className="text-sm text-[#887f63] dark:text-gray-400 mt-1">
                  Activá los días que atendés y configurá el horario de apertura y cierre.
                </p>
              </div>
              <HorariosEditor value={horarios} onChange={setHorarios} />
            </section>

            <div className="w-full h-px bg-[#f4f3f0] dark:bg-elevated-dark" />

            {/* ── Ubicación ───────────────────────────────────────────────── */}
            <section className="grid gap-4 py-6">
              <h2 className="text-xl font-bold text-[#181611] dark:text-white">
                Ubicación
              </h2>

              {/* Ubicación actual (siempre visible) */}
              {provider.location && (
                <div className="flex items-center gap-2 text-sm text-[#181611] dark:text-white bg-[#f8f7f6] dark:bg-surface-dark border border-[#f4f3f0] dark:border-input-border-dark rounded-lg px-3 py-2.5">
                  <span className="material-symbols-outlined text-base text-primary">location_on</span>
                  <span className="text-[#887f63] dark:text-gray-400 shrink-0">Actual:</span>
                  <span className="truncate">{provider.location.address}, {provider.location.city}</span>
                </div>
              )}

              {/* Checkbox opt-in para cambiar ubicación */}
              <label className="flex items-start gap-3 cursor-pointer select-none group">
                <div className="mt-0.5 relative">
                  <input
                    type="checkbox"
                    checked={cambiarUbicacion}
                    onChange={e => {
                      setCambiarUbicacion(e.target.checked);
                      if (!e.target.checked) setLocation(null);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 rounded border-2 border-gray-300 dark:border-input-border-dark
                    peer-checked:bg-primary peer-checked:border-primary
                    group-hover:border-primary/60 transition-colors flex items-center justify-center">
                    {cambiarUbicacion && (
                      <span className="material-symbols-outlined text-[14px] text-[#181611]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#181611] dark:text-white">
                    Quiero cambiar la ubicación del negocio
                  </p>
                  <p className="text-xs text-[#887f63] dark:text-gray-400 mt-0.5">
                    El cambio requiere revisión manual. Recibirás confirmación en 24 hs.
                  </p>
                </div>
              </label>

              {/* Mapa — solo si el usuario activó el checkbox */}
              {cambiarUbicacion && (
                <>
                  <Suspense
                    fallback={
                      <div className="h-72 rounded-xl bg-[#f4f3f0] dark:bg-elevated-dark animate-pulse flex items-center justify-center">
                        <span className="text-sm text-[#887f63] dark:text-gray-500">Cargando mapa...</span>
                      </div>
                    }
                  >
                    <SelectorUbicacion onLocationChange={setLocation} />
                  </Suspense>

                  {location ? (
                    <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg px-3 py-2">
                      <span className="material-symbols-outlined text-base shrink-0">pending</span>
                      <span>
                        Nueva ubicación en <strong>{location.city}</strong>
                        {location.province && location.province !== location.city && `, ${location.province}`}
                        {' — '}Se enviará para revisión al guardar.
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-[#887f63] dark:text-gray-400 bg-[#f8f7f6] dark:bg-surface-dark border border-[#f4f3f0] dark:border-input-border-dark rounded-lg px-3 py-2">
                      <span className="material-symbols-outlined text-base shrink-0">info</span>
                      <span>Buscá la dirección o mové el pin para confirmar la nueva ubicación.</span>
                    </div>
                  )}
                </>
              )}
            </section>

            <div className="w-full h-px bg-[#f4f3f0] dark:bg-elevated-dark" />

            {/* ── Error + Submit ───────────────────────────────────────────── */}
            <div className="pt-6 space-y-4">
              {error && (
                <div className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                  <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/taller/${id}`}
                  className="flex-1 rounded-xl border border-[#dbdce0] dark:border-input-border-dark text-[#181611] dark:text-white text-sm font-semibold py-3.5 px-6 text-center hover:bg-[#f4f3f0] dark:hover:bg-elevated-dark transition-colors"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 sm:flex-[2] rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-[#181611] text-base font-bold py-3.5 px-6 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">save</span>
                      Guardar cambios
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
