import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { forgotPassword } from '../services/api'

export default function OlvideContrasena() {
  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [sent, setSent]         = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) { setError('Ingresá tu email'); return }
    setError(null)
    setLoading(true)
    try {
      await forgotPassword(email.trim())
      setSent(true)
    } catch {
      setError('No se pudo procesar la solicitud. Intentá de nuevo.')
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

            {sent ? (
              <div className="text-center">
                <span className="material-symbols-outlined text-5xl text-green-500 mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>
                  mark_email_read
                </span>
                <h1 className="text-2xl font-bold mb-2">Revisá tu email</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  Si el email está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Volver al inicio de sesión
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-1">¿Olvidaste tu contraseña?</h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Ingresá tu email y te enviamos un enlace para crear una nueva.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email</label>
                    <input
                      type="email"
                      autoComplete="email"
                      className="w-full rounded-lg border border-gray-200 dark:border-input-border-dark bg-white dark:bg-elevated-dark px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-hover text-[#181611] font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#181611]/30 border-t-[#181611] rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">send</span>
                        Enviar enlace
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                    Volver al inicio de sesión
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
