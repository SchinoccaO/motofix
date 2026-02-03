# 📚 GUÍA DE APRENDIZAJE - PROYECTO MOTOYA

Esta guía te ayudará a entender cómo funciona todo el proyecto paso a paso.

---

## 🎯 ¿QUÉ ES ESTE PROYECTO?

**MotoYA/MotoFIX** es una plataforma web para encontrar talleres de motos. Los usuarios pueden:

- 🔍 Buscar talleres mecánicos
- ⭐ Leer y dejar reseñas
- 📝 Los mecánicos pueden registrar sus talleres

---

## 🏗️ ARQUITECTURA DEL PROYECTO

El proyecto está dividido en 3 partes principales:

```
MOTOYA/
├── client/          ← FRONTEND (lo que ve el usuario)
├── server/          ← BACKEND (lógica del servidor)
└── database/        ← BASE DE DATOS (donde se guardan los datos)
```

### 🎨 CLIENT (Frontend)

- **Tecnología**: React + TypeScript + Vite
- **Función**: La interfaz visual que el usuario ve en el navegador
- **Ubicación**: `client/src/`

### ⚙️ SERVER (Backend)

- **Tecnología**: Node.js + Express + Sequelize
- **Función**: Procesa peticiones, maneja la lógica y se conecta a la BD
- **Ubicación**: `server/src/`

### 💾 DATABASE (Base de Datos)

- **Tecnología**: MySQL
- **Función**: Almacena usuarios, talleres y reseñas
- **Ubicación**: `database/schema.sql`

---

## 🔄 FLUJO DE UNA PETICIÓN (Ejemplo: Login)

Veamos qué pasa cuando un usuario inicia sesión:

```
1. USUARIO escribe email y contraseña → presiona "Login"
   ↓
2. FRONTEND (React) envía petición HTTP POST a http://localhost:3000/api/auth/login
   ↓
3. SERVIDOR (Express) recibe la petición en el Router (authRoutes.js)
   ↓
4. ROUTER dirige la petición al CONTROLADOR (authController.js)
   ↓
5. CONTROLADOR:
   - Busca el usuario en la BD usando el MODELO (UserModel.js)
   - Verifica la contraseña con bcrypt
   - Si es correcta, genera un TOKEN JWT
   ↓
6. SERVIDOR responde al frontend con el token
   ↓
7. FRONTEND guarda el token y redirige al usuario a su perfil
```

---

## 📂 ESTRUCTURA DETALLADA DEL SERVIDOR

```
server/src/
├── index.js              ← Punto de entrada (arranca el servidor)
├── config/
│   ├── config.js         ← Configuración de entornos (dev, test, prod)
│   └── db.js             ← Conexión a MySQL con Sequelize
├── models/               ← Modelos (estructura de las tablas)
│   ├── index.js          ← Define relaciones entre modelos
│   ├── UserModel.js      ← Tabla 'usuarios'
│   ├── TallerModel.js    ← Tabla 'talleres'
│   └── ResenaModel.js    ← Tabla 'resenas'
├── controllers/          ← Lógica de negocio (qué hacer con cada petición)
│   ├── authController.js ← Login, registro, perfil
│   ├── tallerController.js
│   └── resenaController.js
├── routes/               ← Rutas (URLs de la API)
│   ├── authRoutes.js     ← /api/auth/login, /api/auth/register
│   ├── tallerRoutes.js   ← /api/talleres
│   └── resenaRoutes.js   ← /api/resenas
└── middlewares/          ← Funciones que se ejecutan entre petición y respuesta
    └── auth.js           ← Verifica tokens JWT
```

---

## 🎨 ESTRUCTURA DETALLADA DEL CLIENTE

```
client/src/
├── main.tsx              ← Punto de entrada (monta React en el HTML)
├── App.tsx               ← Configuración de rutas (qué página en qué URL)
├── components/           ← Componentes reutilizables
│   ├── Navbar.tsx        ← Barra de navegación
│   ├── Footer.tsx        ← Pie de página
│   ├── Icon.tsx          ← Componente para íconos
│   └── Logo.tsx          ← Logo de la aplicación
├── pages/                ← Páginas completas
│   ├── Home.tsx          ← Página principal (/)
│   ├── BuscarTalleres.tsx ← Página de búsqueda (/talleres)
│   ├── TallerProfile.tsx  ← Perfil de un taller (/taller/:id)
│   ├── RegistroTaller.tsx ← Formulario registro (/registro-taller)
│   └── ResenaForm.tsx     ← Formulario reseña (/resena)
└── assets/               ← Recursos estáticos (imágenes, íconos)
```

---

## 🔑 CONCEPTOS CLAVE PARA PRINCIPIANTES

### 1️⃣ ¿Qué es una API REST?

Una API REST es como un "menú de restaurante" que dice qué acciones puedes hacer:

- **GET** = Leer/Obtener datos (ej: ver lista de talleres)
- **POST** = Crear algo nuevo (ej: registrar usuario)
- **PUT** = Actualizar algo existente (ej: editar perfil)
- **DELETE** = Eliminar algo (ej: borrar reseña)

### 2️⃣ ¿Qué es un Modelo (Model)?

Un modelo es la "descripción" de cómo son los datos en la base de datos.

```javascript
// Ejemplo: UserModel.js
{
  id: 1,
  nombre: "Juan",
  email: "juan@email.com",
  password: "***", // encriptada
  rol: "cliente"
}
```

### 3️⃣ ¿Qué es un Controlador (Controller)?

Un controlador es el "cerebro" que procesa las peticiones.

```javascript
// Ejemplo: authController.js
export const login = (req, res) => {
  // 1. Recibe email y password
  // 2. Busca usuario en BD
  // 3. Verifica password
  // 4. Genera token
  // 5. Responde con token
};
```

### 4️⃣ ¿Qué es una Ruta (Route)?

Una ruta conecta una URL con un controlador.

```javascript
// Ejemplo: authRoutes.js
router.post("/login", login); // POST /api/auth/login → función login()
```

### 5️⃣ ¿Qué es un Middleware?

Un middleware es una función que se ejecuta ANTES del controlador.

```javascript
// Ejemplo: verificarToken (middleware)
router.get("/perfil", verificarToken, obtenerPerfil);
//                    ↑ Se ejecuta primero
//                                      ↑ Se ejecuta después
```

### 6️⃣ ¿Qué es JWT (JSON Web Token)?

Un JWT es como una "credencial digital" que prueba quién eres.

- Te lo dan cuando haces login
- Lo envías en cada petición protegida
- El servidor lo verifica para saber quién eres

```
Formato: Header.Payload.Signature
Ejemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIn0.abc123
```

### 7️⃣ ¿Qué es Sequelize (ORM)?

Sequelize es una herramienta que te permite trabajar con la base de datos usando objetos de JavaScript en lugar de SQL.

```javascript
// Sin Sequelize (SQL puro):
connection.query("SELECT * FROM usuarios WHERE email = ?", [email]);

// Con Sequelize (más fácil):
User.findOne({ where: { email } });
```

---

## 🔐 SEGURIDAD EN EL PROYECTO

### Encriptación de Contraseñas (bcrypt)

```javascript
// Nunca guardamos contraseñas en texto plano
password: "123456"  ❌ MALO

// Siempre las encriptamos con bcrypt
password: "$2a$10$N9qo8..."  ✅ BUENO
```

### Tokens JWT

```javascript
// El usuario envía el token en los headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 RELACIONES EN LA BASE DE DATOS

```
Usuario (1) ──┬─→ Tiene varios ─→ Talleres (N)
              │
              └─→ Escribe varias ─→ Reseñas (N)

Taller (1) ─→ Tiene varias ─→ Reseñas (N)
```

- Un **usuario** puede tener varios **talleres** (si es mecánico)
- Un **usuario** puede escribir varias **reseñas**
- Un **taller** puede tener varias **reseñas**

---

## 🚀 CÓMO ARRANCAR EL PROYECTO

### 1. Instalar dependencias

```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `server/.env` con:

```env
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=motoya_db
DB_HOST=localhost
DB_PORT=3306
JWT_SECRET=tu_secreto_super_secreto
PORT=3000
```

### 3. Crear la base de datos

```bash
# En MySQL ejecuta:
mysql -u root -p < database/schema.sql
```

### 4. Arrancar el servidor

```bash
cd server
npm run dev
# Servidor corriendo en http://localhost:3000
```

### 5. Arrancar el cliente

```bash
cd client
npm run dev
# Cliente corriendo en http://localhost:5173
```

---

## 📚 RECURSOS PARA APRENDER MÁS

### JavaScript/Node.js

- [MDN Web Docs](https://developer.mozilla.org/es/)
- [JavaScript.info](https://javascript.info/)

### React

- [Documentación oficial de React](https://react.dev/)
- [React para principiantes](https://www.freecodecamp.org/learn/)

### Express.js

- [Express.js Guide](https://expressjs.com/es/)

### Sequelize

- [Sequelize Docs](https://sequelize.org/)

### MySQL

- [MySQL Tutorial](https://www.mysqltutorial.org/)

---

## 💡 TIPS PARA APRENDER

1. **Lee los comentarios en el código** - He agregado comentarios detallados en cada archivo
2. **Sigue el flujo de una petición** - Usa console.log() para ver qué está pasando
3. **Experimenta** - Cambia cosas y ve qué pasa (en desarrollo, no en producción)
4. **Usa herramientas**:
   - **Postman**: Para probar la API
   - **Chrome DevTools**: Para debuggear el frontend
   - **MySQL Workbench**: Para ver la base de datos

---

## ❓ PREGUNTAS FRECUENTES

### ¿Por qué usar React?

React permite crear interfaces dinámicas y reutilizables fácilmente.

### ¿Por qué Express?

Express es el framework más popular de Node.js, simple y poderoso.

### ¿Por qué Sequelize?

Sequelize hace que trabajar con bases de datos sea más fácil y seguro.

### ¿Por qué JWT?

JWT es el estándar de la industria para autenticación en APIs.

---

## 🎓 PRÓXIMOS PASOS EN TU APRENDIZAJE

1. ✅ Entender la estructura básica
2. ✅ Leer todos los comentarios del código
3. 📝 Agregar tu propia funcionalidad (ej: sistema de favoritos)
4. 🐛 Aprender a debuggear errores
5. 🚀 Desplegar el proyecto en la nube (Vercel, Railway, etc.)

---

¡Éxito en tu aprendizaje! 🎉
