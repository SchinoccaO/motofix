// ============================================
// CONTROLADOR DE AUTENTICACIÓN (authController)
// ============================================
// Este archivo maneja toda la lógica de autenticación y gestión de usuarios
// Incluye: registro, login, perfil de usuario
// Los controladores son como "cerebros" que procesan las peticiones y devuelven respuestas

// JWT (JSON Web Token): libreria para crear tokens de autenticación
import jwt from 'jsonwebtoken';
// Importamos el modelo User para interactuar con la tabla usuarios
import { User } from '../models/index.js';

// ============================================
// FUNCIÓN AUXILIAR: GENERAR TOKEN JWT
// ============================================
// Un token JWT es como una "credencial digital" que prueba quién eres
// El usuario la recibe al hacer login y la envía en cada petición protegida
const generarToken = (usuario) => {
    // jwt.sign() crea un token con la información del usuario
    return jwt.sign(
        // PAYLOAD: datos que guardamos en el token (visible, NO guardar info sensible)
        {
            id: usuario.id,          // ID del usuario
            email: usuario.email,    // Email del usuario
            rol: usuario.rol         // Rol (cliente, mecanico, admin)
        },
        // SECRET: clave secreta que solo el servidor conoce (en archivo .env)
        // Sirve para firmar y verificar que el token es auténtico
        process.env.JWT_SECRET,
        // OPCIONES
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'  // El token expira en 7 días
        }
    );
};

// ============================================
// ENDPOINT: REGISTRAR NUEVO USUARIO
// ============================================
// POST /api/auth/register
// Permite que nuevos usuarios se registren en la aplicación
export const registrar = async (req, res) => {
    try {
        // === PASO 1: EXTRAER DATOS DEL BODY ===
        // req.body contiene los datos que el usuario envió en el formulario de registro
        const { nombre, email, password, rol } = req.body;

        // === PASO 2: VALIDACIONES BÁSICAS ===
        // Verificamos que los campos obligatorios existan
        if (!nombre || !email || !password) {
            // Respondemos con código 400 (Bad Request = petición incorrecta)
            return res.status(400).json({
                error: 'Nombre, email y contraseña son obligatorios'
            });
        }

        // Validamos que el email tenga un formato correcto usando RegEx
        // Ejemplo válido: usuario@ejemplo.com
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }

        // Validamos que la contraseña tenga al menos 6 caracteres (seguridad básica)
        if (password.length < 6) {
            return res.status(400).json({
                error: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // === PASO 3: VERIFICAR SI EL EMAIL YA EXISTE ===
        // Buscamos en la BD si ya hay un usuario con ese email
        const usuarioExistente = await User.findOne({ where: { email } });
        if (usuarioExistente) {
            // Si existe, no permitimos el registro (cada email es único)
            return res.status(400).json({ error: 'Este email ya está registrado' });
        }

        // === PASO 4: CREAR EL NUEVO USUARIO ===
        // User.create() guarda el usuario en la base de datos
        // NOTA: La contraseña se encripta automáticamente gracias al hook 'beforeCreate' del modelo
        const nuevoUsuario = await User.create({
            nombre,
            email,
            password,
            rol: rol || 'usuario'  // Si no especifica rol, es 'usuario' por defecto
        });

        // === PASO 5: GENERAR TOKEN JWT ===
        // Creamos un token para que el usuario inicie sesión automáticamente tras registrarse
        const token = generarToken(nuevoUsuario);

        // === PASO 6: RESPONDER AL CLIENTE ===
        // Código 201 = Created (recurso creado exitosamente)
        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            usuario: nuevoUsuario,  // Los datos del usuario (sin password gracias a toJSON())
            token                    // El token JWT para autenticación
        });
    } catch (error) {
        // === MANEJO DE ERRORES ===
        // Si algo falla (error de BD, etc.), respondemos con error 500
        console.error('Error en registro:', error);
        res.status(500).json({
            error: 'Error al registrar usuario',
            detalle: error.message
        });
    }
};

// ============================================
// ENDPOINT: INICIAR SESIÓN (LOGIN)
// ============================================
// POST /api/auth/login
// Permite que usuarios existentes inicien sesión
export const login = async (req, res) => {
    try {
        // === PASO 1: EXTRAER DATOS ===
        const { email, password } = req.body;

        // === PASO 2: VALIDAR QUE LOS CAMPOS EXISTAN ===
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
        }

        // === PASO 3: BUSCAR AL USUARIO POR EMAIL ===
        const usuario = await User.findOne({ where: { email } });
        if (!usuario) {
            // Código 401 = Unauthorized (credenciales inválidas)
            // No decimos "email no encontrado" por seguridad (no dar pistas a atacantes)
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // === PASO 4: VERIFICAR LA CONTRASEÑA ===
        // compararPassword() es un método del modelo User que usa bcrypt
        // Compara la contraseña en texto plano con la encriptada en la BD
        const passwordValida = await usuario.compararPassword(password);
        if (!passwordValida) {
            // Si la contraseña no coincide, respondemos con error
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // === PASO 5: GENERAR TOKEN JWT ===
        // Si las credenciales son correctas, generamos un token
        const token = generarToken(usuario);

        // === PASO 6: RESPONDER CON ÉXITO ===
        res.json({
            mensaje: 'Login exitoso',
            usuario,  // Datos del usuario (sin password)
            token     // Token para usar en peticiones futuras
        });
    } catch (error) {
        // === MANEJO DE ERRORES ===
        console.error('Error en login:', error);
        res.status(500).json({
            error: 'Error al iniciar sesión',
            detalle: error.message
        });
    }
};

// ============================================
// ENDPOINT: OBTENER PERFIL DEL USUARIO
// ============================================
// GET /api/auth/perfil
// Devuelve la información del usuario que está autenticado
// NOTA: Esta ruta está protegida por el middleware 'autenticar'
export const obtenerPerfil = async (req, res) => {
    try {
        // req.usuario es colocado por el middleware 'autenticar'
        // Contiene los datos del usuario extraídos del token JWT
        const usuario = await User.findByPk(req.usuario.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        // Respondemos con los datos del usuario
        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
};

// ============================================
// ENDPOINT: ACTUALIZAR PERFIL DEL USUARIO
// ============================================
// PUT /api/auth/perfil
// Permite al usuario actualizar su información personal
export const actualizarPerfil = async (req, res) => {
    try {
        // Extraemos los datos que el usuario quiere actualizar
        const { nombre } = req.body;

        // Buscamos al usuario en la BD usando el ID del token
        const usuario = await User.findByPk(req.usuario.id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Actualizamos los campos que hayan sido enviados
        if (nombre) usuario.nombre = nombre;

        // Guardamos los cambios en la base de datos
        await usuario.save();

        res.json({
            mensaje: 'Perfil actualizado exitosamente',
            usuario  // Devolvemos el usuario actualizado
        });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ error: 'Error al actualizar perfil' });
    }
};
