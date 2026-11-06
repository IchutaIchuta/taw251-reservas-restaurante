import { useState } from 'react'
import { Link } from 'react-router-dom'
import Campo from '../components/Campo.jsx'
import InputPassword from '../components/InputPassword.jsx'
import MedidorPassword from '../components/MedidorPassword.jsx'
import { restablecerPassword, solicitarRecuperacion } from '../services/authService.js'
import { evaluarPassword } from '../services/password.js'

const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Recuperar contrasenia (PANTALLAS.md, pantalla 10), en dos pasos:
// 1) pedir el codigo con el email, 2) codigo + nueva contrasenia.
export default function RecuperarPasswordPage() {
  const [paso, setPaso] = useState(1)
  const [mensajePaso1, setMensajePaso1] = useState('')
  const [codigoDemo, setCodigoDemo] = useState(null)
  const [terminado, setTerminado] = useState('')

  if (terminado) {
    return (
      <>
        <h1>Recuperar contrasenia</h1>
        <p className="aviso aviso-exito" role="status">
          {terminado}
        </p>
        <p className="auth-enlaces">
          <Link to="/login">Ir al inicio de sesion</Link>
        </p>
      </>
    )
  }

  return (
    <>
      <h1>Recuperar contrasenia</h1>
      {paso === 1 ? (
        <PasoEmail
          onEnviado={(respuesta) => {
            setMensajePaso1(respuesta.mensaje)
            setCodigoDemo(respuesta.codigoDemo)
            setPaso(2)
          }}
        />
      ) : (
        <PasoNuevaPassword
          mensaje={mensajePaso1}
          codigoDemo={codigoDemo}
          onTerminado={setTerminado}
          onVolver={() => setPaso(1)}
        />
      )}
      <p className="auth-enlaces">
        <Link to="/login">Volver al inicio de sesion</Link>
      </p>
    </>
  )
}

function PasoEmail({ onEnviado }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(evento) {
    evento.preventDefault()
    if (!email.trim()) return setError('El email es obligatorio')
    if (!PATRON_EMAIL.test(email.trim())) return setError('El email no tiene un formato valido')
    setError('')
    setEnviando(true)
    try {
      onEnviado(await solicitarRecuperacion(email))
    } catch (errorApi) {
      setError(errorApi.message)
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate>
      <p>Escriba el email de su cuenta y le enviaremos un codigo para crear una nueva contrasenia.</p>
      <Campo id="email" etiqueta="Email" error={error}>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          value={email}
          onChange={(evento) => {
            setEmail(evento.target.value)
            setError('')
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'email-error' : undefined}
          autoFocus
        />
      </Campo>
      <button type="submit" className="boton boton-primario" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Enviar codigo'}
      </button>
    </form>
  )
}

function PasoNuevaPassword({ mensaje, codigoDemo, onTerminado, onVolver }) {
  const [valores, setValores] = useState({ codigo: '', password: '', repetir: '' })
  const [errores, setErrores] = useState({})
  const [errorApi, setErrorApi] = useState('')
  const [guardando, setGuardando] = useState(false)

  function cambiar(evento) {
    const { name, value } = evento.target
    setValores((anteriores) => ({ ...anteriores, [name]: value }))
    setErrores((anteriores) => ({ ...anteriores, [name]: undefined }))
  }

  async function enviar(evento) {
    evento.preventDefault()
    const nuevosErrores = {}
    if (!/^\d{6}$/.test(valores.codigo.trim())) {
      nuevosErrores.codigo = 'El codigo tiene 6 digitos'
    }
    if (!valores.password) {
      nuevosErrores.password = 'Escriba la nueva contrasenia'
    } else if (evaluarPassword(valores.password).nivel === 'debil') {
      nuevosErrores.password = 'La contrasenia es debil: debe ser al menos intermedia'
    }
    if (valores.repetir !== valores.password) {
      nuevosErrores.repetir = 'Las contrasenias no coinciden'
    }
    setErrores(nuevosErrores)
    setErrorApi('')
    if (Object.keys(nuevosErrores).length > 0) return

    setGuardando(true)
    try {
      const respuesta = await restablecerPassword({
        codigo: valores.codigo,
        password: valores.password,
      })
      onTerminado(respuesta.mensaje)
    } catch (error) {
      setErrorApi(error.message)
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate>
      <p className="aviso aviso-exito" role="status">
        {mensaje}
        {/* TODO(auth): en produccion el codigo llega por correo, no se muestra. */}
        {codigoDemo && (
          <>
            {' '}
            Codigo (demostracion): <strong className="codigo-demo">{codigoDemo}</strong>
          </>
        )}
      </p>

      {errorApi && (
        <p className="aviso aviso-error" role="alert">
          {errorApi}
        </p>
      )}

      <Campo id="codigo" etiqueta="Codigo recibido" error={errores.codigo}>
        <input
          id="codigo"
          name="codigo"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={valores.codigo}
          onChange={cambiar}
          aria-invalid={Boolean(errores.codigo)}
          aria-describedby={errores.codigo ? 'codigo-error' : undefined}
          autoFocus
        />
      </Campo>

      <Campo id="password" etiqueta="Nueva contrasenia" error={errores.password}>
        <InputPassword
          id="password"
          name="password"
          autoComplete="new-password"
          value={valores.password}
          onChange={cambiar}
          aria-invalid={Boolean(errores.password)}
          aria-describedby={errores.password ? 'password-error' : undefined}
        />
      </Campo>
      <MedidorPassword password={valores.password} />

      <Campo id="repetir" etiqueta="Repetir contrasenia" error={errores.repetir}>
        <InputPassword
          id="repetir"
          name="repetir"
          autoComplete="new-password"
          value={valores.repetir}
          onChange={cambiar}
          aria-invalid={Boolean(errores.repetir)}
          aria-describedby={errores.repetir ? 'repetir-error' : undefined}
        />
      </Campo>

      <button type="submit" className="boton boton-primario" disabled={guardando}>
        {guardando ? 'Guardando...' : 'Guardar contrasenia'}
      </button>
      <p className="auth-enlaces">
        <button type="button" className="boton-enlace" onClick={onVolver}>
          Pedir otro codigo
        </button>
      </p>
    </form>
  )
}
