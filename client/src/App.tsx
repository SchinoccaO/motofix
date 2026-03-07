import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Link } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";

const Login              = lazy(() => import("./pages/Login"));
const Register           = lazy(() => import("./pages/Register"));
const BuscarTalleres     = lazy(() => import("./pages/BuscarTalleres"));
const MapaPage           = lazy(() => import("./pages/MapaPage"));
const TallerProfile      = lazy(() => import("./pages/TallerProfile"));
const RegistroTaller     = lazy(() => import("./pages/RegistroTaller"));
const EditarTaller       = lazy(() => import("./pages/EditarTaller"));
const ResenaForm         = lazy(() => import("./pages/ResenaForm"));
const PerfilPublico      = lazy(() => import("./pages/PerfilPublico"));
const MiPerfil           = lazy(() => import("./pages/MiPerfil"));
const Seguridad          = lazy(() => import("./pages/Seguridad"));
const SobreNosotros      = lazy(() => import("./pages/SobreNosotros"));
const Blog               = lazy(() => import("./pages/Blog"));
const Ayuda              = lazy(() => import("./pages/Ayuda"));
const Terminos           = lazy(() => import("./pages/Terminos"));
const Privacidad         = lazy(() => import("./pages/Privacidad"));
const OlvideContrasena   = lazy(() => import("./pages/OlvideContrasena"));
const RestablecerContrasena = lazy(() => import("./pages/RestablecerContrasena"));
const AdminPanel         = lazy(() => import("./pages/AdminPanel"));

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
    </div>
  );
}

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
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
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
        { path: "/admin",                  element: <AdminPanel /> },
        { path: "*",                       element: <NotFound /> },
      ],
    },
  ],
);

export default function App() {
  return <RouterProvider router={router} />;
}
