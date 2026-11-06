import { ROLES } from '../services/sesion.js'

const TODOS = [ROLES.ADMINISTRADOR, ROLES.RECEPCIONISTA]
const SOLO_ADMIN = [ROLES.ADMINISTRADOR]

// Opciones del menu y que roles las ven (ver CLAUDE.md, "Roles").
export const OPCIONES_MENU = [
  { ruta: '/', texto: 'Inicio', roles: TODOS },
  { ruta: '/reservas', texto: 'Reservas', roles: TODOS },
  { ruta: '/mesas', texto: 'Mesas', roles: TODOS },
  { ruta: '/clientes', texto: 'Clientes', roles: TODOS },
  { ruta: '/reportes', texto: 'Reportes', roles: TODOS },
  { ruta: '/usuarios', texto: 'Usuarios', roles: SOLO_ADMIN },
  { ruta: '/log-accesos', texto: 'Log de accesos', roles: SOLO_ADMIN },
]

export function opcionesParaRol(rol) {
  return OPCIONES_MENU.filter((opcion) => opcion.roles.includes(rol))
}
