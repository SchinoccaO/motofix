# MotoYA

Plataforma web full-stack para conectar motociclistas con talleres mecánicos certificados. Sistema de reseñas, reputación y búsqueda de servicios.

## Stack Técnico

**Frontend:**
- React 18 + TypeScript
- React Router 6
- Tailwind CSS
- Vite
- Axios

**Backend:**
- Node.js + Express
- MySQL + Sequelize ORM
- JWT (autenticación)
- bcryptjs
- express-validator

## Estructura del Proyecto

```
motoya/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Navbar, Footer, Icon, Logo
│   │   ├── pages/         # Home, TallerProfile, RegistroTaller, ResenaForm
│   │   └── services/      # API services
│   └── package.json
│
├── server/                 # Backend Express
│   ├── src/
│   │   ├── config/        # database.js
│   │   ├── models/        # User, Taller, Resena (Sequelize)
│   │   ├── controllers/   # Lógica de negocio
│   │   ├── routes/        # Endpoints API
│   │   └── middlewares/   # auth, validators
│   └── package.json
│
└── database/              # SQL scripts y migrations
```

## Instalación

```bash
# Instalar dependencias
npm install
cd client && npm install
cd ../server && npm install
```

## Desarrollo

```bash
# Iniciar cliente (puerto 3000)
cd client
npm run dev

# Iniciar servidor (puerto 5001)
cd server
npm run dev

# Ejecutar ambos con concurrently
npm run dev
```

## Funcionalidades Principales

- 🔐 Autenticación de usuarios (JWT)
- 🏪 Registro y gestión de talleres
- ⭐ Sistema de reseñas y ratings
- 🔍 Búsqueda y filtrado de talleres
- 📸 Upload de imágenes
- 📊 Dashboard para propietarios de talleres

## API Endpoints (Planificados)

```
POST   /api/auth/register      - Registro de usuario
POST   /api/auth/login         - Login
GET    /api/talleres           - Listar talleres
GET    /api/talleres/:id       - Detalle de taller
POST   /api/talleres           - Crear taller (auth)
PUT    /api/talleres/:id       - Actualizar taller (auth)
DELETE /api/talleres/:id       - Eliminar taller (auth)
POST   /api/resenas            - Crear reseña (auth)
GET    /api/resenas/:tallerId  - Reseñas de un taller
```

## Estado del Proyecto

- ✅ Estructura de proyecto configurada
- ✅ Frontend React con TypeScript funcionando
- ✅ Backend Express configurado
- ✅ Sequelize + MySQL configurado
- ✅ 4 páginas principales creadas
- ⏳ Modelos de base de datos (en progreso)
- ⏳ Autenticación JWT (pendiente)
- ⏳ API REST (pendiente)
- ⏳ Integración frontend-backend (pendiente)

## Licencia

UNLICENSED - Proyecto privado

## 🤝 Contribución

Este proyecto está en desarrollo activo. Para contribuir:
1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Proyecto en desarrollo - Derechos reservados (2026)
