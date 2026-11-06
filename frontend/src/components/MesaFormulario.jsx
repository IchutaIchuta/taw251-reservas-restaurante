import { useState } from 'react'
import Campo from './Campo.jsx'
import { etiquetaUbicacion, UBICACIONES } from '../services/mesasService.js'

// Mismas reglas que CreateMesaDto del backend.
function validar(valores) {
  const errores = {}

  const numero = Number(valores.numero)
  if (valores.numero === '') {
    errores.numero = 'El numero de mesa es obligatorio'
  } else if (!Number.isInteger(numero) || numero < 1) {
    errores.numero = 'El numero de mesa debe ser un entero mayor a 0'
  }

  const capacidad = Number(valores.capacidad)
  if (valores.capacidad === '') {
    errores.capacidad = 'La capacidad es obligatoria'
  } else if (!Number.isInteger(capacidad) || capacidad < 1 || capacidad > 20) {
    errores.capacidad = 'La capacidad debe ser un entero entre 1 y 20'
  }

  const ubicacion = valores.ubicacion.trim()
  if (!ubicacion) {
    errores.ubicacion = 'La ubicacion es obligatoria'
  } else if (ubicacion.length > 100) {
    errores.ubicacion = 'La ubicacion admite hasta 100 caracteres'
  }

  return errores
}

// Formulario para crear (mesa = null) o editar una mesa.
// onGuardar(datos) llama al API; si falla, aqui se muestran los errores.
export default function MesaFormulario({ mesa, onGuardar, onCancelar }) {
  const [valores, setValores] = useState({
    numero: mesa ? String(mesa.numero) : '',
    capacidad: mesa ? String(mesa.capacidad) : '',
    ubicacion: mesa?.ubicacion ?? 'salon',
  })
  const [errores, setErrores] = useState({})
  const [erroresApi, setErroresApi] = useState([])
  const [guardando, setGuardando] = useState(false)

  // Si la mesa tiene una ubicacion que no esta en la lista, se agrega.
  const opcionesUbicacion = Object.keys(UBICACIONES).includes(valores.ubicacion)
    ? Object.keys(UBICACIONES)
    : [...Object.keys(UBICACIONES), valores.ubicacion]

  function cambiar(evento) {
    const { name, value } = evento.target
    setValores((anteriores) => ({ ...anteriores, [name]: value }))
    setErrores((anteriores) => ({ ...anteriores, [name]: undefined }))
  }

  async function enviar(evento) {
    evento.preventDefault()
    const nuevosErrores = validar(valores)
    setErrores(nuevosErrores)
    setErroresApi([])
    if (Object.keys(nuevosErrores).length > 0) return

    setGuardando(true)
    try {
      await onGuardar({
        numero: Number(valores.numero),
        capacidad: Number(valores.capacidad),
        ubicacion: valores.ubicacion.trim(),
      })
    } catch (error) {
      if (error.status === 409) {
        // 409: numero de mesa repetido -> se muestra junto al campo.
        setErrores({ numero: error.message })
      } else {
        // 400 (validacion del DTO), 404 u otros: lista de mensajes.
        setErroresApi(error.mensajes ?? [error.message])
      }
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate>
      {erroresApi.length > 0 && (
        <div className="aviso aviso-error" role="alert">
          <ul>
            {erroresApi.map((mensaje) => (
              <li key={mensaje}>{mensaje}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="formulario-fila">
        <Campo id="numero" etiqueta="Numero" error={errores.numero}>
          <input
            id="numero"
            name="numero"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={valores.numero}
            onChange={cambiar}
            aria-invalid={Boolean(errores.numero)}
            aria-describedby={errores.numero ? 'numero-error' : undefined}
            autoFocus
          />
        </Campo>

        <Campo id="capacidad" etiqueta="Capacidad" error={errores.capacidad}>
          <input
            id="capacidad"
            name="capacidad"
            type="number"
            inputMode="numeric"
            min="1"
            max="20"
            step="1"
            value={valores.capacidad}
            onChange={cambiar}
            aria-invalid={Boolean(errores.capacidad)}
            aria-describedby={errores.capacidad ? 'capacidad-error' : undefined}
          />
        </Campo>
      </div>

      <Campo id="ubicacion" etiqueta="Ubicacion" error={errores.ubicacion}>
        <select
          id="ubicacion"
          name="ubicacion"
          value={valores.ubicacion}
          onChange={cambiar}
          aria-invalid={Boolean(errores.ubicacion)}
          aria-describedby={errores.ubicacion ? 'ubicacion-error' : undefined}
        >
          {opcionesUbicacion.map((valor) => (
            <option key={valor} value={valor}>
              {etiquetaUbicacion(valor)}
            </option>
          ))}
        </select>
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
