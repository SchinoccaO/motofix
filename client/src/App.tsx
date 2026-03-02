import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
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

import "./App.css";

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
      ],
    },
  ],
);

export default function App() {
  return <RouterProvider router={router} />;
}
