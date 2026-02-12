import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { getStoredUser, logout, type AuthUser } from "../services/api";

const COLORS = ["#E53E3E", "#DD6B20", "#38A169", "#3182CE", "#805AD5", "#D53F8C"];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

interface NavbarProps {
  activePage?: "home" | "talleres" | "registro-taller" | "mi-perfil" | "seguridad";
}

export default function Navbar({ activePage }: NavbarProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  const linkClass = (page: string) =>
    activePage === page
      ? "text-sm font-medium text-primary"
      : "text-sm font-medium hover:text-primary transition-colors";

  return (
    <nav className="bg-white dark:bg-background-dark border-b border-[#f4f3f0] dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Left: Logo + Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3">
            <Logo />
            <h2 className="text-xl font-bold tracking-tight">MotoFIX</h2>
          </Link>
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/talleres" className={linkClass("talleres")}>Talleres</Link>
            <Link to="/registro-taller" className={linkClass("registro-taller")}>Registrar taller</Link>
          </div>
        </div>

        {/* Right: User section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/mi-perfil" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                <span className="text-sm font-medium text-[#5c584a] dark:text-gray-300 hidden sm:inline">
                  {user.name.split(" ")[0]}
                </span>
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: user.avatar_url ? undefined : getColor(user.name) }}
                >
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex text-sm font-bold px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cerrar sesion
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">{menuOpen ? "close" : "menu"}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-bold px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Ingresar
              </Link>
              <Link to="/register" className="text-sm font-bold px-4 py-2 rounded-lg bg-primary hover:bg-[#d6aa28] text-[#181611] transition-colors">
                Registrarse
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">{menuOpen ? "close" : "menu"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-[#f4f3f0] dark:border-gray-800 bg-white dark:bg-background-dark px-4 py-3 space-y-2">
          <Link to="/talleres" className="block py-2 text-sm font-medium hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>
            Talleres
          </Link>
          <Link to="/registro-taller" className="block py-2 text-sm font-medium hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>
            Registrar taller
          </Link>
          {user && (
            <>
              <Link to="/mi-perfil" className="block py-2 text-sm font-medium hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>
                Mi Perfil
              </Link>
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="block w-full text-left py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Cerrar sesion
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
