// Datos de la sesion del usuario (guardados en localStorage).

export const ROLES = {
  ADMINISTRADOR: 'administrador',
  RECEPCIONISTA: 'recepcionista',
}

export const ETIQUETAS_ROL = {
  [ROLES.ADMINISTRADOR]: 'Administrador',
  [ROLES.RECEPCIONISTA]: 'Recepcionista',
}

const CLAVE_SESION = 'sesion'

// Usuario que inicio sesion ({ nombre, email, rol }) o null.
// TODO(auth): guardar tambien el JWT y leer el rol desde el token.
export function obtenerUsuario() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION))
  } catch {
    return null
  }
}

export function guardarSesion(usuario) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario))
}

// TODO(auth): avisar al backend (POST /auth/logout) para registrar la
// "salida" en log_accesos.
export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION)
}
