# Plan de trabajo

Fechas fijas del docente: martes 17 de noviembre (frontend) y martes 1 de
diciembre de 2026 (proyecto final). En clase se ve NestJS con base de datos
esta semana y la siguiente; las dos clases semanales son para todos.

## Fase 0 - Base (hasta el domingo 8 de noviembre)
- [ ] Crear repositorio en GitHub (con "Desarrollo WEB Backend" en nombre o descripcion) -- repo git local listo; falta crearlo en github.com y hacer push
- [x] Ordenar carpetas: /backend y /frontend dentro de Proyecto
- [x] .gitignore y .env (no subir secretos); .env.example como plantilla
- [x] Crear la base de datos MySQL y las tablas (database/schema.sql)
- [x] Bosquejar pantallas: login, menu, mesas, reservas, clientes (PANTALLAS.md)

## Fase 1 - Frontend y primer CRUD (9 al 16 de noviembre)
- [ ] React (Vite): estructura, rutas y menu segun rol
- [ ] Pantallas: login, mesas, reservas, clientes, con formularios y validaciones
- [ ] Diseno responsive (probar en celular)
- [ ] Backend: CRUD de Mesas con BD, DTOs y ValidationPipe
- [ ] Martes 17: REVISION DEL FRONTEND

## Fase 2 - Backend y seguridad (18 al 24 de noviembre)
- [ ] CRUD de Clientes y Reservas (borrado logico y reglas de negocio)
- [ ] Usuarios: registro con medidor de contrasenia, hash bcrypt
- [ ] Login JWT, guards por rol, CAPTCHA
- [ ] Bloqueo tras 3 intentos con desbloqueo por tiempo
- [ ] Log de accesos
- [ ] Conectar frontend con backend

## Fase 3 - Funciones restantes (25 al 29 de noviembre)
- [ ] Reporte en PDF
- [ ] Grafico estadistico de ocupacion
- [ ] Recuperacion de contrasenia
- [ ] Swagger
- [ ] Pruebas en celular y correccion de errores

## Fase 4 - Cierre (lunes 30 de noviembre)
- [ ] Publicar en hosting gratuito
- [ ] Docker (docker-compose) y Kubernetes (manifiestos)
- [ ] index.html de entrega (nombre, GitHub, sitio publicado)
- [ ] Enviar el enlace de GitHub y del sitio al Telegram
- [ ] Martes 1 de diciembre: REVISION FINAL

## Riesgos y recortes
- Docker y Kubernetes se subestiman: probarlos antes del 30 si hay tiempo.
- Agente inteligente (opcional): fuera del plan salvo que sobre tiempo.
- Si falta tiempo: recuperar contrasenia puede ser un flujo simple con token
  mostrado en pantalla en vez de enviar correo real.
