-- =====================================================================
-- Sistema de Reservas Online para Restaurante
-- TAW-251 Desarrollo Web Backend - UMSA Informatica 2026
-- Script de creacion de la base de datos (MySQL / XAMPP)
-- Ejecutar: mysql -u root < database/schema.sql   (o pegar en phpMyAdmin)
-- =====================================================================

DROP DATABASE IF EXISTS reservas_restaurante;
CREATE DATABASE reservas_restaurante
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE reservas_restaurante;

-- ---------------------------------------------------------------------
-- usuarios
-- ---------------------------------------------------------------------
CREATE TABLE usuarios (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  nombre            VARCHAR(100) NOT NULL,
  email             VARCHAR(150) NOT NULL,
  password_hash     VARCHAR(255) NOT NULL,
  nivel_password    ENUM('debil','intermedio','fuerte') NOT NULL,
  rol               ENUM('administrador','recepcionista') NOT NULL DEFAULT 'recepcionista',
  activo            TINYINT(1) NOT NULL DEFAULT 1,
  intentos_fallidos INT NOT NULL DEFAULT 0,
  bloqueado_hasta   DATETIME NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_usuarios_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- recuperaciones_password (token de un solo uso, guardado con hash)
-- ---------------------------------------------------------------------
CREATE TABLE recuperaciones_password (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT NOT NULL,
  token_hash  VARCHAR(255) NOT NULL,
  expira_en   DATETIME NOT NULL,
  usado       TINYINT(1) NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_recuperaciones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- mesas
-- ---------------------------------------------------------------------
CREATE TABLE mesas (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  numero      INT NOT NULL,
  capacidad   INT NOT NULL,
  ubicacion   VARCHAR(100) NOT NULL,
  activo      TINYINT(1) NOT NULL DEFAULT 1,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_mesas_numero UNIQUE (numero),
  CONSTRAINT ck_mesas_capacidad CHECK (capacidad > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- clientes
-- ---------------------------------------------------------------------
CREATE TABLE clientes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  telefono    VARCHAR(20)  NOT NULL,
  email       VARCHAR(150) NULL,
  activo      TINYINT(1) NOT NULL DEFAULT 1,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- reservas
-- Regla de solapamiento (misma mesa, bloque de 2 h) y fecha no pasada:
-- se validan en ReservasService, no en la BD.
-- ---------------------------------------------------------------------
CREATE TABLE reservas (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id         INT NOT NULL,
  mesa_id            INT NOT NULL,
  fecha              DATE NOT NULL,
  hora               TIME NOT NULL,
  cantidad_personas  INT NOT NULL,
  estado             ENUM('pendiente','confirmada','cancelada','completada') NOT NULL DEFAULT 'pendiente',
  observaciones      VARCHAR(255) NULL,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reservas_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  CONSTRAINT fk_reservas_mesa    FOREIGN KEY (mesa_id)    REFERENCES mesas(id),
  CONSTRAINT ck_reservas_personas CHECK (cantidad_personas > 0),
  INDEX idx_reservas_mesa_fecha (mesa_id, fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- log_accesos
-- ---------------------------------------------------------------------
CREATE TABLE log_accesos (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id       INT NULL,
  email_intentado  VARCHAR(150) NOT NULL,
  evento           ENUM('ingreso','salida','intento_fallido','bloqueo') NOT NULL,
  ip               VARCHAR(45)  NULL,
  navegador        VARCHAR(255) NULL,
  fecha_hora       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_log_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  INDEX idx_log_fecha (fecha_hora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- Datos iniciales
-- El usuario administrador se crea en la Fase 2 con un script de seed
-- del backend (necesita bcrypt para generar el hash de la contrasenia).
-- =====================================================================
INSERT INTO mesas (numero, capacidad, ubicacion) VALUES
  (1, 2, 'salon'),
  (2, 2, 'salon'),
  (3, 4, 'salon'),
  (4, 4, 'salon'),
  (5, 6, 'salon'),
  (6, 4, 'terraza'),
  (7, 6, 'terraza'),
  (8, 8, 'privado');
