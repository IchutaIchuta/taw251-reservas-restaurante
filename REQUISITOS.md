# Requisitos del proyecto (enunciado del docente)

Estados: PENDIENTE / EN CURSO / HECHO. Actualizar al avanzar.
Ultima actualizacion: 5 de noviembre de 2026.

| #  | Requisito | Como lo cubrimos | Estado |
|----|-----------|------------------|--------|
| 1  | Objetivo bien definido | Sistema de reservas online para un restaurante | HECHO (hoja Word) |
| 2  | Al menos un menu | Menu lateral en React segun el rol (MainLayout); en celular se abre con ☰ | HECHO |
| 3  | CRUD con eliminacion logica | Mesas y Clientes (activo = false), Reservas (estado cancelada); backend y frontend | HECHO |
| 4  | Frontend en React | Carpeta /frontend (Vite + react-router-dom): mesas, clientes, reservas y login | HECHO (login simulado) |
| 5  | Backend en NestJS | Carpeta /backend: modulos Mesas, Clientes y Reservas con TypeORM + MySQL | EN CURSO (falta autenticacion, usuarios, log, reportes) |
| 6  | Validaciones en campos de entrada | class-validator en DTOs (mensajes en espanol) + validacion en formularios React; errores 400/409 del API en pantalla | HECHO (en los modulos existentes) |
| 7  | Reporte en PDF | Reservas por dia/semana (pdfkit o similar) | PENDIENTE |
| 8  | Grafico estadistico | Ocupacion por dia/horario (Chart.js o Recharts) | PENDIENTE |
| 9  | Contrasenia debil/intermedia/fuerte y guardada encriptada | Medidor (MedidorPassword) hecho en el frontend; falta registro de usuarios y bcrypt en el backend | EN CURSO |
| 10 | Login, permisos y CAPTCHA | Pantalla de login con CAPTCHA propio (canvas) y rutas por rol, con datos SIMULADOS; falta JWT + guards en el backend | EN CURSO |
| 11 | Bloqueo tras 3 intentos y desbloqueo por tiempo | Simulado en el frontend (15 min); falta en la tabla usuarios (intentos_fallidos, bloqueado_hasta) | EN CURSO |
| 12 | Recuperar contrasenia olvidada | Pantalla en 2 pasos con codigo de un solo uso mostrado en pantalla (simulado); falta el backend | EN CURSO |
| 13 | Log de acceso (usuario, IP, evento, browser, fecha/hora) | Tabla log_accesos (ingreso, salida, intento fallido) | PENDIENTE |
| 14 | Funciona en dispositivo movil | Responsive hecho (menu ☰, tablas como tarjetas, botones de 44 px); falta probar en celular real | EN CURSO |
| 15 | API documentada con Swagger o Scalar | @nestjs/swagger en /api | PENDIENTE |
| 16 | Subir a GitHub y enviar la direccion al Telegram | Repo: github.com/IchutaIchuta/taw251-reservas-restaurante; falta enviar el enlace | EN CURSO |
| 17 | Subir a un sitio gratuito y anadir la direccion al mensaje | Frontend (Vercel) + backend y BD (a definir); configurar TZ=America/La_Paz | PENDIENTE |
| 18 | Implementacion sobre Docker | Dockerfile + docker-compose (backend, frontend, MySQL) | PENDIENTE |
| 19 | Implementacion sobre Kubernetes | Manifiestos (deployments y services) probados en local | PENDIENTE |
| 20 | Agente inteligente (opcional) | Solo si sobra tiempo | OPCIONAL |

## Reglas de negocio implementadas (ReservasService)

- Una mesa no puede tener dos reservas activas que se crucen en el bloque de
  BLOQUE_RESERVA_HORAS (2 h): responde 409.
- La cantidad de personas no puede superar la capacidad de la mesa: 400.
- No se reserva en fechas u horas pasadas (hora del servidor): 400.
- Cancelar = borrado logico (estado cancelada); no se cancela dos veces ni una
  reserva completada.
- GET /reservas/mesas-disponibles: mesas libres con capacidad suficiente.

## Pendientes

- Autenticacion completa en el backend (JWT, bcrypt, guards por rol, CAPTCHA
  validado en el servidor, bloqueo, log de accesos) y reemplazar lo simulado
  del frontend (marcado con TODO(auth)).
- Mesas: no permitir dar de baja una mesa con reservas futuras activas.
- Al desplegar: TZ=America/La_Paz en el backend.

## Entregas aparte

- Hoja de presentacion (nombre, proyecto, modulos): HECHO.
- Tarea "Envie el enlace de su GitHub": index.html con nombre completo,
  enlace de GitHub y enlace del proyecto publicado. PENDIENTE.
- Revision del frontend: martes 17 de noviembre de 2026.
- Revision del proyecto final: martes 1 de diciembre de 2026.

## Pendientes por definir

- Hosting gratuito para el backend y la base de datos MySQL.
- Servicio de correo (o alternativa de demostracion) para recuperar contrasenia.
- Libreria de CAPTCHA del backend (por ahora CAPTCHA propio en canvas, simulado).
- Nombre del restaurante.
