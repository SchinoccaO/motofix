/**
 * Migración: agrega columna `horarios` JSON a la tabla `providers`.
 * Ejecutar una sola vez: node src/scripts/migrate_add_horarios.js
 */

import sequelize from '../config/db.js';

async function run() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a TiDB Cloud');

    // Verificar si la columna ya existe
    const [rows] = await sequelize.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME   = 'providers'
        AND COLUMN_NAME  = 'horarios'
    `);

    if (rows.length > 0) {
      console.log('ℹ️  La columna horarios ya existe. No se realizaron cambios.');
    } else {
      await sequelize.query(`
        ALTER TABLE providers
        ADD COLUMN horarios JSON NULL DEFAULT NULL
        COMMENT 'Horarios por día. Formato: {"lunes":{"abre":"09:00","cierra":"18:00"}, ...}'
      `);
      console.log('✅ Columna horarios agregada correctamente a la tabla providers.');
    }
  } catch (err) {
    console.error('❌ Error en la migración:', err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

run();
