import User from './UserModel.js';
import Taller from './TallerModel.js';
import Resena from './ResenaModel.js';

/**
 * Definir relaciones entre modelos
 */

// Un Usuario puede tener muchos Talleres
User.hasMany(Taller, {
  foreignKey: 'user_id',
  as: 'talleres'
});

Taller.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'propietario'
});

// Un Usuario puede tener muchas Reseñas
User.hasMany(Resena, {
  foreignKey: 'user_id',
  as: 'resenas'
});

Resena.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'usuario'
});

// Un Taller puede tener muchas Reseñas
Taller.hasMany(Resena, {
  foreignKey: 'taller_id',
  as: 'resenas'
});

Resena.belongsTo(Taller, {
  foreignKey: 'taller_id',
  as: 'taller'
});

export { User, Taller, Resena };
