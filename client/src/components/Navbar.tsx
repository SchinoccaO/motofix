import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:bg-background-dark dark:border-gray-800">
      <div className="px-4 md:px-8 lg:px-12 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-text-main dark:text-white">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-text-main">
                <span className="material-symbols-outlined">two_wheeler</span>
              </div>
              <h2 className="text-xl font-bold leading-tight tracking-tight">MotoYA</h2>
            </div>
          </Link>

          {/* Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <label className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-secondary">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="block w-full p-2.5 pl-10 text-sm text-text-main bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                placeholder="Buscar talleres, repuestos..."
                type="text"
              />
            </label>
          </div>

          {/* Right Menu */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-6">
              <a className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300" href="#">
                Talleres
              </a>
              <a className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300" href="#">
                Repuestos
              </a>
              <a className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300" href="#">
                Comunidad
              </a>
              <Link
                to="/registro-taller"
                className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300"
              >
                Registrar taller
              </Link>
              <Link
                to="/resena"
                className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300"
              >
                Dejar reseña
              </Link>
            </div>
            <button className="flex items-center justify-center px-4 py-2 text-sm font-bold bg-primary text-text-main rounded-lg hover:bg-opacity-90 transition-colors">
              Ingresar
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
