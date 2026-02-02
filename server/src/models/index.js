import User from './UserModel.js';
import Taller from './TallerModel.js';
import Resena from './ResenaModel.js';

/**
 * Definir relaciones entre modelos
 * IMPORTANTE: Los foreignKey usan los nombres de atributo del modelo (user_id),
 * que Sequelize mapea automáticamente a las columnas de DB (usuario_id) gracias al field
 */

// Un Usuario puede tener muchos Talleres
User.hasMany(Taller, {
  foreignKey: 'usuario_id',
  sourceKey: 'id',
  as: 'talleres'
});

Taller.belongsTo(User, {
  foreignKey: 'usuario_id',
  targetKey: 'id',
  as: 'propietario'
});

// Un Usuario puede tener muchas Reseñas
User.hasMany(Resena, {
  foreignKey: 'usuario_id',
  sourceKey: 'id',
  as: 'resenas'
});

Resena.belongsTo(User, {
  foreignKey: 'usuario_id',
  targetKey: 'id',
  as: 'usuario'
});

// Un Taller puede tener muchas Reseñas
Taller.hasMany(Resena, {
  foreignKey: 'taller_id',
  sourceKey: 'id',
  as: 'resenas'
});

Resena.belongsTo(Taller, {
  foreignKey: 'taller_id',
  targetKey: 'id',
  as: 'taller'
});

export { User, Taller, Resena };
