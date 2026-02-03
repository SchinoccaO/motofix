# 🏍️ MotoYA - Plataforma de Talleres para Motociclistas

Plataforma web que conecta motociclistas con talleres de confianza en Argentina.

> **📚 PARA APRENDER:** Este proyecto incluye documentación completa con comentarios explicativos en todo el código.  
> 👉 **Comienza leyendo:** [`README_DOCUMENTACION.md`](README_DOCUMENTACION.md) para ver el índice completo de recursos educativos.

---

## 🎓 RECURSOS DE APRENDIZAJE

Si estás aprendiendo a programar, este proyecto incluye:

| Archivo                                              | Descripción                          |
| ---------------------------------------------------- | ------------------------------------ |
| [`README_DOCUMENTACION.md`](README_DOCUMENTACION.md) | 📖 Índice completo + plan de estudio |
| [`GUIA_APRENDIZAJE.md`](GUIA_APRENDIZAJE.md)         | 📘 Conceptos básicos y arquitectura  |
| [`DIAGRAMAS_FLUJOS.md`](DIAGRAMAS_FLUJOS.md)         | 📊 Diagramas visuales del sistema    |
| [`EJEMPLOS_PRACTICOS.md`](EJEMPLOS_PRACTICOS.md)     | 💻 Código de ejemplo paso a paso     |

**Además:** Todo el código fuente está comentado línea por línea para facilitar el aprendizaje.

---

## 📁 Estructura del Proyecto

```
MOTOYA/
├── client/                     # 🎨 Frontend - React + TypeScript + Vite
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── Navbar.tsx     # Barra de navegación superior
│   │   │   ├── Footer.tsx     # Pie de página
│   │   │   ├── Icon.tsx       # Componente de iconos
│   │   │   └── Logo.tsx       # Logo de la aplicación
│   │   ├── pages/             # Páginas/Rutas principales
│   │   │   ├── Home.tsx       # Página de inicio
│   │   │   ├── BuscarTalleres.tsx  # Búsqueda y listado de talleres
│   │   │   ├── TallerProfile.tsx   # Perfil detallado de un taller
│   │   │   ├── RegistroTaller.tsx  # Formulario de registro de taller
│   │   │   └── ResenaForm.tsx      # Formulario para dejar reseñas
│   │   ├── assets/            # Imágenes, iconos estáticos
│   │   │   └── icons/         # Iconos personalizados
│   │   ├── App.tsx            # Configuración de rutas (React Router)
│   │   ├── main.tsx           # Entry point de React
│   │   ├── App.css            # Estilos globales
│   │   └── index.css          # Estilos base + Tailwind
│   ├── public/                # Assets públicos
│   │   └── assets/
│   ├── index.html             # HTML base
│   ├── package.json           # Dependencias frontend
│   ├── vite.config.ts         # Configuración de Vite
│   ├── tsconfig.json          # Configuración TypeScript
│   ├── tailwind.config.js     # Configuración Tailwind CSS
│   └── postcss.config.js      # PostCSS config
│
├── server/                     # 🚀 Backend - Node.js + Express + MySQL (XAMPP)
│   ├── src/
│   │   ├── config/            # Configuración de la aplicación
│   │   │   ├── config.js      # Config general (COMENTADO)
│   │   │   └── db.js          # Conexión a MySQL (COMENTADO)
│   │   ├── controllers/       # Lógica de negocio
│   │   │   └── authController.js  # (COMENTADO LÍNEA POR LÍNEA)
│   │   ├── middlewares/       # Middlewares Express
│   │   │   └── auth.js        # Autenticación JWT (COMENTADO)
│   │   ├── models/            # Modelos de Sequelize ORM
│   │   │   ├── index.js       # Configuración modelos
│   │   │   ├── UserModel.js   # Modelo Usuario (COMENTADO)
│   │   │   ├── TallerModel.js # Modelo Taller (COMENTADO)
│   │   │   └── ResenaModel.js # Modelo Reseña (COMENTADO)
│   │   ├── routes/            # Rutas de la API REST
│   │   │   └── authRoutes.js  # Rutas de autenticación
│   │   ├── scripts/           # Scripts de utilidad
│   │   │   ├── seed.js        # Sembrar datos de prueba
│   │   │   ├── setup-mysql-admin.ps1  # Setup XAMPP MySQL
│   │   │   └── test-connection.js     # Test conexión BD
│   │   └── index.js           # Entry point del servidor Express
│   ├── package.json           # Dependencias backend
│   ├── .env                   # Variables de entorno (NO subir a Git)
│   ├── .env.example           # Plantilla de variables
│   └── .sequelizerc           # Config Sequelize CLI
│
├── database/                   # 📊 Scripts de Base de Datos MySQL
│   ├── schema.sql             # Estructura de tablas
│   └── seeds.sql              # Datos iniciales
│
├── .gitignore                  # Archivos ignorados por Git
└── README.md                   # Este archivo
```

## 🚀 Instalación y Configuración

### Requisitos Previos

- **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- **XAMPP** (para MySQL) - [Descargar](https://www.apachefriends.org/es/index.html)
- **Git** - [Descargar](https://git-scm.com/)

### 1. Clonar el repositorio

```bash
git clone https://github.com/SchinoccaO/motofix.git
cd MOTOYA
```

### 2. Configurar Base de Datos MySQL (XAMPP)

#### a) Iniciar XAMPP

1. Abre el Panel de Control de XAMPP
2. Inicia el servicio **MySQL** (puerto por defecto: 3306)
3. Inicia **Apache** (opcional, para usar phpMyAdmin)

#### b) Crear la Base de Datos

Opción 1 - **phpMyAdmin** (recomendado):

1. Abre tu navegador: `http://localhost/phpmyadmin`
2. Crea una nueva base de datos llamada `motoya_db`
3. Importa el archivo `database/schema.sql`
4. (Opcional) Importa `database/seeds.sql` para datos de prueba

Opción 2 - **Línea de comandos**:

```bash
# Desde la raíz del proyecto MOTOYA
cd database
mysql -u root -p < schema.sql
mysql -u root -p < seeds.sql
```

### 3. Configurar el Backend (Node.js + Express)

```bash
# Navegar a la carpeta del servidor
cd server

# Instalar dependencias
npm install
```

#### Configurar variables de entorno

Crea un archivo `.env` en la carpeta `server/` basado en `.env.example`:

```env
# Configuración Base de Datos (XAMPP MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=          # Dejar vacío si no tienes password en XAMPP
DB_NAME=motoya_db

# Servidor
PORT=3000
NODE_ENV=development

# Autenticación
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion
JWT_EXPIRE=7d
```

#### Probar conexión a la base de datos

```bash
node src/scripts/test-connection.js
```

Si la conexión es exitosa, verás: ✅ Conexión exitosa a MySQL

#### Iniciar el servidor backend

```bash
npm run dev
```

El servidor estará disponible en: **`http://localhost:3000`**

### 4. Configurar el Frontend (React + Vite)

**⚠️ IMPORTANTE: Debes estar en la carpeta `client` para iniciar el frontend**

```bash
# Desde la raíz del proyecto MOTOYA
cd client

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: **`http://localhost:5173`**

### ✅ Verificación Final

Si todo está correcto, deberías poder:

1. ✅ Acceder a `http://localhost:5173` y ver la página principal
2. ✅ Navegar a `/talleres` y ver el listado de talleres
3. ✅ Click en "Ver Perfil" y ver el detalle de un taller
4. ✅ El backend responde en `http://localhost:3000`

---

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React 18** - Framework UI
- **TypeScript** - Tipado estático y mejor DX
- **Vite** - Build tool ultrarrápido
- **TailwindCSS** - Framework de estilos utility-first
- **React Router v6** - Navegación SPA

### Backend

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web minimalista
- **MySQL** (via XAMPP) - Base de datos relacional
- **Sequelize** - ORM para MySQL
- **JWT** - Autenticación basada en tokens
- **bcrypt** - Hash de contraseñas

### Base de Datos

- **MySQL 8.0+** (gestionado por XAMPP)
- Tablas principales:
  - `usuarios` - Datos de usuarios
  - `talleres` - Información de talleres
  - `resenas` - Reseñas y calificaciones
  - `servicios` - Servicios ofrecidos

---

## 📝 Scripts Disponibles

### Frontend (`client/`)

**UBICACIÓN:** Debes estar en `cd client` para ejecutar estos comandos

```bash
npm run dev      # 🚀 Modo desarrollo (http://localhost:5173)
npm run build    # 📦 Build para producción
npm run preview  # 👀 Preview del build de producción
npm run lint     # 🔍 Linter con ESLint
```

### Backend (`server/`)

**UBICACIÓN:** Debes estar en `cd server` para ejecutar estos comandos

```bash
npm run dev      # 🚀 Modo desarrollo con nodemon (auto-reload)
npm start        # ▶️  Producción (sin auto-reload)
npm run seed     # 🌱 Poblar base de datos con datos de prueba
```

### Scripts de Base de Datos

```bash
# Probar conexión a MySQL (desde server/)
node src/scripts/test-connection.js

# Sembrar datos de prueba (desde server/)
node src/scripts/seed.js

# Configurar usuario MySQL admin (PowerShell)
powershell -ExecutionPolicy Bypass -File src/scripts/setup-mysql-admin.ps1
```

---

## 🌐 Rutas de la Aplicación

### Frontend (React Router)

```
/                   → Home (página principal)
/talleres           → Búsqueda y listado de talleres
/taller/:id         → Perfil detallado de un taller
/registro-taller    → Formulario de registro de taller
/resena             → Formulario para dejar reseña
```

### Backend (API REST)

```
GET    /api/talleres           → Listar todos los talleres
GET    /api/talleres/:id       → Obtener un taller específico
POST   /api/talleres           → Crear nuevo taller
PUT    /api/talleres/:id       → Actualizar taller
DELETE /api/talleres/:id       → Eliminar taller

POST   /api/auth/register      → Registrar usuario
POST   /api/auth/login         → Iniciar sesión
GET    /api/auth/profile       → Perfil del usuario actual

GET    /api/resenas            → Listar reseñas
POST   /api/resenas            → Crear reseña
```

---

## 🔐 Variables de Entorno

### Backend (`server/.env`)

```env
# Base de Datos MySQL (XAMPP)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=                    # Vacío por defecto en XAMPP
DB_NAME=motoya_db

# Servidor
PORT=3000
NODE_ENV=development            # development | production

# JWT Authentication
JWT_SECRET=clave_super_secreta_cambiar_en_produccion
JWT_EXPIRE=7d                   # Tiempo de expiración del token

# Logging
LOG_LEVEL=debug                 # error | warn | info | debug
```

### Frontend (Opcional - `client/.env`)

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=MotoYA
```

---

## 🚨 Solución de Problemas Comunes

### ❌ Error: "Cannot connect to MySQL"

**Solución:**

1. Verifica que XAMPP MySQL esté corriendo (puerto 3306)
2. Revisa las credenciales en `server/.env`
3. Prueba la conexión: `node src/scripts/test-connection.js`

### ❌ Error: "Port 3000 already in use"

**Solución:**

```bash
# Windows - Matar proceso en puerto 3000
netstat -ano | findstr :3000
taskkill /PID [número_de_PID] /F

# Cambiar puerto en server/.env
PORT=3001
```

### ❌ Error: "npm ERR! code ELIFECYCLE"

**Solución:**

```bash
# Borrar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### ❌ Frontend no carga estilos Tailwind

**Solución:**

```bash
cd client
rm -rf node_modules/.vite
npm run dev
```

---

## 📦 Comandos Rápidos

### Inicio Rápido (Local Development)

**Terminal 1 - Backend:**

```bash
cd server
npm install    # Solo primera vez
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd client
npm install    # Solo primera vez
npm run dev
```

### Reset Completo del Proyecto

```bash
# Limpiar dependencias y caché
cd client && rm -rf node_modules .vite dist
cd ../server && rm -rf node_modules
cd ..

# Reinstalar todo
cd client && npm install
cd ../server && npm install

# Reiniciar base de datos
mysql -u root -p motoya_db < database/schema.sql
```

---

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📄 Licencia

Este proyecto es privado.

## 🐛 Reportar Issues

Si encuentras un bug o tienes una sugerencia, por favor abre un issue en GitHub.

---

**Desarrollado con ❤️ por el equipo de MotoYA**
