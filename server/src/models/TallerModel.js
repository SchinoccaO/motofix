// ============================================
// MODELO DE TALLER (TallerModel)
// ============================================
// Este archivo define la estructura de la tabla 'talleres' en la base de datos
// Un taller es un negocio de reparación de motos registrado por un mecánico

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

/**
 * Clase Taller - Representa un taller mecánico
 * Cada taller pertenece a un usuario con rol 'mecanico'
 */
class Taller extends Model { }

// ============================================
// DEFINICIÓN DE LA ESTRUCTURA DEL TALLER
// ============================================

Taller.init(
  // ===== DEFINICIÓN DE COLUMNAS =====
  {
    // Campo: id (identificador único del taller)
    id: {
      type: DataTypes.INTEGER.UNSIGNED,  // Número entero positivo
      autoIncrement: true,                // Se incrementa automáticamente
      primaryKey: true                    // Clave primaria
    },

    // Campo: usuario_id (ID del mecánico dueño del taller)
    // Este es una FOREIGN KEY (llave foránea) que conecta con la tabla 'usuarios'
    usuario_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,          // Es obligatorio (un taller debe tener dueño)
      references: {
        model: 'usuarios',       // Se relaciona con la tabla 'usuarios'
        key: 'id'                // Específicamente con el campo 'id' de usuarios
      },
      onDelete: 'CASCADE'        // Si se elimina el usuario, también se elimina el taller
    },

    // Campo: nombre (nombre del taller)
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false           // Es obligatorio
    },

    // Campo: descripcion (información sobre el taller)
    descripcion: {
      type: DataTypes.TEXT       // TEXT permite textos largos (más de 255 caracteres)
    },

    // Campo: direccion (ubicación física del taller)
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false           // Es obligatorio
    },

    // Campo: ciudad (ciudad donde está el taller)
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: false           // Es obligatorio
    },

    // Campo: telefono (número de contacto)
    telefono: {
      type: DataTypes.STRING(20)
    },

    // Campo: whatsapp (número de WhatsApp)
    whatsapp: {
      type: DataTypes.STRING(20)
    },

    // Campo: email (correo del taller)
    email: {
      type: DataTypes.STRING(255),
      validate: {
        isEmail: true            // Valida formato de email
      }
    },

    // Campo: servicios (servicios que ofrece el taller)
    // Se guardan como CSV (valores separados por comas)
    // Ejemplo: "mantenimiento,reparacion,repuestos"
    servicios: {
      type: DataTypes.TEXT,
      comment: 'CSV: mantenimiento,reparacion,repuestos,pintura'
    },

    // Campo: horarios (horario de atención)
    horarios: {
      type: DataTypes.STRING(255)
    },

    // Campo: marcas_atendidas (marcas de motos que reparan)
    // También en formato CSV
    // Ejemplo: "Honda,Yamaha,Suzuki"
    marcas_atendidas: {
      type: DataTypes.TEXT,
      comment: 'CSV: Honda,Yamaha,Suzuki,etc'
    },

    // Campo: foto_url (URL de la foto del taller)
    foto_url: {
      type: DataTypes.STRING(500)  // Hasta 500 caracteres (URLs pueden ser largas)
    },

    // Campo: latitud (coordenada geográfica para mostrar en mapa)
    latitud: {
      type: DataTypes.DECIMAL(10, 8)  // Número decimal con 10 dígitos, 8 después del punto
    },

    // Campo: longitud (coordenada geográfica para mostrar en mapa)
    longitud: {
      type: DataTypes.DECIMAL(11, 8)  // Número decimal con 11 dígitos, 8 después del punto
    },

    // Campo: calificacion_promedio (promedio de las calificaciones)
    // Se calcula automáticamente cuando hay reseñas
    calificacion_promedio: {
      type: DataTypes.DECIMAL(2, 1),  // Número con 2 dígitos, 1 decimal (ej: 4.5)
      defaultValue: 0.0               // Por defecto es 0.0 (sin calificación aún)
    },

    // Campo: total_resenas (cantidad de reseñas que tiene el taller)
    total_resenas: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0                  // Por defecto 0 reseñas
    },

    // Campo: verificado (si el taller ha sido verificado por un admin)
    verificado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false              // Por defecto no está verificado
    },

    // Campo: activo (si el taller está activo o fue dado de baja)
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true               // Por defecto está activo
    }
  },
  // ===== OPCIONES DEL MODELO =====
  {
    sequelize,                   // Conexión a la base de datos
    modelName: 'Taller',         // Nombre del modelo en JavaScript
    tableName: 'talleres',       // Nombre de la tabla en MySQL
    timestamps: true,            // Agrega created_at y updated_at automáticamente
    underscored: true,           // Usa snake_case para nombres de columnas

    // ===== ÍNDICES =====
    // Los índices hacen que las búsquedas sean más rápidas
    indexes: [
      { fields: ['ciudad'] },       // Para buscar talleres por ciudad rápidamente
      { fields: ['usuario_id'] },   // Para encontrar talleres de un mecánico específico
      { fields: ['verificado'] },   // Para filtrar talleres verificados
      { fields: ['activo'] }        // Para filtrar talleres activos
    ]
  }
);

// Exportamos el modelo para usarlo en otros archivos
export default Taller;
