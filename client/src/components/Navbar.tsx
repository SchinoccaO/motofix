import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  const linkClass = (page: string) =>
    activePage === page
      ? "text-sm font-medium text-primary"
      : "text-sm font-medium hover:text-primary transition-colors";

  const mobileLinkClass = (page: string) =>
    activePage === page
      ? "block py-3 text-sm font-bold text-primary"
      : "block py-3 text-sm font-medium hover:text-primary transition-colors";

  return (
    <nav ref={menuRef} className="bg-white dark:bg-background-dark border-b border-[#f4f3f0] dark:border-elevated-dark sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Left: Logo + Links */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <Logo />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">MotoFIX</h2>
          </Link>
        </div>

        {/* Right: Nav links + User section + Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-6 mr-4">
            <Link to="/talleres" className={linkClass("talleres")}>Talleres y Repuestos</Link>
            <Link to="/registro-taller" className={linkClass("registro-taller")}>Registrar taller</Link>
          </div>
          {user ? (
            <>
              <Link to="/mi-perfil" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
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
                className="hidden sm:inline-flex text-sm font-bold px-4 py-2 rounded-lg border border-gray-300 dark:border-input-border-dark hover:bg-gray-100 dark:hover:bg-elevated-dark transition-colors"
              >
                Cerrar sesion
              </button>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/login" className="text-sm font-bold px-4 py-2 rounded-lg border border-gray-300 dark:border-input-border-dark hover:bg-gray-100 dark:hover:bg-elevated-dark transition-colors">
                Ingresar
              </Link>
              <Link to="/register" className="text-sm font-bold px-4 py-2 rounded-lg bg-primary hover:bg-[#d6aa28] text-[#181611] transition-colors">
                Registrarse
              </Link>
            </div>
          )}
          {/* Dark mode toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-elevated-dark hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label={dark ? "Modo claro" : "Modo oscuro"}
          >
            <span className="material-symbols-outlined text-[20px]">{dark ? "light_mode" : "dark_mode"}</span>
          </button>
          {/* Hamburger - always visible on mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-elevated-dark transition-colors"
            aria-label="Menu"
          >
            <span className="material-symbols-outlined text-[24px]">{menuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-[#f4f3f0] dark:border-elevated-dark bg-white dark:bg-background-dark px-4 py-2 shadow-lg">
          <Link to="/talleres" className={mobileLinkClass("talleres")} onClick={() => setMenuOpen(false)}>
            Talleres y Repuestos
          </Link>
          <Link to="/registro-taller" className={mobileLinkClass("registro-taller")} onClick={() => setMenuOpen(false)}>
            Registrar taller
          </Link>
          {user ? (
            <>
              <Link to="/mi-perfil" className={mobileLinkClass("mi-perfil")} onClick={() => setMenuOpen(false)}>
                Mi Perfil
              </Link>
              <div className="border-t border-[#f4f3f0] dark:border-elevated-dark mt-1 pt-1">
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="block w-full text-left py-3 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Cerrar sesion
                </button>
              </div>
            </>
          ) : (
            <div className="border-t border-[#f4f3f0] dark:border-elevated-dark mt-1 pt-3 pb-2 flex flex-col gap-2 sm:hidden">
              <Link
                to="/login"
                className="block text-center text-sm font-bold px-4 py-2.5 rounded-lg border border-gray-300 dark:border-input-border-dark hover:bg-gray-100 dark:hover:bg-elevated-dark transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className="block text-center text-sm font-bold px-4 py-2.5 rounded-lg bg-primary hover:bg-[#d6aa28] text-[#181611] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
