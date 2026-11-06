# Plan de trabajo

Fechas fijas del docente: martes 17 de noviembre (frontend) y martes 1 de
diciembre de 2026 (proyecto final). En clase se ve NestJS con base de datos
esta semana y la siguiente; las dos clases semanales son para todos.

Ultima actualizacion: 5 de noviembre de 2026.

## Fase 0 - Base (hasta el domingo 8 de noviembre)
- [x] Crear repositorio en GitHub (taw251-reservas-restaurante) y primer push
- [x] Ordenar carpetas: /backend y /frontend dentro de Proyecto
- [x] .gitignore y .env (no subir secretos); .env.example como plantilla
- [x] Crear la base de datos MySQL y las tablas (database/schema.sql)
- [x] Bosquejar pantallas: login, menu, mesas, reservas, clientes (PANTALLAS.md)

## Fase 1 - Frontend y primer CRUD (9 al 16 de noviembre)
- [x] React (Vite): estructura (pages, components, services, layouts), rutas
      (react-router-dom) y URL del API con VITE_API_URL
- [x] Menu lateral segun rol (Administrador ve ademas Usuarios y Log de accesos);
      rutas de administrador protegidas con RutaPorRol
- [x] Backend: CRUD de Mesas con BD, DTOs y ValidationPipe
- [x] Pantalla de Mesas: listar, crear, editar y dar de baja; validaciones y
      errores del API (400/409)
- [x] Pantalla de Clientes (con buscador por nombre o telefono)
- [x] Pantalla de Reservas (filtros por fecha y estado, mesas disponibles,
      confirmar, editar y cancelar)
- [x] Pantalla de Login con datos SIMULADOS: CAPTCHA, bloqueo tras 3 intentos
      y recuperar contrasenia con medidor de fortaleza (ver TODO(auth))
- [~] Diseno responsive: hecho (menu ☰, tablas como tarjetas); falta probarlo
      en un celular real
- [ ] Martes 17: REVISION DEL FRONTEND

## Fase 2 - Backend y seguridad (18 al 24 de noviembre)
- [x] CRUD de Clientes y Reservas (borrado logico y reglas de negocio)
      -- adelantado en la Fase 1
- [ ] Usuarios: registro con medidor de contrasenia, hash bcrypt
      (el componente MedidorPassword ya existe en el frontend)
- [ ] Autenticacion completa: login JWT, guards por rol, CAPTCHA validado en
      el backend; reemplazar services/authService.js (simulado)
- [ ] Bloqueo tras 3 intentos con desbloqueo por tiempo (en la tabla usuarios)
- [ ] Log de accesos
- [ ] Conectar frontend con backend (login real; enviar el JWT en services/api.js)

## Fase 3 - Funciones restantes (25 al 29 de noviembre)
- [ ] Reporte en PDF
- [ ] Grafico estadistico de ocupacion
- [ ] Recuperacion de contrasenia real (backend; la pantalla ya existe)
- [ ] Swagger
- [ ] Mesas: no permitir dar de baja una mesa con reservas futuras activas
- [ ] Pruebas en celular y correccion de errores

## Fase 4 - Cierre (lunes 30 de noviembre)
- [ ] Publicar en hosting gratuito
- [ ] Configurar TZ=America/La_Paz en el backend desplegado (Docker/hosting):
      la regla "no reservar en fechas u horas pasadas" usa la hora del servidor
- [ ] Docker (docker-compose) y Kubernetes (manifiestos)
- [ ] index.html de entrega (nombre, GitHub, sitio publicado)
- [ ] Enviar el enlace de GitHub y del sitio al Telegram
- [ ] Martes 1 de diciembre: REVISION FINAL

## Pendientes tecnicos anotados
- Lo simulado en el frontend esta marcado con TODO(auth)
  (buscar con: grep -rn "TODO(auth)" frontend/src).
- Mesas con reservas futuras activas no se deben poder dar de baja
  (MesasService.remove). Ojo con la dependencia circular Mesas <-> Reservas.
- TZ=America/La_Paz al desplegar (ver Fase 4).
- En la BD local quedaron datos de prueba: cliente "PRUEBA API (borrar)"
  (dado de baja) y 2 reservas canceladas del 20/12/2026. Se limpian
  reimportando database/schema.sql.

## Riesgos y recortes
- Docker y Kubernetes se subestiman: probarlos antes del 30 si hay tiempo.
- Agente inteligente (opcional): fuera del plan salvo que sobre tiempo.
- Si falta tiempo: recuperar contrasenia puede ser un flujo simple con token
  mostrado en pantalla en vez de enviar correo real.
