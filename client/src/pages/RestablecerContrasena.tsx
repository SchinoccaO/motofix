import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { resetPassword } from '../services/api'

export default function RestablecerContrasena() {
  const [searchParams]          = useSearchParams()
  const navigate                = useNavigate()
  const token                   = searchParams.get('token') ?? ''

  const [password, setPassword]           = useState('')
  const [confirm, setConfirm]             = useState('')
  const [showPassword, setShowPassword]   = useState(false)
  const [loading, setLoading]             = useState(false)
  const [success, setSuccess]             = useState(false)
  const [error, setError]                 = useState<string | null>(null)

  useEffect(() => {
    if (!token) setError('Token inválido. Solicitá un nuevo enlace.')
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return }
    if (password !== confirm)  { setError('Las contraseñas no coinciden.'); return }
    setError(null)
    setLoading(true)
    try {
      await resetPassword(token, password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err: any) {
      setError(err?.response?.data?.error || 'El enlace es inválido o ya expiró. Solicitá uno nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#181611] dark:text-gray-100 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-input-border-dark p-8">

            {success ? (
              <div className="text-center">
                <span className="material-symbols-outlined text-5xl text-green-500 mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <h1 className="text-2xl font-bold mb-2">¡Contraseña actualizada!</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Ya podés iniciar sesión con tu nueva contraseña.
                </p>
                <p className="text-xs text-gray-400">Redirigiendo en 3 segundos...</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-1">Nueva contraseña</h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Elegí una contraseña segura de al menos 8 caracteres.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
                    {error}
                    {(error.includes('inválido') || error.includes('expiró')) && (
                      <div className="mt-2">
                        <Link to="/olvide-contrasena" className="font-semibold underline">
                          Solicitar nuevo enlace
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Nueva contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-gray-200 dark:border-input-border-dark bg-white dark:bg-elevated-dark px-4 py-3 pr-11 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="Mínimo 8 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(v => !v)}
                        tabIndex={-1}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Confirmar contraseña</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="w-full rounded-lg border border-gray-200 dark:border-input-border-dark bg-white dark:bg-elevated-dark px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="Repetí tu contraseña"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !token}
                    className="w-full bg-primary hover:bg-primary-hover text-[#181611] font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#181611]/30 border-t-[#181611] rounded-full animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                        Actualizar contraseña
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
