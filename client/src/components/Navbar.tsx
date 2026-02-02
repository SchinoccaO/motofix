import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Navbar() {
  return (
    <nav className="w-full bg-white dark:bg-card-dark border-b border-[#f4f3f0] dark:border-[#3f3b2e]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3">
            <Logo />
            <h2 className="text-[#181611] dark:text-white text-xl font-bold leading-tight tracking-tight">MotoFIX</h2>
          </Link>

          {/* Right Menu */}
          <div className="hidden md:flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#181611] dark:text-gray-200 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">
                Talleres
              </a>
              <a className="text-[#181611] dark:text-gray-200 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">
                Repuestos
              </a>
              <a className="text-[#181611] dark:text-gray-200 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">
                Comunidad
              </a>
              <Link
                to="/registro-taller"
                className="text-[#181611] dark:text-gray-200 text-sm font-medium leading-normal hover:text-primary transition-colors"
              >
                Registrar taller
              </Link>
            </div>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/20"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100")',
              }}
            ></div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-[#181611] dark:text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
