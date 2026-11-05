# Requisitos del proyecto (enunciado del docente)

Estados: PENDIENTE / EN CURSO / HECHO. Actualizar al avanzar.

| #  | Requisito | Como lo cubrimos | Estado |
|----|-----------|------------------|--------|
| 1  | Objetivo bien definido | Sistema de reservas online para un restaurante | HECHO (hoja Word) |
| 2  | Al menos un menu | Menu lateral/superior en React segun el rol | PENDIENTE |
| 3  | CRUD con eliminacion logica | Mesas, Clientes (activo) y Reservas (estado cancelada) | PENDIENTE |
| 4  | Frontend en React | Carpeta /frontend (Vite) | EN CURSO (proyecto creado) |
| 5  | Backend en NestJS | Carpeta /backend | EN CURSO (proyecto creado, conectado a MySQL) |
| 6  | Validaciones en campos de entrada | class-validator en DTOs + validacion en formularios React | PENDIENTE |
| 7  | Reporte en PDF | Reservas por dia/semana (pdfkit o similar) | PENDIENTE |
| 8  | Grafico estadistico | Ocupacion por dia/horario (Chart.js o Recharts) | PENDIENTE |
| 9  | Contrasenia debil/intermedia/fuerte y guardada encriptada | Medidor al registrar usuario + bcrypt | PENDIENTE |
| 10 | Login, permisos y CAPTCHA | JWT + guards por rol + CAPTCHA en el login | PENDIENTE |
| 11 | Bloqueo tras 3 intentos y desbloqueo por tiempo | Campos intentos_fallidos y bloqueado_hasta en usuarios | PENDIENTE |
| 12 | Recuperar contrasenia olvidada | Token temporal de un solo uso con expiracion (enlace por correo o mostrado en pantalla en demo) | PENDIENTE |
| 13 | Log de acceso (usuario, IP, evento, browser, fecha/hora) | Tabla log_accesos (ingreso, salida, intento fallido) | PENDIENTE |
| 14 | Funciona en dispositivo movil | Diseno responsive, probar en celular | PENDIENTE |
| 15 | API documentada con Swagger o Scalar | @nestjs/swagger en /api | PENDIENTE |
| 16 | Subir a GitHub y enviar la direccion al Telegram | Repo propio; enlace al inbox del Telegram | PENDIENTE |
| 17 | Subir a un sitio gratuito y anadir la direccion al mensaje | Frontend (Vercel) + backend y BD (a definir) | PENDIENTE |
| 18 | Implementacion sobre Docker | Dockerfile + docker-compose (backend, frontend, MySQL) | PENDIENTE |
| 19 | Implementacion sobre Kubernetes | Manifiestos (deployments y services) probados en local | PENDIENTE |
| 20 | Agente inteligente (opcional) | Solo si sobra tiempo | OPCIONAL |

## Entregas aparte

- Hoja de presentacion (nombre, proyecto, modulos): HECHO.
- Tarea "Envie el enlace de su GitHub": index.html con nombre completo,
  enlace de GitHub y enlace del proyecto publicado. PENDIENTE.
- Revision del frontend: martes 17 de noviembre de 2026.
- Revision del proyecto final: martes 1 de diciembre de 2026.

## Pendientes por definir

- Hosting gratuito para el backend y la base de datos MySQL.
- Servicio de correo (o alternativa de demostracion) para recuperar contrasenia.
- Libreria de CAPTCHA.
- Nombre del restaurante.
