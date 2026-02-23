import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getStoredUser, getProviderById, createReview, type AuthUser, type Provider } from '../services/api'

export default function ResenaForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [user, setUser] = useState<AuthUser | null>(null)
  const [provider, setProvider] = useState<Provider | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form state
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')

  const ratingLabels = ['', 'Muy mala', 'Mala', 'Regular', 'Buena', 'Excelente']

  useEffect(() => {
    setUser(getStoredUser())
  }, [])

  useEffect(() => {
    if (!id) return
    getProviderById(Number(id))
      .then(setProvider)
      .catch(() => setError('No se pudo cargar el negocio'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async () => {
    if (!user) {
      navigate(`/login`)
      return
    }

    if (rating === 0) {
      setError('Selecciona una calificacion')
      return
    }

    if (!comment.trim()) {
      setError('Escribe un comentario')
      return
    }

    setError(null)
    setSubmitting(true)

    try {
      await createReview(Number(id), rating, comment.trim())
      setSuccess(true)
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Error al enviar la resena'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-[#181611] dark:text-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <span className="material-symbols-outlined text-5xl text-gray-400 mb-4 block">lock</span>
            <h2 className="text-2xl font-bold mb-2">Inicia sesion para dejar tu resena</h2>
            <p className="text-gray-500 mb-6">Necesitas una cuenta para calificar negocios.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/login" className="bg-primary hover:bg-[#d6aa28] text-[#181611] font-bold px-6 py-3 rounded-lg transition-colors">
                Iniciar sesion
              </Link>
              <Link to="/register" className="border border-gray-300 hover:bg-gray-100 font-bold px-6 py-3 rounded-lg transition-colors">
                Registrarse
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (success) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-[#181611] dark:text-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <span className="material-symbols-outlined text-5xl text-green-500 mb-4 block">check_circle</span>
            <h2 className="text-2xl font-bold mb-2">Resena publicada</h2>
            <p className="text-gray-500 mb-6">Gracias por compartir tu experiencia con la comunidad motera.</p>
            <Link
              to={`/taller/${id}`}
              className="bg-primary hover:bg-[#d6aa28] text-[#181611] font-bold px-6 py-3 rounded-lg transition-colors inline-block"
            >
              Volver al perfil
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#181611] dark:text-gray-100 min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex justify-center py-8 px-4 sm:px-6">
        <div className="w-full max-w-[640px]">
          {/* Back button */}
          <div className="mb-6 flex items-center gap-2">
            <Link
              to={id ? `/taller/${id}` : '/talleres'}
              className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-primary transition-colors dark:text-gray-400"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              Volver al taller
            </Link>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          )}

          {!loading && provider && (
            <main className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-[#f4f3f0] dark:border-input-border-dark overflow-hidden">
              {/* PageHeading */}
              <div className="p-6 md:p-8 pb-4">
                <div className="flex flex-col gap-2">
                  <h1 className="text-[#181611] dark:text-white tracking-tight text-[32px] font-bold leading-tight">
                    Escribe tu resena
                  </h1>
                  <p className="text-[#887f63] dark:text-gray-400 text-sm font-normal leading-normal flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">storefront</span>
                    Estas calificando a{' '}
                    <span className="font-semibold text-[#181611] dark:text-gray-200">{provider.name}</span>
                  </p>
                </div>
              </div>

              {error && (
                <div className="mx-6 md:mx-8 mb-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
                {/* Rating Section */}
                <div className="px-6 md:px-8 py-4">
                  <h2 className="text-[#181611] dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em] pb-3">
                    Como fue tu experiencia?
                  </h2>
                  <div className="flex gap-2 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className="group focus:outline-none transition-transform active:scale-95"
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                      >
                        <span
                          className={`material-symbols-outlined text-4xl transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'text-primary filled'
                              : 'text-gray-300 dark:text-gray-600 hover:text-primary/50'
                          }`}
                          style={star <= (hoverRating || rating) ? { fontVariationSettings: "'FILL' 1" } : {}}
                        >
                          star
                        </span>
                      </button>
                    ))}
                    {(hoverRating || rating) > 0 && (
                      <span className="ml-3 text-sm font-medium text-primary">
                        {ratingLabels[hoverRating || rating]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-elevated-dark mx-8 my-2"></div>

                {/* Comments Section */}
                <div className="px-6 md:px-8 py-4 pb-6">
                  <h2 className="text-[#181611] dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em] pb-3">
                    Tu opinion
                  </h2>
                  <div className="relative">
                    <textarea
                      className="w-full rounded-lg border-gray-300 dark:border-input-border-dark bg-white dark:bg-card-dark text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary text-sm p-3 resize-y min-h-[120px]"
                      placeholder="Conta mas detalles sobre el servicio, la atencion y el precio..."
                      rows={6}
                      value={comment}
                      onChange={(e) => setComment(e.target.value.slice(0, 500))}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">{comment.length}/500</div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 md:px-8 py-6 bg-gray-50 dark:bg-surface-dark border-t border-[#f4f3f0] dark:border-input-border-dark flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                  <Link
                    to={`/taller/${id}`}
                    className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-4 py-2"
                  >
                    Cancelar
                  </Link>
                  <button
                    className="w-full sm:w-auto bg-primary hover:bg-[#d6aa28] text-[#181611] font-bold text-sm px-8 py-3 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmit}
                  >
                    <span>{submitting ? 'Publicando...' : 'Publicar Resena'}</span>
                    {!submitting && <span className="material-symbols-outlined text-[18px] font-bold">send</span>}
                  </button>
                </div>
              </form>
            </main>
          )}

          {!loading && !provider && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-5xl text-gray-400 mb-4 block">error</span>
              <p className="text-gray-500">No se encontro el negocio.</p>
            </div>
          )}

          {/* Trust Indicator */}
          <div className="mt-6 flex justify-center items-center gap-2 text-xs text-gray-400">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>Tu resena ayuda a miles de motociclistas a elegir mejor.</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
