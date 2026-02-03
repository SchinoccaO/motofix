-- Base de datos MotoYA
-- Sistema de gestión de talleres mecánicos y reseñas

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS motoya CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE motoya;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  rol ENUM('usuario', 'taller', 'admin') DEFAULT 'usuario',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de talleres
CREATE TABLE IF NOT EXISTS talleres (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  direccion VARCHAR(255) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(255),
  servicios TEXT, -- CSV: mantenimiento,reparacion,repuestos,pintura
  horario VARCHAR(255),
  foto_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_ciudad (ciudad),
  INDEX idx_user_id (user_id),
  FULLTEXT idx_search (nombre, descripcion, servicios)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de reseñas
CREATE TABLE IF NOT EXISTS resenas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  taller_id INT UNSIGNED NOT NULL,
  rating TINYINT UNSIGNED NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comentario TEXT NOT NULL,
  servicio_usado VARCHAR(100),
  respuesta_taller TEXT,
  fecha_respuesta TIMESTAMP NULL,
  votos_utiles INT UNSIGNED DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (taller_id) REFERENCES talleres(id) ON DELETE CASCADE,
  INDEX idx_taller_id (taller_id),
  INDEX idx_user_id (user_id),
  INDEX idx_rating (rating),
  INDEX idx_created_at (created_at),
  UNIQUE KEY unique_user_taller (user_id, taller_id) -- Un usuario solo puede reseñar un taller una vez
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de fotos de talleres (opcional para futuro)
CREATE TABLE IF NOT EXISTS taller_fotos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  taller_id INT UNSIGNED NOT NULL,
  foto_url VARCHAR(500) NOT NULL,
  descripcion VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (taller_id) REFERENCES talleres(id) ON DELETE CASCADE,
  INDEX idx_taller_id (taller_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de favoritos (opcional para futuro)
CREATE TABLE IF NOT EXISTS favoritos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  taller_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (taller_id) REFERENCES talleres(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorito (user_id, taller_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
