// ============================================
// MODELO DE USUARIO (UserModel)
// ============================================
// Este archivo define la estructura de la tabla 'usuarios' en la base de datos
// Un modelo es como un "molde" que describe cómo son los datos de un usuario

// Importamos DataTypes (tipos de datos) y Model (clase base) de Sequelize
import { DataTypes, Model } from 'sequelize';
// Importamos nuestra conexión a la base de datos
import sequelize from '../config/db.js';
// bcrypt es una librería para encriptar contraseñas de forma segura
import bcrypt from 'bcryptjs';

/**
 * Clase User - Representa un usuario del sistema
 * Roles disponibles:
 * - 'cliente': Usuario normal que busca talleres y deja reseñas
 * - 'mecanico': Dueño de un taller que puede registrar su negocio
 * - 'admin': Administrador del sistema con permisos especiales
 */
class User extends Model {
  // ===== MÉTODO toJSON =====
  // Este método se ejecuta automáticamente cuando convertimos un usuario a JSON
  // LO USAMOS PARA OCULTAR LA CONTRASEÑA en las respuestas de la API (seguridad)
  toJSON() {
    // Obtenemos todos los datos del usuario
    const values = { ...this.get() };
    // Eliminamos el campo password antes de enviarlo al cliente
    delete values.password;
    // Devolvemos el usuario sin la contraseña
    return values;
  }

  // ===== MÉTODO compararPassword =====
  // Este método compara una contraseña en texto plano con la contraseña encriptada
  // Se usa en el LOGIN para verificar si la contraseña es correcta
  async compararPassword(passwordIngresada) {
    // bcrypt.compare() compara de forma segura:
    // - passwordIngresada: lo que el usuario escribió en el login
    // - this.password: la contraseña encriptada guardada en la BD
    // Devuelve true si coinciden, false si no
    return await bcrypt.compare(passwordIngresada, this.password);
  }
}

// ============================================
// DEFINICIÓN DE LA ESTRUCTURA DEL MODELO
// ============================================
// User.init() define qué campos (columnas) tiene la tabla 'usuarios'

User.init(
  // ===== PRIMER PARÁMETRO: DEFINICIÓN DE COLUMNAS =====
  {
    // Campo: id (identificador único de cada usuario)
    id: {
      type: DataTypes.INTEGER.UNSIGNED,  // Número entero positivo
      autoIncrement: true,                // Se incrementa automáticamente (1, 2, 3...)
      primaryKey: true                    // Es la clave primaria (identifica de forma única)
    },

    // Campo: email (correo electrónico del usuario)
    email: {
      type: DataTypes.STRING(255),  // Texto hasta 255 caracteres
      allowNull: false,             // NO puede estar vacío (es obligatorio)
      unique: true,                 // NO puede haber dos usuarios con el mismo email
      validate: {
        isEmail: true               // Valida que tenga formato de email (ej: user@example.com)
      }
    },

    // Campo: password (contraseña encriptada)
    password: {
      type: DataTypes.STRING(255),  // Texto hasta 255 caracteres (la encriptación es larga)
      allowNull: false              // Es obligatoria
    },

    // Campo: nombre (nombre completo del usuario)
    nombre: {
      type: DataTypes.STRING(255),  // Texto hasta 255 caracteres
      allowNull: false              // Es obligatorio
    },

    // Campo: rol (tipo de usuario)
    rol: {
      type: DataTypes.ENUM('cliente', 'mecanico', 'admin'),  // Solo puede ser uno de estos 3 valores
      defaultValue: 'cliente'  // Si no se especifica, por defecto es 'cliente'
    }
  },
  // ===== SEGUNDO PARÁMETRO: OPCIONES DEL MODELO =====
  {
    sequelize,                   // Conexión a la base de datos que usará este modelo
    modelName: 'User',           // Nombre del modelo en JavaScript (singular, mayúscula)
    tableName: 'usuarios',       // Nombre de la tabla en MySQL (plural, minúsculas)
    timestamps: true,            // Agrega automáticamente created_at y updated_at
    underscored: true,           // Usa snake_case (created_at) en vez de camelCase (createdAt)

    // ===== HOOKS (GANCHOS) =====
    // Los hooks son funciones que se ejecutan automáticamente en ciertos momentos
    hooks: {
      // beforeCreate: se ejecuta ANTES de crear un usuario en la BD
      beforeCreate: async (user) => {
        // Si el usuario tiene contraseña, la encriptamos antes de guardarla
        if (user.password) {
          // genSaltSync(10): genera una "sal" para hacer la encriptación más segura
          const salt = bcrypt.genSaltSync(10);
          // hashSync: convierte la contraseña en texto plano a una cadena encriptada
          user.password = bcrypt.hashSync(user.password, salt);
        }
      },

      // beforeUpdate: se ejecuta ANTES de actualizar un usuario en la BD
      beforeUpdate: async (user) => {
        // Solo encriptamos si la contraseña fue modificada
        if (user.changed('password')) {
          const salt = bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(user.password, salt);
        }
      }
    },

    // ===== ÍNDICES =====
    // Los índices hacen que las búsquedas sean más rápidas
    // Es como el índice de un libro: te ayuda a encontrar info rápido
    indexes: [
      { fields: ['email'] },  // Índice para buscar rápido por email
      { fields: ['rol'] }     // Índice para buscar rápido por rol
    ]
  }
);

// Exportamos el modelo para poder usarlo en otros archivos
export default User;
