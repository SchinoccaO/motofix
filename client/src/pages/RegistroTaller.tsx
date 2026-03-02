import { useState, useEffect, lazy, Suspense } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import type { LocationData } from '../components/SelectorUbicacion'
const SelectorUbicacion = lazy(() => import('../components/SelectorUbicacion'))
import { createProvider, getStoredToken, getStoredUser } from '../services/api'

// ── Helpers ───────────────────────────────────────────────────────────────────

const TYPE_MAP = {
  taller:    'shop',
  mecanico:  'mechanic',
  repuestos: 'parts_store',
} as const

type FormType = keyof typeof TYPE_MAP

function extractApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data
    if (data?.details?.length) {
      return (data.details as { message: string }[]).map(d => d.message).join(' ')
    }
    return data?.error ?? 'Error al conectar con el servidor.'
  }
  return 'Ocurrió un error inesperado. Intentá de nuevo.'
}

// Copy dinámico según el tipo de negocio seleccionado
const COPY: Record<FormType, {
  nameLabel: string
  namePlaceholder: string
  descLabel: string
  descPlaceholder: string
  sectionTitle: string
}> = {
  taller: {
    nameLabel:       'Nombre del Negocio',
    namePlaceholder: 'Ej. MotoTaller Express',
    descLabel:       'Descripción del Taller',
    descPlaceholder: 'Describí tus servicios, especialidades y años de experiencia...',
    sectionTitle:    'Datos del Taller',
  },
  mecanico: {
    nameLabel:       'Nombre y Apellido Profesional',
    namePlaceholder: 'Ej. Juan Pérez',
    descLabel:       'Sobre tu Experiencia y Especialidad',
    descPlaceholder: 'Contá tu trayectoria, qué tipo de motos atendés y en qué te especializás...',
    sectionTitle:    'Datos del Mecánico',
  },
  repuestos: {
    nameLabel:       'Nombre del Local',
    namePlaceholder: 'Ej. Repuestos Moto Norte',
    descLabel:       'Descripción del Local',
    descPlaceholder: 'Describí tu catálogo, marcas disponibles y servicios adicionales...',
    sectionTitle:    'Datos del Local',
  },
}

// Clases reutilizables
const inputCls =
  'w-full rounded-lg border border-[#dbdce0] dark:border-input-border-dark bg-white dark:bg-elevated-dark px-4 py-3 text-sm text-[#181611] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400'

const labelCls = 'text-sm font-medium text-[#181611] dark:text-gray-300'

// ── Auth Guard — Empty State ──────────────────────────────────────────────────

function AuthGuard() {
  const { pathname } = useLocation()

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-[#181611] dark:text-white transition-colors duration-200 min-h-screen flex flex-col">
      <Navbar activePage="registro-taller" />
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center gap-6 max-w-sm w-full bg-white dark:bg-card-dark rounded-2xl border border-[#f4f3f0] dark:border-input-border-dark p-10 shadow-sm text-center">
          <div className="size-16 rounded-full bg-[#f4f3f0] dark:bg-elevated-dark flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-[#887f63] dark:text-gray-400">lock</span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xl font-bold text-[#181611] dark:text-white">Acceso restringido</p>
            <p className="text-sm text-[#887f63] dark:text-body-dark leading-relaxed">
              Para registrar tu negocio en MotoFIX necesitás tener una cuenta activa e iniciar sesión.
            </p>
          </div>
          <Link
            to="/login"
            state={{ from: pathname }}
            className="w-full rounded-xl bg-primary hover:bg-primary-hover text-[#181611] font-bold text-sm py-3 px-6 text-center transition-colors"
          >
            Iniciar Sesión
          </Link>
          <p className="text-xs text-[#887f63] dark:text-gray-500">
            ¿No tenés cuenta?{' '}
            <Link to="/registro" className="text-primary hover:underline font-medium">
              Creá una gratis
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RegistroTaller() {
  const navigate    = useNavigate()
  const isLoggedIn  = Boolean(getStoredToken())

  // Todos los hooks antes de cualquier return condicional (Rules of Hooks)
  const [formType,    setFormType]    = useState<FormType>('taller')
  const [name,        setName]        = useState('')
  const [phone,       setPhone]       = useState(() => getStoredUser()?.phone ?? '')
  const [email,       setEmail]       = useState(() => getStoredUser()?.email ?? '')
  const [description, setDescription] = useState('')
  const [sabOpen,     setSabOpen]     = useState(true)
  const [location,    setLocation]    = useState<LocationData | null>(null)
  const [terms,       setTerms]       = useState(false)
  const [isLoading,   setIsLoading]   = useState(false)
  const [error,       setError]       = useState<string | null>(null)

  // Prellenar "Nombre y Apellido Profesional" al cambiar a tipo mecánico
  useEffect(() => {
    if (formType === 'mecanico') {
      setName(prev => prev === '' ? (getStoredUser()?.name ?? '') : prev)
    }
  }, [formType])

  // Guard temprano: si no hay sesión activa, mostrar empty state
  if (!isLoggedIn) return <AuthGuard />

  const copy          = COPY[formType]
  const locationValid = location !== null
  const canSubmit    = (
    name.trim() !== '' &&
    phone.trim() !== '' &&
    email.trim() !== '' &&
    description.trim() !== '' &&
    locationValid &&
    terms &&
    !isLoading
  )

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim())        { setError('El nombre es obligatorio.'); return }
    if (!phone.trim())       { setError('El teléfono de contacto es obligatorio.'); return }
    if (!email.trim())       { setError('El correo electrónico es obligatorio.'); return }
    if (!description.trim()) { setError('La descripción es obligatoria.'); return }
    if (!locationValid)      { setError('Debés confirmar la ubicación en el mapa antes de continuar.'); return }
    if (!terms)              { setError('Debés aceptar los Términos y Condiciones para registrarte.'); return }

    setIsLoading(true)
    try {
      const provider = await createProvider({
        type:        TYPE_MAP[formType],
        name:        name.trim(),
        phone:       phone.trim(),
        email:       email.trim(),
        description: description.trim(),
        address:     location!.address,
        city:        location!.city,
        province:    location!.province,
        country:     'Argentina',
        latitude:    location!.lat,
        longitude:   location!.lng,
      })
      navigate(`/taller/${provider.id}`)
    } catch (err) {
      setError(extractApiError(err))
    } finally {
      setIsLoading(false)
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-[#181611] dark:text-white transition-colors duration-200 min-h-screen">
      <Navbar activePage="registro-taller" />

      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-10">
          <div className="layout-content-container flex flex-col max-w-[800px] flex-1 bg-white dark:bg-card-dark rounded-xl shadow-sm border border-[#f4f3f0] dark:border-input-border-dark overflow-hidden">

            {/* Page Heading */}
            <div className="p-8 pb-4">
              <p className="text-[#181611] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                Únete a MotoFIX
              </p>
              <p className="mt-2 text-[#887f63] dark:text-body-dark text-base font-normal leading-normal">
                Registrá tu taller o tienda y conectá con miles de motociclistas en tu zona.
              </p>
            </div>

            <form className="flex flex-col gap-6 p-8 pt-4" onSubmit={handleSubmit} noValidate>

              {/* ── Tipo de Negocio ──────────────────────────────────────────── */}
              <div>
                <h3 className="text-[#181611] dark:text-white text-xl font-bold leading-tight pb-4">
                  Tipo de Negocio
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  {([
                    { value: 'taller',    icon: 'build',  label: 'Taller Mecánico'   },
                    { value: 'mecanico',  icon: 'person', label: 'Mecánico Indep.'   },
                    { value: 'repuestos', icon: 'store',  label: 'Casa de Repuestos' },
                  ] as const).map(({ value, icon, label }) => (
                    <label key={value} className="flex-1 cursor-pointer relative">
                      <input
                        className="peer sr-only"
                        name="business_type"
                        type="radio"
                        value={value}
                        checked={formType === value}
                        onChange={() => setFormType(value)}
                      />
                      <div className="p-4 rounded-xl border-2 border-transparent bg-[#f4f3f0] dark:bg-elevated-dark hover:bg-gray-200 dark:hover:bg-elevated-dark peer-checked:border-primary peer-checked:bg-primary/5 transition-all flex flex-col items-center gap-2 text-center h-full justify-center">
                        <span className="material-symbols-outlined text-3xl text-[#887f63] dark:text-gray-400">{icon}</span>
                        <span className="text-sm font-medium text-[#181611] dark:text-gray-200">{label}</span>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 text-primary transition-opacity">
                        <span className="material-symbols-outlined text-xl filled">check_circle</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="w-full h-px bg-[#f4f3f0] dark:bg-elevated-dark" />

              {/* ── Datos del Negocio ────────────────────────────────────────── */}
              <div className="grid gap-6">
                <h3 className="text-[#181611] dark:text-white text-xl font-bold leading-tight">
                  {copy.sectionTitle}
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Nombre — label dinámico */}
                  <div className="flex flex-col gap-2">
                    <label className={labelCls}>
                      {copy.nameLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={inputCls}
                      placeholder={copy.namePlaceholder}
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* Teléfono — ahora requerido */}
                  <div className="flex flex-col gap-2">
                    <label className={labelCls}>
                      Teléfono de Contacto <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={inputCls}
                      placeholder="+54 351 123 4567"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Correo — ahora requerido */}
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>
                    Correo Electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={inputCls}
                    placeholder="contacto@tuempresa.com"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Selector de ubicación con mapa — lazy para mantener maplibre-gl fuera del bundle principal */}
                <Suspense fallback={
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-40 rounded bg-[#f4f3f0] dark:bg-elevated-dark animate-pulse" />
                    <div className="h-12 rounded-lg bg-[#f4f3f0] dark:bg-elevated-dark animate-pulse" />
                    <div className="h-64 md:h-80 rounded-xl bg-[#f4f3f0] dark:bg-elevated-dark animate-pulse" />
                  </div>
                }>
                  <SelectorUbicacion onLocationChange={setLocation} />
                </Suspense>

                {/* Feedback de coordenadas — verde si confirmado, amarillo si pendiente */}
                {locationValid ? (
                  <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2 -mt-3">
                    <span className="material-symbols-outlined text-base shrink-0">check_circle</span>
                    <span>
                      Ubicación confirmada en{' '}
                      <strong>{location.city || 'coordenadas'}</strong>
                      {location.province && location.province !== location.city && `, ${location.province}`}
                      {' — '}lat {location.lat.toFixed(5)}, lng {location.lng.toFixed(5)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg px-3 py-2 -mt-3">
                    <span className="material-symbols-outlined text-base shrink-0">location_on</span>
                    <span>Buscá tu dirección o mové el pin para confirmar la ubicación. <strong>Campo obligatorio.</strong></span>
                  </div>
                )}
              </div>

              <div className="w-full h-px bg-[#f4f3f0] dark:bg-elevated-dark" />

              {/* ── Descripción y Horarios ───────────────────────────────────── */}
              <div className="grid gap-6">
                <h3 className="text-[#181611] dark:text-white text-xl font-bold leading-tight">
                  Detalles y Horarios
                </h3>

                {/* Descripción — label dinámico + ahora requerida */}
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>
                    {copy.descLabel} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-[#dbdce0] dark:border-input-border-dark bg-white dark:bg-elevated-dark px-4 py-3 text-sm text-[#181611] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 resize-y min-h-[120px]"
                    placeholder={copy.descPlaceholder}
                    rows={5}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 p-4 rounded-lg bg-[#f8f7f6] dark:bg-surface-dark border border-[#f4f3f0] dark:border-input-border-dark">
                    <span className="text-sm font-semibold text-[#181611] dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">calendar_today</span>
                      Lunes a Viernes
                    </span>
                    <div className="flex gap-2 items-center mt-2">
                      <input
                        className="flex-1 rounded-md border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark p-2 text-sm dark:text-white"
                        type="time"
                        defaultValue="09:00"
                      />
                      <span className="text-gray-400">–</span>
                      <input
                        className="flex-1 rounded-md border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark p-2 text-sm dark:text-white"
                        type="time"
                        defaultValue="18:00"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 p-4 rounded-lg bg-[#f8f7f6] dark:bg-surface-dark border border-[#f4f3f0] dark:border-input-border-dark">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-[#181611] dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">weekend</span>
                        Sábados
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          className="rounded text-primary focus:ring-primary bg-white dark:bg-elevated-dark border-gray-300 dark:border-input-border-dark"
                          type="checkbox"
                          checked={sabOpen}
                          onChange={(e) => setSabOpen(e.target.checked)}
                        />
                        <span className="text-xs text-gray-500">Abierto</span>
                      </label>
                    </div>
                    <div className="flex gap-2 items-center mt-2">
                      <input
                        className="flex-1 rounded-md border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark p-2 text-sm dark:text-white disabled:opacity-40"
                        type="time"
                        defaultValue="09:00"
                        disabled={!sabOpen}
                      />
                      <span className="text-gray-400">–</span>
                      <input
                        className="flex-1 rounded-md border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark p-2 text-sm dark:text-white disabled:opacity-40"
                        type="time"
                        defaultValue="13:00"
                        disabled={!sabOpen}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-[#f4f3f0] dark:bg-elevated-dark" />

              {/* ── Fotos del Local ──────────────────────────────────────────── */}
              <div>
                <h3 className="text-[#181611] dark:text-white text-xl font-bold leading-tight mb-4">
                  Fotos del Local
                </h3>
                <div className="border-2 border-dashed border-[#dbdce0] dark:border-input-border-dark rounded-xl p-8 flex flex-col items-center justify-center bg-[#f8f7f6] dark:bg-surface-dark hover:bg-[#f4f3f0] dark:hover:bg-elevated-dark transition-colors cursor-pointer group">
                  <div className="size-12 rounded-full bg-white dark:bg-elevated-dark shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl text-primary">add_a_photo</span>
                  </div>
                  <p className="text-sm font-medium text-[#181611] dark:text-white mb-1">
                    Hacé clic o arrastrá fotos aquí
                  </p>
                  <p className="text-xs text-[#887f63] dark:text-gray-400">
                    JPG, PNG hasta 5MB (mínimo 1 foto de fachada)
                  </p>
                </div>
              </div>

              {/* ── Submit ───────────────────────────────────────────────────── */}
              <div className="pt-2">
                <label className="flex items-start gap-3 mb-6 cursor-pointer">
                  <input
                    className="mt-1 rounded border-gray-300 text-primary focus:ring-primary bg-white dark:bg-elevated-dark"
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                  />
                  <span className="text-sm text-[#887f63] dark:text-body-dark leading-normal">
                    Confirmo que la información proporcionada es real y acepto los{' '}
                    <Link
                      to="/terminos"
                      className="text-[#181611] dark:text-white underline font-medium hover:text-primary"
                    >
                      Términos y Condiciones
                    </Link>{' '}
                    de MotoFIX.
                  </span>
                </label>

                {/* Error banner */}
                {error && (
                  <div className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 mb-4">
                    <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Hint si el botón está bloqueado por la ubicación */}
                {!locationValid && !error && (
                  <p className="text-xs text-[#887f63] dark:text-gray-500 text-center mb-3">
                    Completá todos los campos y confirmá la ubicación en el mapa para habilitar el botón.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-[#181611] text-base font-bold text-center py-4 px-6 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                      Registrando...
                    </>
                  ) : (
                    'Registrar Mi Negocio'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
