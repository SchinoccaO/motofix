import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../src/config/db.js';

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Check if google_id column exists
    const [cols] = await sequelize.query(`SHOW COLUMNS FROM users LIKE 'google_id'`);
    if (cols.length === 0) {
      // Add google_id column (without UNIQUE - TiDB doesn't support it in ADD COLUMN)
      await sequelize.query(`ALTER TABLE users ADD COLUMN google_id VARCHAR(255) DEFAULT NULL`);
      console.log('Added google_id column');

      // Add unique index separately
      await sequelize.query(`CREATE UNIQUE INDEX idx_users_google_id ON users (google_id)`).catch(e => {
        if (e.message.includes('Duplicate') || e.message.includes('already exists')) {
          console.log('google_id index already exists');
        } else {
          throw e;
        }
      });
      console.log('Added unique index on google_id');
    } else {
      console.log('google_id column already exists');
    }

    // Check if auth_provider column exists
    const [cols2] = await sequelize.query(`SHOW COLUMNS FROM users LIKE 'auth_provider'`);
    if (cols2.length === 0) {
      await sequelize.query(`ALTER TABLE users ADD COLUMN auth_provider VARCHAR(10) NOT NULL DEFAULT 'local'`);
      console.log('Added auth_provider column');
    } else {
      console.log('auth_provider column already exists');
    }

    // Make password_hash nullable
    await sequelize.query(`ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL`);
    console.log('Made password_hash nullable');

    console.log('\nMigration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
