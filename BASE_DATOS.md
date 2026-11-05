# Base de datos (borrador, MySQL)

Motor: MySQL (InnoDB, utf8mb4, utf8mb4_unicode_ci), como en clase.
Todas las tablas tienen: id (INT AUTO_INCREMENT PK), created_at, updated_at.
Borrado logico: nunca se usa DELETE sobre datos del negocio.

## usuarios
| Campo | Tipo | Notas |
|-------|------|-------|
| nombre | VARCHAR(100) | obligatorio |
| email | VARCHAR(150) | unico |
| password_hash | VARCHAR(255) | bcrypt |
| nivel_password | ENUM('debil','intermedio','fuerte') | calculado al registrar |
| rol | ENUM('administrador','recepcionista') | |
| activo | TINYINT(1) | borrado logico |
| intentos_fallidos | INT | se reinicia al ingresar bien |
| bloqueado_hasta | DATETIME NULL | bloqueo tras 3 intentos |

## recuperaciones_password
| Campo | Tipo | Notas |
|-------|------|-------|
| usuario_id | INT FK usuarios | |
| token_hash | VARCHAR(255) | token de un solo uso (guardado con hash) |
| expira_en | DATETIME | |
| usado | TINYINT(1) | |

## mesas
| Campo | Tipo | Notas |
|-------|------|-------|
| numero | INT | unico |
| capacidad | INT | > 0 |
| ubicacion | VARCHAR(100) | ej. salon, terraza |
| activo | TINYINT(1) | borrado logico |

## clientes
| Campo | Tipo | Notas |
|-------|------|-------|
| nombre | VARCHAR(100) | obligatorio |
| telefono | VARCHAR(20) | obligatorio |
| email | VARCHAR(150) NULL | opcional |
| activo | TINYINT(1) | borrado logico |

## reservas
| Campo | Tipo | Notas |
|-------|------|-------|
| cliente_id | INT FK clientes | |
| mesa_id | INT FK mesas | |
| fecha | DATE | no puede ser pasada |
| hora | TIME | |
| cantidad_personas | INT | <= capacidad de la mesa |
| estado | ENUM('pendiente','confirmada','cancelada','completada') | cancelar = borrado logico |
| observaciones | VARCHAR(255) NULL | |

Regla: no puede haber dos reservas no canceladas para la misma mesa que se
solapen en fecha y hora (bloque de 2 horas por defecto).

## log_accesos
| Campo | Tipo | Notas |
|-------|------|-------|
| usuario_id | INT NULL FK usuarios | NULL si el email no existe |
| email_intentado | VARCHAR(150) | |
| evento | ENUM('ingreso','salida','intento_fallido','bloqueo') | |
| ip | VARCHAR(45) | |
| navegador | VARCHAR(255) | user-agent |
| fecha_hora | DATETIME | |

## Relaciones

- clientes 1 - N reservas
- mesas 1 - N reservas
- usuarios 1 - N log_accesos
- usuarios 1 - N recuperaciones_password

## Datos iniciales (seed)

- 1 usuario administrador (contrasenia con hash, definida por el autor).
- Unas 6 a 8 mesas de ejemplo con distintas capacidades.

## Por decidir

- Duracion del bloque de reserva (2 horas por defecto) y horario de atencion.
- DECIDIDO: las tablas se crean con database/schema.sql (como en clase);
  TypeORM se usa con synchronize: false. BD: reservas_restaurante.
