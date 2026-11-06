import { peticion } from './api.js'

// Llamadas al recurso /clientes del backend (ClientesController).

// buscar (opcional): filtra por nombre o telefono en el backend.
export function listarClientes(buscar = '') {
  const texto = buscar.trim()
  const consulta = texto ? `?buscar=${encodeURIComponent(texto)}` : ''
  return peticion(`/clientes${consulta}`)
}

export function crearCliente(datos) {
  return peticion('/clientes', { metodo: 'POST', datos })
}

export function actualizarCliente(id, datos) {
  return peticion(`/clientes/${id}`, { metodo: 'PATCH', datos })
}

// Borrado logico: el backend marca activo = false, no elimina la fila.
export function darDeBajaCliente(id) {
  return peticion(`/clientes/${id}`, { metodo: 'DELETE' })
}
