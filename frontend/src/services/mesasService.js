import { peticion } from './api.js'

// Llamadas al recurso /mesas del backend (MesasController).

export function listarMesas() {
  return peticion('/mesas')
}

export function crearMesa(datos) {
  return peticion('/mesas', { metodo: 'POST', datos })
}

export function actualizarMesa(id, datos) {
  return peticion(`/mesas/${id}`, { metodo: 'PATCH', datos })
}

// Borrado logico: el backend marca activo = false, no elimina la fila.
export function darDeBajaMesa(id) {
  return peticion(`/mesas/${id}`, { metodo: 'DELETE' })
}

// Ubicaciones: valor guardado en la BD -> texto que se muestra.
export const UBICACIONES = {
  salon: 'Salon',
  terraza: 'Terraza',
  privado: 'Privado',
}

export function etiquetaUbicacion(valor) {
  return UBICACIONES[valor] ?? valor
}
