import { useCallback, useEffect, useState } from 'react'
import Modal from '../components/Modal.jsx'
import ReservaFormulario from '../components/ReservaFormulario.jsx'
import {
  actualizarReserva,
  cancelarReserva,
  crearReserva,
  ESTADOS_RESERVA,
  formatearFecha,
  horaCorta,
  hoy,
  listarReservas,
} from '../services/reservasService.js'

// CRUD de reservas (PANTALLAS.md, pantalla 5). Cancelar = borrado logico.
export default function ReservasPage() {
  const [reservas, setReservas] = useState([])
  const [filtroFecha, setFiltroFecha] = useState(hoy())
  const [filtroEstado, setFiltroEstado] = useState('') // '' = activas
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [aviso, setAviso] = useState('')
  const [errorAccion, setErrorAccion] = useState('')

  // Dialogo abierto: null, { tipo: 'formulario', reserva } o { tipo: 'cancelar', reserva }.
  // En el formulario, reserva = null significa "nueva reserva".
  const [dialogo, setDialogo] = useState(null)
  const [cancelando, setCancelando] = useState(false)

  const cargarReservas = useCallback(() => {
    return listarReservas({ fecha: filtroFecha, estado: filtroEstado })
      .then((datos) => {
        setReservas(datos)
        setErrorCarga('')
      })
      .catch((error) => setErrorCarga(error.message))
      .finally(() => setCargando(false))
  }, [filtroFecha, filtroEstado])

  // Carga inicial y cada vez que cambian los filtros.
  useEffect(() => {
    cargarReservas()
  }, [cargarReservas])

  function limpiarMensajes() {
    setAviso('')
    setErrorAccion('')
  }

  function abrirDialogo(nuevoDialogo) {
    limpiarMensajes()
    setDialogo(nuevoDialogo)
  }

  const cerrarDialogo = useCallback(() => setDialogo(null), [])

  // Si el API responde error, la excepcion la captura ReservaFormulario.
  async function guardarReserva(datos) {
    const reserva = dialogo.reserva
    if (reserva) {
      await actualizarReserva(reserva.id, datos)
      setAviso('Reserva actualizada')
    } else {
      const nueva = await crearReserva(datos)
      setAviso(
        `Reserva registrada: mesa ${nueva.mesa.numero}, ${formatearFecha(nueva.fecha)} a las ${horaCorta(nueva.hora)}`,
      )
    }
    setDialogo(null)
    await cargarReservas()
  }

  // Accion rapida de la tabla: pendiente -> confirmada.
  async function confirmar(reserva) {
    limpiarMensajes()
    try {
      await actualizarReserva(reserva.id, { estado: 'confirmada' })
      setAviso(`Reserva de ${reserva.cliente.nombre} confirmada`)
      await cargarReservas()
    } catch (error) {
      setErrorAccion(error.message)
    }
  }

  async function confirmarCancelacion() {
    setCancelando(true)
    setErrorAccion('')
    try {
      const respuesta = await cancelarReserva(dialogo.reserva.id)
      setAviso(respuesta.mensaje)
      setDialogo(null)
      await cargarReservas()
    } catch (error) {
      setErrorAccion(error.message)
    } finally {
      setCancelando(false)
    }
  }

  const mostrarFecha = !filtroFecha // sin filtro de fecha se ve la columna

  return (
    <section>
      <div className="pagina-encabezado">
        <h1>Reservas</h1>
        <button
          type="button"
          className="boton boton-primario"
          onClick={() => abrirDialogo({ tipo: 'formulario', reserva: null })}
        >
          + Nueva reserva
        </button>
      </div>

      <div className="filtros">
        <div className="campo">
          <label htmlFor="filtro-fecha">Fecha</label>
          <input
            id="filtro-fecha"
            type="date"
            value={filtroFecha}
            onChange={(evento) => setFiltroFecha(evento.target.value)}
          />
        </div>
        <div className="campo">
          <label htmlFor="filtro-estado">Estado</label>
          <select
            id="filtro-estado"
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
          >
            <option value="">Activas (sin canceladas)</option>
            {Object.entries(ESTADOS_RESERVA).map(([valor, texto]) => (
              <option key={valor} value={valor}>
                {texto}
              </option>
            ))}
          </select>
        </div>
        <div className="filtros-botones">
          <button
            type="button"
            className="boton boton-secundario"
            onClick={() => setFiltroFecha(hoy())}
          >
            Hoy
          </button>
          <button
            type="button"
            className="boton boton-secundario"
            onClick={() => setFiltroFecha('')}
          >
            Todas las fechas
          </button>
        </div>
      </div>

      {aviso && (
        <p className="aviso aviso-exito" role="status">
          {aviso}
        </p>
      )}

      {errorAccion && !dialogo && (
        <p className="aviso aviso-error" role="alert">
          {errorAccion}
        </p>
      )}

      {errorCarga && (
        <div className="aviso aviso-error" role="alert">
          {errorCarga}{' '}
          <button type="button" className="boton boton-secundario" onClick={cargarReservas}>
            Reintentar
          </button>
        </div>
      )}

      {cargando ? (
        <p>Cargando reservas...</p>
      ) : (
        !errorCarga &&
        (reservas.length === 0 ? (
          <p>No hay reservas para los filtros elegidos.</p>
        ) : (
          <table className="tabla">
            <thead>
              <tr>
                {mostrarFecha && <th>Fecha</th>}
                <th>Hora</th>
                <th>Cliente</th>
                <th>Mesa</th>
                <th>Pers.</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <tr key={reserva.id}>
                  {mostrarFecha && (
                    <td data-label="Fecha">{formatearFecha(reserva.fecha)}</td>
                  )}
                  <td data-label="Hora">{horaCorta(reserva.hora)}</td>
                  <td data-label="Cliente">
                    <span className="celda-cliente">
                      {reserva.cliente.nombre}
                      <small>{reserva.cliente.telefono}</small>
                    </span>
                  </td>
                  <td data-label="Mesa">{reserva.mesa.numero}</td>
                  <td data-label="Personas">{reserva.cantidadPersonas}</td>
                  <td data-label="Estado">
                    <span className={`estado estado-${reserva.estado}`}>
                      {ESTADOS_RESERVA[reserva.estado]}
                    </span>
                  </td>
                  <td className="celda-acciones">
                    <AccionesReserva
                      reserva={reserva}
                      onConfirmar={() => confirmar(reserva)}
                      onEditar={() => abrirDialogo({ tipo: 'formulario', reserva })}
                      onCancelar={() => abrirDialogo({ tipo: 'cancelar', reserva })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))
      )}

      {dialogo?.tipo === 'formulario' && (
        <Modal
          titulo={dialogo.reserva ? 'Editar reserva' : 'Nueva reserva'}
          onCerrar={cerrarDialogo}
        >
          <ReservaFormulario
            reserva={dialogo.reserva}
            onGuardar={guardarReserva}
            onCancelar={cerrarDialogo}
          />
        </Modal>
      )}

      {dialogo?.tipo === 'cancelar' && (
        <Modal titulo="Cancelar reserva" onCerrar={cerrarDialogo}>
          <p>
            Reserva de <strong>{dialogo.reserva.cliente.nombre}</strong>, mesa{' '}
            {dialogo.reserva.mesa.numero}, {formatearFecha(dialogo.reserva.fecha)} a
            las {horaCorta(dialogo.reserva.hora)}.
          </p>
          <p>
            La mesa queda libre en ese horario. La reserva no se elimina: se puede
            ver filtrando por el estado Cancelada.
          </p>
          {errorAccion && (
            <p className="aviso aviso-error" role="alert">
              {errorAccion}
            </p>
          )}
          <div className="formulario-acciones">
            <button
              type="button"
              className="boton boton-secundario"
              onClick={cerrarDialogo}
              disabled={cancelando}
            >
              Volver
            </button>
            <button
              type="button"
              className="boton boton-peligro"
              onClick={confirmarCancelacion}
              disabled={cancelando}
            >
              {cancelando ? 'Cancelando...' : 'Cancelar reserva'}
            </button>
          </div>
        </Modal>
      )}
    </section>
  )
}

// Botones segun el estado: una cancelada ya no se toca y una completada
// no se puede cancelar (igual que en el backend).
function AccionesReserva({ reserva, onConfirmar, onEditar, onCancelar }) {
  if (reserva.estado === 'cancelada') {
    return <span className="texto-suave">Sin acciones</span>
  }

  return (
    <div className="tabla-acciones">
      {reserva.estado === 'pendiente' && (
        <button type="button" className="boton boton-primario" onClick={onConfirmar}>
          Confirmar
        </button>
      )}
      <button type="button" className="boton boton-secundario" onClick={onEditar}>
        Editar
      </button>
      {reserva.estado !== 'completada' && (
        <button type="button" className="boton boton-peligro" onClick={onCancelar}>
          Cancelar
        </button>
      )}
    </div>
  )
}
