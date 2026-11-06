import { useState } from 'react'
import Campo from './Campo.jsx'

// Mismas reglas que CreateClienteDto del backend.
const PATRON_TELEFONO = /^\+?[0-9 -]{7,20}$/
const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar(valores) {
  const errores = {}

  const nombre = valores.nombre.trim()
  if (!nombre) {
    errores.nombre = 'El nombre es obligatorio'
  } else if (nombre.length > 100) {
    errores.nombre = 'El nombre admite hasta 100 caracteres'
  }

  const telefono = valores.telefono.trim()
  if (!telefono) {
    errores.telefono = 'El telefono es obligatorio'
  } else if (!PATRON_TELEFONO.test(telefono)) {
    errores.telefono =
      'Entre 7 y 20 caracteres: digitos, espacios, guiones y un + inicial'
  }

  const email = valores.email.trim()
  if (email && !PATRON_EMAIL.test(email)) {
    errores.email = 'El email no tiene un formato valido'
  } else if (email.length > 150) {
    errores.email = 'El email admite hasta 150 caracteres'
  }

  return errores
}

// Formulario para crear (cliente = null) o editar un cliente.
// onGuardar(datos) llama al API; si falla, aqui se muestran los errores.
export default function ClienteFormulario({ cliente, onGuardar, onCancelar }) {
  const [valores, setValores] = useState({
    nombre: cliente?.nombre ?? '',
    telefono: cliente?.telefono ?? '',
    email: cliente?.email ?? '',
  })
  const [errores, setErrores] = useState({})
  const [erroresApi, setErroresApi] = useState([])
  const [guardando, setGuardando] = useState(false)

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
        nombre: valores.nombre.trim(),
        telefono: valores.telefono.trim(),
        // Vacio -> null: asi al editar se puede quitar el email.
        email: valores.email.trim() || null,
      })
    } catch (error) {
      // 400 (validacion del DTO), 404 u otros: lista de mensajes.
      setErroresApi(error.mensajes ?? [error.message])
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

      <Campo id="nombre" etiqueta="Nombre" error={errores.nombre}>
        <input
          id="nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          maxLength={100}
          value={valores.nombre}
          onChange={cambiar}
          aria-invalid={Boolean(errores.nombre)}
          aria-describedby={errores.nombre ? 'nombre-error' : undefined}
          autoFocus
        />
      </Campo>

      <Campo id="telefono" etiqueta="Telefono" error={errores.telefono}>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={20}
          value={valores.telefono}
          onChange={cambiar}
          aria-invalid={Boolean(errores.telefono)}
          aria-describedby={errores.telefono ? 'telefono-error' : undefined}
        />
      </Campo>

      <Campo id="email" etiqueta="Email (opcional)" error={errores.email}>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={150}
          value={valores.email}
          onChange={cambiar}
          aria-invalid={Boolean(errores.email)}
          aria-describedby={errores.email ? 'email-error' : undefined}
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
