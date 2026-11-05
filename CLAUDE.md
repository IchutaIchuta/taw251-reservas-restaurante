# Sistema de Reservas Online para Restaurante
# UMSA Informatica - TAW-251 Electiva I Desarrollo Backend - 2026
# Autor: Abraham Ichuta Tuco

---

## DESCRIPCION DEL PROYECTO

Proyecto individual de la materia Desarrollo Web Backend. Sistema web para
que un restaurante gestione reservas de mesas (fecha, hora, cantidad de
personas) y vea su ocupacion diaria.

- Es un proyecto APARTE de la tesis de grado (restaurante-sistema-v2). No
  se mezclan repositorios ni codigo.
- Nombre del restaurante: POR DEFINIR (mas adelante). Puede ser ficticio o
  el mismo negocio de la tesis, no afecta el diseno.
- Nombre del proyecto en la hoja entregada: "Sistema de Reservas Online
  para Restaurante" (la hoja Word dice "de Pollos"; es solo un marcador).

---

## STACK TECNOLOGICO

- Frontend:          React (Vite), responsive (debe verse bien en celular)
- Backend:           NestJS (CLI 12.x), TypeScript
- Base de datos:     MySQL (XAMPP en local) con mysql2 / TypeORM, igual que
                     en clase (NestJS Parte 2)
- Autenticacion:     JWT, contrasenias con hash (bcrypt)
- Documentacion API: Swagger (@nestjs/swagger)
- Contenedores:      Docker y Kubernetes (demostracion)
- Control versiones: Git + GitHub (repositorio propio, con la materia
  "Desarrollo WEB Backend" indicada en el nombre o la descripcion)
- Entorno:           Node 24 (via nvm-windows), Windows 11, VS Code

Puertos en desarrollo: backend 3000, frontend 5173 (CORS habilitado hacia
http://localhost:5173).

---

## ESTRUCTURA DE CARPETAS

```
Proyecto/
    ├── CLAUDE.md
    ├── REQUISITOS.md
    ├── BASE_DATOS.md
    ├── PLAN.md
    ├── /backend        -> NestJS
    └── /frontend       -> React
```

---

## MODULOS DEL SISTEMA (6)

1. Autenticacion y Usuarios: login con roles, CAPTCHA, bloqueo tras 3
   intentos fallidos, recuperacion de contrasenia, registro con medidor de
   fortaleza (debil / intermedio / fuerte).
2. Mesas: CRUD (numero, capacidad, ubicacion) con borrado logico.
3. Reservas: CRUD (cliente, mesa, fecha, hora, personas, estado) con
   cancelacion como borrado logico.
4. Clientes: registro simple de quien reserva (nombre, telefono, email).
5. Reportes: PDF de reservas y grafico estadistico de ocupacion.
6. Log de Accesos: usuario, IP, evento, navegador, fecha y hora.

Roles: Administrador (acceso total) y Recepcionista (gestiona reservas,
clientes y mesas; no ve usuarios ni log de accesos).

---

## REGLAS DE NEGOCIO

1. Una mesa no puede tener dos reservas activas en el mismo horario
   (cada reserva ocupa un bloque fijo, por defecto 2 horas).
2. La cantidad de personas no puede superar la capacidad de la mesa.
3. No se pueden crear reservas en fechas u horas pasadas.
4. BORRADO LOGICO: nada se elimina de la base de datos. Se marca con
   activo = false (mesas, clientes) o estado = 'cancelada' (reservas).
5. Estados de reserva: pendiente, confirmada, cancelada, completada.
6. Tras 3 intentos fallidos de login la cuenta se bloquea un tiempo
   configurable (por defecto 15 minutos) y se registra en el log.
7. Cada ingreso, salida e intento fallido se guarda en log_accesos.

---

## CONVENCIONES DEL CODIGO

- Idioma del codigo: Espanol (tablas, variables, funciones), igual que el
  material de clase (productos, ProductosService, etc.).
- Tablas BD: snake_case en espanol, en plural (ej. log_accesos).
- Todas las tablas tienen: id, created_at, updated_at.
- Modulos/Controladores/Servicios NestJS: PascalCase en espanol
  (ej. ReservasModule, ReservasController, ReservasService).
- Generar recursos con: nest g resource nombre (ojo: el CLI singulariza mal
  en espanol, ej. "habitaciones" -> "Habitacione"; revisar los nombres de
  las clases despues de generarlas).
- DTOs con class-validator; ValidationPipe global con whitelist y
  transform activados (como en el material de clase).
- Rutas API en kebab-case, en plural (ej. /reservas, /log-accesos).
- Contrasenias SIEMPRE con hash, nunca texto plano ni en el log.
- Imports con extension .js (como en el material de clase) si el proyecto
  esta en modo ES modules; mantener consistente.

---

## SEGURIDAD

- Hash de contrasenias (bcrypt), JWT con expiracion, guards por rol.
- Validacion de datos en backend (DTOs) y en frontend (formularios).
- Bloqueo por intentos fallidos y CAPTCHA en el login.
- Variables sensibles (claves, JWT secret, credenciales de BD) en .env,
  que NO se sube a GitHub (.gitignore).

---

## FECHAS IMPORTANTES

- Martes 17 de noviembre de 2026: revision de los frontend.
- Martes 1 de diciembre de 2026: revision del proyecto final.
- Entrega del enlace de GitHub: tarea "Envie el enlace de su GitHub"
  (archivo index.html con nombre completo, enlace de GitHub y enlace del
  sitio publicado). Aun sin enviar al 5 de noviembre.

Ver PLAN.md para el calendario y REQUISITOS.md para el avance.
