# Bosquejo de pantallas (Fase 0)

Diseno responsive: en escritorio el menu va a la izquierda; en celular se
oculta y se abre con el boton de menu (☰). Las tablas pasan a tarjetas en
pantallas angostas.

## 1. Login
```
+----------------------------------+
|        [Logo] Restaurante        |
|                                  |
|  Email      [__________________] |
|  Contrasena [__________________] |
|                                  |
|  [ CAPTCHA                     ] |
|                                  |
|  [        Ingresar           ]   |
|  ¿Olvidaste tu contrasena?       |
|                                  |
|  ! Cuenta bloqueada. Intente en  |
|    15 minutos. (si aplica)       |
+----------------------------------+
```

## 2. Layout general con menu (segun rol)
```
+-----------+----------------------------------------+
| Restaurante|  Usuario: Ana (Recepcionista) [Salir] |
+-----------+----------------------------------------+
| Inicio    |                                        |
| Reservas  |         (contenido de la pagina)       |
| Mesas     |                                        |
| Clientes  |                                        |
| Reportes  |                                        |
| Usuarios* |                                        |
| Log*      |                                        |
+-----------+----------------------------------------+
 * solo Administrador
```
Celular:
```
+------------------------------+
| ☰  Restaurante       [Salir] |
+------------------------------+
|   (contenido)                |
+------------------------------+
```

## 3. Inicio (ocupacion del dia)
```
Fecha: [05/11/2026 ▼]
+--------+--------+--------+--------+
| Mesa 1 | Mesa 2 | Mesa 3 | Mesa 4 |
| 2 pers | 2 pers | 4 pers | 4 pers |
| LIBRE  | 19:00  | LIBRE  | 20:30  |
+--------+--------+--------+--------+
Reservas hoy: 12   Confirmadas: 8   Pendientes: 4
```

## 4. Mesas (CRUD, borrado logico)
```
Mesas                                   [+ Nueva mesa]
+-----+-----------+-----------+---------------------+
| Nro | Capacidad | Ubicacion | Acciones            |
+-----+-----------+-----------+---------------------+
|  1  |     2     | salon     | [Editar] [Dar baja] |
|  6  |     4     | terraza   | [Editar] [Dar baja] |
+-----+-----------+-----------+---------------------+

Formulario (modal):
  Numero    [___]   Capacidad [___]   Ubicacion [salon ▼]
  [Cancelar] [Guardar]
```

## 5. Reservas (CRUD, cancelar = borrado logico)
```
Reservas   Fecha [05/11/2026]  Estado [Todos ▼]   [+ Nueva reserva]
+-------+-------------+------+-------+-----------+----------------------+
| Hora  | Cliente     | Mesa | Pers. | Estado    | Acciones             |
+-------+-------------+------+-------+-----------+----------------------+
| 19:00 | Juan Perez  |  2   |   2   | confirmada| [Editar] [Cancelar]  |
| 20:30 | Maria Lopez |  4   |   3   | pendiente | [Editar] [Cancelar]  |
+-------+-------------+------+-------+-----------+----------------------+

Formulario:
  Cliente [buscar... ▼] [+ nuevo]
  Fecha [__/__/____]  Hora [__:__]  Personas [__]
  Mesa  [solo mesas libres con capacidad suficiente ▼]
  Observaciones [______________________]
  [Cancelar] [Guardar]
  Errores: "La mesa ya esta reservada en ese horario",
           "Supera la capacidad de la mesa", "Fecha pasada"
```

## 6. Clientes (CRUD, borrado logico)
```
Clientes   [buscar nombre/telefono]          [+ Nuevo cliente]
+--------------+----------+------------------+---------------------+
| Nombre       | Telefono | Email            | Acciones            |
+--------------+----------+------------------+---------------------+
| Juan Perez   | 70012345 | juan@mail.com    | [Editar] [Dar baja] |
+--------------+----------+------------------+---------------------+
```

## 7. Reportes
```
Desde [__/__/____] Hasta [__/__/____]   [Generar PDF]

  Ocupacion por dia (grafico de barras)
  ▇▇▇  ▇▇▇▇▇  ▇▇  ▇▇▇▇▇▇  ▇▇▇▇
  Lun   Mar   Mie  Jue    Vie
```

## 8. Usuarios (solo Administrador)
```
Usuarios                                 [+ Nuevo usuario]
| Nombre | Email | Rol | Estado | Acciones |

Formulario:
  Nombre [____]  Email [____]  Rol [Recepcionista ▼]
  Contrasena [__________]
  Fortaleza: [■■□□□] Intermedia   (debil / intermedia / fuerte)
```

## 9. Log de accesos (solo Administrador)
```
Filtros: Usuario [▼]  Evento [▼]  Fecha [__/__/____]
| Fecha/hora | Usuario | Evento | IP | Navegador |
```

## 10. Recuperar contrasena
```
Paso 1: Email [__________]  [Enviar enlace]
Paso 2: (desde el enlace/token)
  Nueva contrasena [______]  Fortaleza [■■■■□]
  Repetir          [______]  [Guardar]
```
