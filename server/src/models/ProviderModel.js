import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Provider extends Model {}

Provider.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    owner_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    type: {
      type: DataTypes.ENUM('shop', 'mechanic', 'parts_store'),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    phone: {
      type: DataTypes.STRING(20)
    },
    email: {
      type: DataTypes.STRING(255),
      validate: {
        isEmail: true
      }
    },
    website: {
      type: DataTypes.STRING(500)
    },
    photo_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    average_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    total_reviews: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    horarios: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      comment: 'Horarios por día. Formato: { "lunes": { "abre": "09:00", "cierra": "18:00" }, "sabado": null, ... }'
    },
    // ── Estado manual abierto/cerrado ──────────────────────────────────────────
    // null  → usar horario programado (comportamiento por defecto)
    // true  → forzar ABIERTO (override de feriados, horarios especiales)
    // false → forzar CERRADO (feriados, enfermedad, vacaciones)
    is_open_override: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
      comment: 'null=usar horario, true=forzar abierto, false=forzar cerrado'
    },
    // ── Rate limiting de ediciones de perfil ────────────────────────────────────
    // Máximo 2 ediciones cada 14 días sin validación manual.
    profile_edit_count: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    profile_edit_window_start: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      comment: 'Inicio de la ventana de 14 días para contar ediciones'
    },
    pending_validation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'true = límite de ediciones alcanzado, esperando revisión manual'
    },
  },
  {
    sequelize,
    modelName: 'Provider',
    tableName: 'providers',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['type'] },
      { fields: ['owner_id'] }
    ]
  }
);

export default Provider;
