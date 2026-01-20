import { Routes, Route } from 'react-router-dom'  // Importa los componentes necesarios de react-router-dom
import Home from './pages/Home'               // Importa el componente de la página de inicio
import TallerProfile from './pages/TallerProfile'  // Importa el componente del perfil del taller
import RegistroTaller from './pages/RegistroTaller'   // Importa el componente de registro de taller
import ResenaForm from './pages/ResenaForm' // Importa el componente del formulario de reseña
import './App.css' // Importa los estilos globales

function App(): JSX.Element { // Componente principal de la aplicación
  return ( 
    <Routes> // Define las rutas de la aplicación
      <Route path="/" element={<Home />} />
      <Route path="/taller" element={<TallerProfile />} />
      <Route path="/registro-taller" element={<RegistroTaller />} />
      <Route path="/resena" element={<ResenaForm />} />
    </Routes>
  )
}

export default App
