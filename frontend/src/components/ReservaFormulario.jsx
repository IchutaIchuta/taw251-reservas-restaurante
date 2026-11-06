import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Campo from './Campo.jsx'
import { listarClientes } from '../services/clientesService.js'
import { etiquetaUbicacion } from '../services/mesasService.js'
import {
  ESTADOS_RESERVA,
  hoy,
  horaCorta,
  listarMesasDisponibles,
  yaPaso,
} from '../services/reservasService.js'

const ESPERA_DISPONIBLES_MS = 300
const ESTADOS_EDITABLES = ['pendiente', 'confirmada', 'completada']

// Mismas reglas que CreateReservaDto. Las reglas que dependen de la BD
// (capacidad, horario ocupado) las confirma el backend.
function validar(valores, original) {
  const errores = {}

  if (!valores.clienteId) errores.clienteId = 'Seleccione un cliente'
  if (!valores.fecha) errores.fecha = 'La fecha es obligatoria'
  if (!valores.hora) errores.hora = 'La hora es obligatoria'

  // Como en el backend: solo se revisa si cambio la fecha u hora, para
  // poder marcar como completada una reserva que ya paso.
  if (valores.fecha && valores.hora) {
    const cambiaHorario =
      !original ||
      valores.fecha !== original.fecha ||
      valores.hora !== horaCorta(original.hora)
    if (cambiaHorario && yaPaso(valores.fecha, valores.hora)) {
      errores.hora = 'No se pueden registrar reservas en fechas u horas pasadas'
    }
  }

  const personas = Number(valores.cantidadPersonas)
  if (valores.cantidadPersonas === '') {
    errores.cantidadPersonas = 'Indique la cantidad de personas'
  } else if (!Number.isInteger(personas) || personas < 1 || personas > 20) {
    errores.cantidadPersonas = 'Debe ser un entero entre 1 y 20'
  }

  if (!valores.mesaId) errores.mesaId = 'Seleccione una mesa disponible'

  if (valores.observaciones.trim().length > 255) {
    errores.observaciones = 'Las observaciones admiten hasta 255 caracteres'
  }

  return errores
}

// Formulario para crear (reserva = null) o editar una reserva.
// onGuardar(datos) llama al API; si falla, aqui se muestran los errores.
export default function ReservaFormulario({ reserva, onGuardar, onCancelar }) {
  const [valores, setValores] = useState({
    clienteId: reserva ? String(reserva.clienteId) : '',
    fecha: reserva?.fecha ?? hoy(),
    hora: reserva ? horaCorta(reserva.hora) : '',
    cantidadPersonas: reserva ? String(reserva.cantidadPersonas) : '',
    mesaId: reserva ? String(reserva.mesaId) : '',
    observaciones: reserva?.observaciones ?? '',
    estado: reserva?.estado ?? 'pendiente',
  })
  const [errores, setErrores] = useState({})
  const [erroresApi, setErroresApi] = useState([])
  const [guardando, setGuardando] = useState(false)

  const [clientes, setClientes] = useState(null) // null = cargando
  const [mesasDisponibles, setMesasDisponibles] = useState([])
  const [errorListas, setErrorListas] = useState('')

  // Clientes activos para el selector.
  useEffect(() => {
    listarClientes()
      .then(setClientes)
      .catch((error) => {
        setClientes([])
        setErrorListas(error.message)
      })
  }, [])

  const { fecha, hora } = valores
  const personas = Number(valores.cantidadPersonas)
  const datosHorarioCompletos =
    Boolean(fecha && hora) && Number.isInteger(personas) && personas >= 1
  const idReserva = reserva?.id

  // Cada vez que cambian fecha, hora o personas se piden las mesas libres.
  useEffect(() => {
    if (!datosHorarioCompletos) return
    let vigente = true
    const temporizador = setTimeout(() => {
      listarMesasDisponibles({
        fecha,
        hora,
        personas,
        excluirReservaId: idReserva,
      })
        .then((mesas) => {
          if (!vigente) return
          setMesasDisponibles(mesas)
          setErrorListas('')
          // Si la mesa elegida ya no esta libre, se quita la seleccion.
          setValores((anteriores) =>
            mesas.some((mesa) => String(mesa.id) === anteriores.mesaId)
              ? anteriores
              : { ...anteriores, mesaId: '' },
          )
        })
        .catch((error) => {
          if (vigente) setErrorListas(error.message)
        })
    }, ESPERA_DISPONIBLES_MS)
    return () => {
      vigente = false
      clearTimeout(temporizador)
    }
  }, [datosHorarioCompletos, fecha, hora, personas, idReserva])

  // Al editar, el cliente puede estar dado de baja: se agrega a la lista.
  const opcionesClientes =
    reserva && clientes && !clientes.some((c) => c.id === reserva.clienteId)
      ? [reserva.cliente, ...clientes]
      : (clientes ?? [])

  function cambiar(evento) {
    const { name, value } = evento.target
    setValores((anteriores) => ({ ...anteriores, [name]: value }))
    setErrores((anteriores) => ({ ...anteriores, [name]: undefined }))
  }

  async function enviar(evento) {
    evento.preventDefault()
    const nuevosErrores = validar(valores, reserva)
    setErrores(nuevosErrores)
    setErroresApi([])
    if (Object.keys(nuevosErrores).length > 0) return

    setGuardando(true)
    try {
      await onGuardar({
        clienteId: Number(valores.clienteId),
        mesaId: Number(valores.mesaId),
        fecha: valores.fecha,
        hora: valores.hora,
        cantidadPersonas: Number(valores.cantidadPersonas),
        observaciones: valores.observaciones.trim() || null,
        // El estado solo se envia al editar (una reserva nueva es pendiente).
        ...(reserva ? { estado: valores.estado } : {}),
      })
    } catch (error) {
      if (error.status === 409) {
        // 409: la mesa ya esta reservada en ese horario.
        setErrores({ mesaId: error.message })
      } else {
        // 400 (validacion o regla de negocio), 404 u otros.
        setErroresApi(error.mensajes ?? [error.message])
      }
      setGuardando(false)
    }
  }

  if (clientes !== null && opcionesClientes.length === 0 && !errorListas) {
    return (
      <div>
        <p>
          No hay clientes registrados. Primero registre uno en{' '}
          <Link to="/clientes">Clientes</Link>.
        </p>
        <div className="formulario-acciones">
          <button type="button" className="boton boton-secundario" onClick={onCancelar}>
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={enviar} noValidate>
      {(erroresApi.length > 0 || errorListas) && (
        <div className="aviso aviso-error" role="alert">
          <ul>
            {errorListas && <li>{errorListas}</li>}
            {erroresApi.map((mensaje) => (
              <li key={mensaje}>{mensaje}</li>
            ))}
          </ul>
        </div>
      )}

      <Campo id="clienteId" etiqueta="Cliente" error={errores.clienteId}>
        <select
          id="clienteId"
          name="clienteId"
          value={valores.clienteId}
          onChange={cambiar}
          disabled={clientes === null}
          aria-invalid={Boolean(errores.clienteId)}
          aria-describedby={errores.clienteId ? 'clienteId-error' : undefined}
          autoFocus
        >
          <option value="">
            {clientes === null ? 'Cargando clientes...' : 'Seleccione un cliente'}
          </option>
          {opcionesClientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre} - {cliente.telefono}
            </option>
          ))}
        </select>
      </Campo>

      <div className="formulario-fila">
        <Campo id="fecha" etiqueta="Fecha" error={errores.fecha}>
          <input
            id="fecha"
            name="fecha"
            type="date"
            min={reserva ? undefined : hoy()}
            value={valores.fecha}
            onChange={cambiar}
            aria-invalid={Boolean(errores.fecha)}
            aria-describedby={errores.fecha ? 'fecha-error' : undefined}
          />
        </Campo>

        <Campo id="hora" etiqueta="Hora" error={errores.hora}>
          <input
            id="hora"
            name="hora"
            type="time"
            step="900"
            value={valores.hora}
            onChange={cambiar}
            aria-invalid={Boolean(errores.hora)}
            aria-describedby={errores.hora ? 'hora-error' : undefined}
          />
        </Campo>
      </div>

      <div className="formulario-fila">
        <Campo id="cantidadPersonas" etiqueta="Personas" error={errores.cantidadPersonas}>
          <input
            id="cantidadPersonas"
            name="cantidadPersonas"
            type="number"
            inputMode="numeric"
            min="1"
            max="20"
            step="1"
            value={valores.cantidadPersonas}
            onChange={cambiar}
            aria-invalid={Boolean(errores.cantidadPersonas)}
            aria-describedby={
              errores.cantidadPersonas ? 'cantidadPersonas-error' : undefined
            }
          />
        </Campo>

        <Campo id="mesaId" etiqueta="Mesa" error={errores.mesaId}>
          <select
            id="mesaId"
            name="mesaId"
            value={valores.mesaId}
            onChange={cambiar}
            disabled={!datosHorarioCompletos}
            aria-invalid={Boolean(errores.mesaId)}
            aria-describedby={errores.mesaId ? 'mesaId-error' : undefined}
          >
            <option value="">
              {!datosHorarioCompletos
                ? 'Elija fecha, hora y personas'
                : mesasDisponibles.length === 0
                  ? 'No hay mesas libres'
                  : 'Seleccione una mesa'}
            </option>
            {datosHorarioCompletos &&
              mesasDisponibles.map((mesa) => (
                <option key={mesa.id} value={mesa.id}>
                  Mesa {mesa.numero} - {mesa.capacidad} pers. -{' '}
                  {etiquetaUbicacion(mesa.ubicacion)}
                </option>
              ))}
          </select>
        </Campo>
      </div>

      {reserva && (
        <Campo id="estado" etiqueta="Estado">
          <select id="estado" name="estado" value={valores.estado} onChange={cambiar}>
            {ESTADOS_EDITABLES.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADOS_RESERVA[estado]}
              </option>
            ))}
          </select>
        </Campo>
      )}

      <Campo
        id="observaciones"
        etiqueta="Observaciones (opcional)"
        error={errores.observaciones}
      >
        <textarea
          id="observaciones"
          name="observaciones"
          rows="2"
          maxLength={255}
          value={valores.observaciones}
          onChange={cambiar}
          aria-invalid={Boolean(errores.observaciones)}
          aria-describedby={errores.observaciones ? 'observaciones-error' : undefined}
        />
      </Campo>

      <div className="formulario-acciones">
        <button
          type="button"
          className="boton boton-secundario"
          onClick={onCancelar}
          disabled={guardando}
        >
          Cancelar
        </button>
        <button type="submit" className="boton boton-primario" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
