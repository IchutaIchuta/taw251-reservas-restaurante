# Sistema de Reservas Online para Restaurante

Proyecto de la materia **Desarrollo WEB Backend (TAW-251 Electiva I)** —
UMSA Informatica, 2026. Autor: Abraham Ichuta Tuco.

Sistema web para gestionar reservas de mesas (fecha, hora, personas) y ver la
ocupacion diaria del restaurante.

## Stack
- Frontend: React (Vite)
- Backend: NestJS + TypeORM
- Base de datos: MySQL
- Autenticacion: JWT + bcrypt
- Documentacion API: Swagger

## Estructura
```
backend/    API NestJS (puerto 3000)
frontend/   React + Vite (puerto 5173)
database/   schema.sql (tablas y datos iniciales)
```

## Puesta en marcha (local)
1. Iniciar MySQL (XAMPP) y crear la base de datos:
   `mysql -u root < database/schema.sql` (o importarlo en phpMyAdmin).
2. Backend:
   ```
   cd backend
   cp .env.example .env   # completar valores
   npm install
   npm run start:dev
   ```
3. Frontend:
   ```
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```
