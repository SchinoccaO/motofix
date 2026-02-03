# 📖 ÍNDICE COMPLETO DE DOCUMENTACIÓN

¡Bienvenido a la documentación completa del proyecto MOTOYA! Esta guía te ayudará a navegar por todos los recursos educativos.

---

## 🎯 ¿POR DÓNDE EMPEZAR?

Si eres **principiante**, te recomiendo seguir este orden:

1. Lee `GUIA_APRENDIZAJE.md` → Entender conceptos básicos
2. Revisa `DIAGRAMAS_FLUJOS.md` → Ver cómo fluye la información
3. Lee los **comentarios en el código** → Ver implementaciones reales
4. Practica con `EJEMPLOS_PRACTICOS.md` → Crear tus propias funcionalidades

---

## 📚 ARCHIVOS DE DOCUMENTACIÓN

### 📘 GUIA_APRENDIZAJE.md

**¿Qué contiene?**

- Introducción al proyecto
- Arquitectura (Frontend, Backend, Base de Datos)
- Conceptos clave para principiantes
- Explicación de tecnologías usadas
- Recursos para aprender más
- Cómo arrancar el proyecto

**¿Cuándo leerlo?**

- Es tu primer contacto con el proyecto
- Quieres entender qué hace cada tecnología
- Necesitas configurar el entorno de desarrollo

### 📊 DIAGRAMAS_FLUJOS.md

**¿Qué contiene?**

- Diagramas visuales de la arquitectura
- Flujo completo de peticiones HTTP
- Relaciones entre tablas de la BD
- Ciclo de vida de una petición
- Estructura de componentes React

**¿Cuándo leerlo?**

- Quieres ver "el panorama completo"
- Necesitas entender cómo se comunican las partes
- Estás debuggeando y quieres seguir el flujo

### 💻 EJEMPLOS_PRACTICOS.md

**¿Qué contiene?**

- Ejemplo 1: Crear un nuevo endpoint
- Ejemplo 2: Agregar relaciones a modelos
- Ejemplo 3: Crear componentes React
- Ejemplo 4: Manejo completo de errores

**¿Cuándo leerlo?**

- Quieres agregar una funcionalidad nueva
- Necesitas ejemplos de código completos
- Estás listo para practicar

---

## 🗂️ ARCHIVOS DEL CÓDIGO (CON COMENTARIOS)

### 🔧 BACKEND - Configuración

#### `server/src/config/config.js`

- Configuración para diferentes ambientes (desarrollo, test, producción)
- Variables de entorno
- Pools de conexiones

#### `server/src/config/db.js`

- Conexión a MySQL con Sequelize
- Configuración del ORM
- Funciones de testing

#### `server/src/index.js`

- Punto de entrada del servidor
- Configuración de Express
- Middlewares globales
- Rutas principales
- Manejo de errores

### 🗄️ BACKEND - Modelos

#### `server/src/models/UserModel.js`

- Estructura de la tabla `usuarios`
- Encriptación de contraseñas
- Métodos auxiliares (compararPassword, toJSON)
- Hooks (beforeCreate, beforeUpdate)

#### `server/src/models/TallerModel.js`

- Estructura de la tabla `talleres`
- Campos de ubicación (latitud, longitud)
- Calificación y reseñas
- Estados (verificado, activo)

#### `server/src/models/ResenaModel.js`

- Estructura de la tabla `resenas`
- Rating (1-5 estrellas)
- Restricción: un usuario = una reseña por taller
- Respuesta del mecánico

### 🎮 BACKEND - Controladores

#### `server/src/controllers/authController.js`

- Registro de usuarios
- Login (autenticación)
- Generación de tokens JWT
- Ver y actualizar perfil

### 🛣️ BACKEND - Rutas

#### `server/src/routes/authRoutes.js`

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/perfil (protegida)
- PUT /api/auth/perfil (protegida)

### 🔐 BACKEND - Middlewares

#### `server/src/middlewares/auth.js`

- verificarToken: Valida JWT
- verificarRol: Valida permisos
- Manejo de tokens expirados

### 🎨 FRONTEND - Páginas

#### `client/src/main.tsx`

- Punto de entrada de React
- Configuración de BrowserRouter
- Montaje de la aplicación en el DOM

#### `client/src/App.tsx`

- Configuración de rutas
- Mapeo URL → Componente de página

#### `client/src/pages/Home.tsx`

- Página principal
- Hero section
- Call to action

---

## 🔍 BÚSQUEDA RÁPIDA

### "Quiero entender..."

| ¿Qué quieres entender?        | Lee esto                                                 |
| ----------------------------- | -------------------------------------------------------- |
| Cómo funciona JWT             | `GUIA_APRENDIZAJE.md` (sección Conceptos Clave)          |
| Cómo se conecta a MySQL       | `server/src/config/db.js` (con comentarios)              |
| Cómo se encriptan contraseñas | `server/src/models/UserModel.js` (hooks)                 |
| Cómo fluye una petición       | `DIAGRAMAS_FLUJOS.md` (Flujo Registro)                   |
| Qué es un middleware          | `GUIA_APRENDIZAJE.md` + `server/src/middlewares/auth.js` |
| Cómo crear un endpoint        | `EJEMPLOS_PRACTICOS.md` (Ejemplo 1)                      |
| Cómo funciona React           | `GUIA_APRENDIZAJE.md` (sección React)                    |
| Relaciones en la BD           | `DIAGRAMAS_FLUJOS.md` (Relaciones)                       |

---

## 🎓 PLAN DE ESTUDIO SUGERIDO (4 SEMANAS)

### 📅 Semana 1: Fundamentos

- [ ] Leer `GUIA_APRENDIZAJE.md` completo
- [ ] Ver videos de JavaScript async/await
- [ ] Entender qué es una API REST
- [ ] Instalar el proyecto localmente

### 📅 Semana 2: Backend

- [ ] Leer todos los comentarios en `server/src/`
- [ ] Seguir flujo en `DIAGRAMAS_FLUJOS.md`
- [ ] Probar endpoints con Postman
- [ ] Modificar un endpoint existente

### 📅 Semana 3: Frontend

- [ ] Leer comentarios en `client/src/`
- [ ] Entender React hooks (useState, useEffect)
- [ ] Modificar un componente existente
- [ ] Crear un componente nuevo

### 📅 Semana 4: Integración

- [ ] Seguir `EJEMPLOS_PRACTICOS.md`
- [ ] Crear endpoint + página React
- [ ] Agregar funcionalidad completa
- [ ] Hacer tu primer despliegue

---

## 🆘 GLOSARIO DE TÉRMINOS

| Término        | Significado                                                              |
| -------------- | ------------------------------------------------------------------------ |
| **API**        | Application Programming Interface - Conjunto de reglas para comunicación |
| **REST**       | Representational State Transfer - Arquitectura de APIs                   |
| **JWT**        | JSON Web Token - Token de autenticación                                  |
| **ORM**        | Object-Relational Mapping - Mapeo de objetos a BD                        |
| **Middleware** | Función que se ejecuta entre petición y respuesta                        |
| **Hook**       | Función especial en React o Sequelize                                    |
| **Props**      | Propiedades que se pasan a componentes React                             |
| **State**      | Estado interno de un componente React                                    |
| **CORS**       | Cross-Origin Resource Sharing - Permisos entre dominios                  |
| **SQL**        | Structured Query Language - Lenguaje de BD                               |
| **FK**         | Foreign Key - Clave foránea (relación entre tablas)                      |
| **PK**         | Primary Key - Clave primaria (identificador único)                       |

---

## 📞 AYUDA Y RECURSOS

### 🔗 Links Útiles

- [Documentación Express](https://expressjs.com/)
- [Documentación React](https://react.dev/)
- [Documentación Sequelize](https://sequelize.org/)
- [Documentación JWT](https://jwt.io/)
- [MDN Web Docs](https://developer.mozilla.org/)

### 💡 Consejos

1. **No te frustres** - Todos empezamos sin saber nada
2. **Lee los errores** - Los mensajes de error te dicen qué está mal
3. **Usa console.log()** - Es tu mejor amigo para debuggear
4. **Experimenta** - Cambia cosas y ve qué pasa
5. **Pregunta** - No hay preguntas tontas

---

## 📝 EJERCICIOS PRÁCTICOS

### Nivel Básico

1. Agregar un campo "teléfono" al modelo User
2. Crear endpoint para obtener un usuario por ID
3. Modificar el texto de la página Home

### Nivel Intermedio

4. Crear sistema de favoritos (usuario → taller)
5. Agregar filtros en búsqueda de talleres
6. Implementar paginación en listado

### Nivel Avanzado

7. Sistema de notificaciones
8. Chat en tiempo real con WebSockets
9. Subida de imágenes a Cloudinary
10. Tests unitarios con Jest

---

## 🎉 ¡ÉXITO!

Recuerda: **el mejor desarrollador no es el que sabe todo, sino el que sabe buscar y aprender**.

Esta documentación siempre estará aquí para ti. ¡A programar! 💪

---

**Última actualización:** Febrero 2026
**Versión del proyecto:** 1.0.0
**Creado con ❤️ para aprender**
