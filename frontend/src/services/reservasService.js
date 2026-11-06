import { peticion } from './api.js'

// Llamadas al recurso /reservas del backend (ReservasController).

export const ESTADOS_RESERVA = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  completada: 'Completada',
  cancelada: 'Cancelada',
}

// Arma "?a=1&b=2" ignorando los valores vacios.
function armarConsulta(parametros) {
  const consulta = new URLSearchParams()
  for (const [clave, valor] of Object.entries(parametros)) {
    if (valor !== undefined && valor !== null && valor !== '') {
      consulta.set(clave, valor)
    }
  }
  const texto = consulta.toString()
  return texto ? `?${texto}` : ''
}

// fecha: 'AAAA-MM-DD' (vacia = todas). estado vacio = todas menos canceladas.
export function listarReservas({ fecha, estado } = {}) {
  return peticion(`/reservas${armarConsulta({ fecha, estado })}`)
}

export function crearReserva(datos) {
  return peticion('/reservas', { metodo: 'POST', datos })
}

export function actualizarReserva(id, datos) {
  return peticion(`/reservas/${id}`, { metodo: 'PATCH', datos })
}

// Borrado logico: el backend marca estado = 'cancelada'.
export function cancelarReserva(id) {
  return peticion(`/reservas/${id}`, { metodo: 'DELETE' })
}

// Mesas libres en ese horario y con capacidad suficiente.
export function listarMesasDisponibles({ fecha, hora, personas, excluirReservaId }) {
  return peticion(
    `/reservas/mesas-disponibles${armarConsulta({ fecha, hora, personas, excluirReservaId })}`,
  )
}

// ---------------------------------------------------------------------
// Fechas y horas
// ---------------------------------------------------------------------

// Fecha de hoy en hora LOCAL, 'AAAA-MM-DD'. (toISOString usa UTC y de
// noche en Bolivia daria el dia siguiente.)
export function hoy() {
  const ahora = new Date()
  const mes = String(ahora.getMonth() + 1).padStart(2, '0')
  const dia = String(ahora.getDate()).padStart(2, '0')
  return `${ahora.getFullYear()}-${mes}-${dia}`
}

// '20:00:00' -> '20:00'
export function horaCorta(hora) {
  return hora ? hora.slice(0, 5) : ''
}

// '2026-11-20' -> '20/11/2026'
export function formatearFecha(fecha) {
  const [anio, mes, dia] = fecha.split('-')
  return `${dia}/${mes}/${anio}`
}

// true si la fecha y hora (locales) ya pasaron.
export function yaPaso(fecha, hora) {
  return new Date(`${fecha}T${horaCorta(hora)}:00`).getTime() <= Date.now()
}
