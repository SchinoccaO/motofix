# 🚀 GUÍA RÁPIDA: CÓMO ARRANCAR EL PROYECTO

## ⚡ INICIO RÁPIDO (3 pasos)

### 1️⃣ INICIAR MYSQL

```
1. Abrir XAMPP Control Panel
2. Click en "Start" en MySQL
3. Verificar que diga "Running" con luz verde
```

### 2️⃣ INICIAR BACKEND

```powershell
# Abrir terminal en VS Code (Ctrl + `)
cd D:\orian\Documents\MOTOYA\server
node src/index.js

# ✅ Deberías ver:
# 🚀 Servidor corriendo en http://localhost:5000
# ✅ Backend listo para recibir peticiones
```

**⚠️ Si el puerto 5000 está ocupado:**

```powershell
# Ver qué lo está usando:
netstat -ano | findstr ":5000"

# Matar todos los procesos node:
taskkill /IM node.exe /F

# Intentar de nuevo
```

### 3️⃣ INICIAR FRONTEND

```powershell
# Abrir OTRA terminal (click en el + de la terminal)
cd D:\orian\Documents\MOTOYA\client
npm run dev

# ✅ Deberías ver:
# ➜  Local:   http://localhost:5173/
```

**Listo! Ahora abre el navegador en:** http://localhost:5173

---

## 🧪 PROBAR QUE TODO FUNCIONA

### Opción A: Desde el navegador

1. Ir a http://localhost:5173/register
2. Llenar el formulario:
   - Nombre: Tu Nombre
   - Email: test@test.com
   - Contraseña: 123456
   - Rol: Cliente
3. Click en "Crear Cuenta"
4. Si funciona, te redirige a /talleres

### Opción B: Desde Postman

1. Abrir Postman
2. POST http://localhost:5000/api/auth/register
3. Body → raw → JSON:

```json
{
  "nombre": "Test User",
  "email": "test@test.com",
  "password": "123456",
  "rol": "cliente"
}
```

4. Send
5. ✅ Deberías recibir un token

---

## 🐛 SOLUCIÓN A PROBLEMAS COMUNES

### Problema: "Backend no está corriendo"

**Solución:**

1. Verificar que MySQL esté corriendo en XAMPP
2. Reiniciar el backend
3. Ver errores en la terminal del backend

### Problema: "Cannot connect to server"

**Solución:**

1. Verificar que veas "✅ Backend listo" en la terminal
2. Probar http://localhost:5000/api/health en el navegador
3. Si no responde, el backend se cayó

### Problema: "CORS error" en el navegador

**Solución:**

- Ya está configurado CORS, pero si persiste:
- Verificar que el frontend use http://localhost:5173 (no 5174)

### Problema: Frontend en puerto 5174 en lugar de 5173

**Solución:**

```powershell
# Matar proceso en 5173:
netstat -ano | findstr ":5173"
# Luego matar el PID que aparece:
taskkill /PID XXXX /F

# Reiniciar frontend
cd client
npm run dev
```

---

## 📁 ESTRUCTURA DEL PROYECTO

```
MOTOYA/
├── server/           ← BACKEND (Node.js + Express)
│   ├── src/
│   │   ├── index.js       ← Punto de entrada
│   │   ├── config/        ← Configuración DB
│   │   ├── models/        ← Modelos (User, Taller, Resena)
│   │   ├── controllers/   ← Lógica de negocio
│   │   ├── routes/        ← Rutas/endpoints
│   │   └── middlewares/   ← Autenticación
│   ├── .env              ← Variables de entorno
│   └── package.json
│
├── client/           ← FRONTEND (React + TypeScript)
│   ├── src/
│   │   ├── App.tsx        ← Rutas principales
│   │   ├── pages/         ← Páginas (Login, Register, etc)
│   │   └── components/    ← Componentes reutilizables
│   ├── vite.config.ts    ← Configuración Vite
│   └── package.json
│
└── database/         ← Scripts SQL
    ├── schema.sql         ← Estructura de tablas
    └── seeds.sql          ← Datos de prueba
```

---

## 🔑 ARCHIVOS IMPORTANTES

### Backend

- `server/.env` → Credenciales de BD, puerto, JWT secret
- `server/src/index.js` → Servidor principal
- `server/src/controllers/authController.js` → Login/Register

### Frontend

- `client/vite.config.ts` → Puerto y proxy
- `client/src/App.tsx` → Rutas
- `client/src/pages/Login.tsx` → Formulario de login
- `client/src/pages/Register.tsx` → Formulario de registro

### Base de datos

- phpMyAdmin → http://localhost/phpmyadmin
- Usuario: root
- Contraseña: (vacía)
- Base de datos: motoya_db

---

## 📝 PUERTOS USADOS

| Servicio   | Puerto | URL                         |
| ---------- | ------ | --------------------------- |
| Frontend   | 5173   | http://localhost:5173       |
| Backend    | 5000   | http://localhost:5000       |
| MySQL      | 3306   | localhost:3306              |
| phpMyAdmin | 80     | http://localhost/phpmyadmin |

---

## 🎯 PRÓXIMOS PASOS

Una vez que todo esté funcionando:

1. **Probar el registro y login** ✅
2. **Implementar logout** (borrar token de localStorage)
3. **Proteger rutas** (crear ProtectedRoute component)
4. **Crear página de perfil** (mostrar datos del usuario)
5. **Implementar CRUD de talleres**
6. **Implementar sistema de reseñas**

---

## 📚 DOCUMENTACIÓN ADICIONAL

- `PROBLEMAS_Y_SOLUCIONES.md` → Análisis completo de problemas
- `GUIA_APRENDIZAJE.md` → Guía para principiantes
- `DIAGRAMAS_FLUJOS.md` → Flujos de la aplicación
- `EJEMPLOS_PRACTICOS.md` → Ejemplos de código
- `API_ENDPOINTS.md` → Documentación de la API

---

## ⚠️ RECORDATORIOS IMPORTANTES

1. **SIEMPRE** iniciar MySQL primero (XAMPP)
2. **SIEMPRE** iniciar backend antes que frontend
3. **NUNCA** subir el archivo `.env` a GitHub
4. **VERIFICAR** que ambos servidores estén corriendo antes de probar

---

## 🆘 SI NADA FUNCIONA

**Reinicio completo:**

```powershell
# 1. Matar todos los procesos
taskkill /IM node.exe /F

# 2. Reiniciar MySQL en XAMPP
# Stop → Start

# 3. Backend
cd D:\orian\Documents\MOTOYA\server
node src/index.js

# 4. Frontend (en otra terminal)
cd D:\orian\Documents\MOTOYA\client
npm run dev
```

---

**Última actualización:** 5 de febrero de 2026
**Estado:** Backend y Frontend configurados, listo para desarrollo
