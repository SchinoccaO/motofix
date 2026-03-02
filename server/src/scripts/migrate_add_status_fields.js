/**
 * Migración: agrega columnas de estado manual y rate-limit de ediciones a `providers`.
 *
 *   is_open_override       → null | 0 | 1  (override manual de horario)
 *   profile_edit_count     → contador de ediciones en la ventana actual
 *   profile_edit_window_start → inicio de la ventana de 14 días
 *   pending_validation     → perfil bloqueado esperando revisión manual
 *
 * Ejecutar UNA sola vez:
 *   node src/scripts/migrate_add_status_fields.js
 */

import sequelize from '../config/db.js';

const COLUMNS = [
  {
    name: 'is_open_override',
    sql: `ALTER TABLE providers
          ADD COLUMN is_open_override TINYINT(1) NULL DEFAULT NULL
          COMMENT 'null=usar horario, 1=forzar abierto, 0=forzar cerrado'`,
  },
  {
    name: 'profile_edit_count',
    sql: `ALTER TABLE providers
          ADD COLUMN profile_edit_count TINYINT UNSIGNED NOT NULL DEFAULT 0`,
  },
  {
    name: 'profile_edit_window_start',
    sql: `ALTER TABLE providers
          ADD COLUMN profile_edit_window_start DATETIME NULL DEFAULT NULL
          COMMENT 'Inicio ventana 14 días para contar ediciones'`,
  },
  {
    name: 'pending_validation',
    sql: `ALTER TABLE providers
          ADD COLUMN pending_validation TINYINT(1) NOT NULL DEFAULT 0
          COMMENT '1 = límite alcanzado, esperando revisión manual'`,
  },
];

async function columnExists(name) {
  const [rows] = await sequelize.query(`
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'providers'
      AND COLUMN_NAME  = '${name}'
  `);
  return rows.length > 0;
}

async function run() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a TiDB Cloud\n');

    for (const col of COLUMNS) {
      if (await columnExists(col.name)) {
        console.log(`ℹ️  ${col.name}: ya existe, se omite.`);
      } else {
        await sequelize.query(col.sql);
        console.log(`✅ ${col.name}: agregada correctamente.`);
      }
    }

    console.log('\n✔️  Migración completada.');
  } catch (err) {
    console.error('❌ Error en la migración:', err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

run();
