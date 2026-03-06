import { createBrowserRouter, RouterProvider, Outlet, Link } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BuscarTalleres from "./pages/BuscarTalleres";
import MapaPage from "./pages/MapaPage";
import TallerProfile from "./pages/TallerProfile";
import RegistroTaller from "./pages/RegistroTaller";
import EditarTaller from "./pages/EditarTaller";
import ResenaForm from "./pages/ResenaForm";
import PerfilPublico from "./pages/PerfilPublico";
import MiPerfil from "./pages/MiPerfil";
import Seguridad from "./pages/Seguridad";
import SobreNosotros from "./pages/SobreNosotros";
import Blog from "./pages/Blog";
import Ayuda from "./pages/Ayuda";
import Terminos from "./pages/Terminos";
import Privacidad from "./pages/Privacidad";
import OlvideContrasena from "./pages/OlvideContrasena";
import RestablecerContrasena from "./pages/RestablecerContrasena";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

function NotFound() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#181611] dark:text-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">sentiment_dissatisfied</span>
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Esta página no existe.</p>
          <Link to="/" className="bg-primary hover:bg-primary-hover text-[#181611] font-bold px-6 py-3 rounded-lg transition-colors inline-block">
            Volver al inicio
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        { path: "/",                      element: <Home /> },
        { path: "/login",                 element: <Login /> },
        { path: "/register",              element: <Register /> },
        { path: "/talleres",              element: <BuscarTalleres /> },
        { path: "/mapa",                  element: <MapaPage /> },
        { path: "/taller/:id",            element: <TallerProfile /> },
        { path: "/registro-taller",       element: <RegistroTaller /> },
        { path: "/taller/:id/editar",     element: <EditarTaller /> },
        { path: "/taller/:id/resena",     element: <ResenaForm /> },
        { path: "/mi-perfil",             element: <MiPerfil /> },
        { path: "/mi-perfil/seguridad",   element: <Seguridad /> },
        { path: "/usuario/:id",           element: <PerfilPublico /> },
        { path: "/sobre-nosotros",        element: <SobreNosotros /> },
        { path: "/blog",                  element: <Blog /> },
        { path: "/ayuda",                 element: <Ayuda /> },
        { path: "/terminos",              element: <Terminos /> },
        { path: "/privacidad",            element: <Privacidad /> },
        { path: "/olvide-contrasena",     element: <OlvideContrasena /> },
        { path: "/restablecer-contrasena", element: <RestablecerContrasena /> },
        { path: "*",                       element: <NotFound /> },
      ],
    },
  ],
);

export default function App() {
  return <RouterProvider router={router} />;
}
