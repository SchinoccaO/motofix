# CLAUDE.md

Este archivo guía a Claude Code (claude.ai/code) para trabajar con el código de este repositorio.

## Descripción del Proyecto

MotoFIX es una plataforma web full-stack que conecta motociclistas con proveedores de servicios certificados (talleres, mecánicos independientes, casas de repuestos) en Argentina. Incluye descubrimiento de proveedores, reseñas con hilos de conversación, y gestión de reputación. Actualmente en **FASE 2** (desarrollo de API REST — controllers y routes pendientes). Ver `TODO.md` para la hoja de ruta completa.

## Comandos

### Desarrollo

```bash
# Correr frontend y backend juntos (desde la raíz)
npm run dev

# Solo backend (Express en puerto 5001)
cd server && npm run dev

# Solo frontend (Vite en puerto 3000)
cd client && npm run dev
```

### Base de datos

```bash
# Seed con datos de prueba
cd server && npm run seed

# O manualmente via MySQL CLI
mysql -u root -p < database/schema.sql
mysql -u root -p motoya < database/seeds.sql
```

### Build y calidad

```bash
npm run build          # Build del frontend (Vite)
npm run lint           # ESLint en todo el proyecto
npm run format         # Formateo con Prettier
```

## Arquitectura

Monorepo usando **npm workspaces** con dos paquetes: `client/` y `server/`.

### Backend (`server/`)

- **Express 4** con ES modules (`type: "module"`)
- **Sequelize 6** ORM conectado a **MySQL 8+** (base de datos: `motoya`)
- Punto de entrada: `server/src/index.js` (puerto 5001)
- Config de DB: `server/src/config/db.js` — pool max 10, `alter: false` para arranque rápido
- Modelos en `server/src/models/` — relaciones definidas en `models/index.js`:
  - `User` (1) → hasMany → `Review` (N)
  - `User` (1) → hasMany → `ReviewReply` (N)
  - `Provider` (1) → hasMany → `Review` (N)
  - `Provider` (1) → hasOne → `Location` (1)
  - `Review` (1) → hasMany → `ReviewReply` (N)
- Los directorios `routes/`, `controllers/`, `middlewares/` existen pero están vacíos (trabajo de FASE 2)
- Autenticación planeada con JWT (`jsonwebtoken`) + hasheo de passwords con `bcryptjs`
- Subida de archivos planeada con `multer`

### Frontend (`client/`)

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** con dark mode por clases y colores custom (primario: `#e8ba30`)
- **React Router v6** — rutas definidas en `App.tsx`:
  - `/` → Home, `/talleres` → BuscarTalleres, `/taller/:id` → TallerProfile
  - `/registro-taller` → RegistroTaller, `/resena/:tallerId` → ResenaForm
- Las páginas son actualmente estáticas (sin integración con API todavía)
- Iconos via Material Symbols CDN
- Cliente API: Axios (configurado pero sin conectar aún)

### Schema de Base de Datos (v3)

Cinco tablas, todas con naming en inglés y columnas en snake_case:
- **`users`**: name, email, password_hash, role (user/admin), is_active. Borrado suave via `is_active`.
- **`providers`**: type (shop/mechanic/parts_store), name, description, phone, email, website, is_verified, is_active, average_rating, total_reviews. Índice FULLTEXT en name+description.
- **`locations`**: relación 1:1 con providers via `provider_id` único. Campos: address, city, province, country, latitude, longitude.
- **`reviews`**: user_id, provider_id, rating (1-5), comment. Sin restricción de unicidad — un usuario puede reseñar al mismo proveedor múltiples veces.
- **`review_replies`**: review_id, user_id, content. Habilita hilos de conversación entre usuarios y proveedores en cada reseña.

Todas las foreign keys usan `ON DELETE RESTRICT` para prevenir pérdida accidental de datos.

### Variables de Entorno

Backend (`server/.env` — ver `.env.example`):
- `PORT=5001`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME=motoya`, `DB_PORT=3306`
- `JWT_SECRET`, `JWT_EXPIRES_IN=7d`
- `ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001`

Frontend (`client/.env`):
- `VITE_API_URL=http://localhost:5001/api`

### Credenciales de Datos de Prueba

Todos los usuarios del seed usan contraseña `123456`:
- Admin: `admin@motoya.com`
- Usuarios: `juan@mail.com`, `maria@mail.com`, `carlos@mail.com`

## Convenciones Clave

- ES modules en todo el proyecto (tanto client como server usan `type: "module"`)
- Columnas de DB: snake_case; variables/funciones JS: camelCase; componentes React: PascalCase
- CORS restringido a orígenes específicos (no wildcard)
- Modelos Sequelize usan `underscored: true` con timestamps `created_at`/`updated_at`
- Tipos de provider: `shop` (taller), `mechanic` (mecánico independiente), `parts_store` (casa de repuestos)
