import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Campo from '../components/Campo.jsx'
import Captcha from '../components/Captcha.jsx'
import InputPassword from '../components/InputPassword.jsx'
import { CREDENCIALES_DEMO, iniciarSesion } from '../services/authService.js'
import { captchaCoincide, generarCodigoCaptcha } from '../services/captcha.js'
import { ETIQUETAS_ROL, obtenerUsuario } from '../services/sesion.js'

const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar(valores) {
  const errores = {}
  if (!valores.email.trim()) {
    errores.email = 'El email es obligatorio'
  } else if (!PATRON_EMAIL.test(valores.email.trim())) {
    errores.email = 'El email no tiene un formato valido'
  }
  if (!valores.password) errores.password = 'La contrasenia es obligatoria'
  if (!valores.captcha.trim()) errores.captcha = 'Escriba el codigo de la imagen'
  return errores
}

// Pantalla de login (PANTALLAS.md, pantalla 1).
export default function LoginPage() {
  const navigate = useNavigate()
  const [valores, setValores] = useState({ email: '', password: '', captcha: '' })
  const [codigoCaptcha, setCodigoCaptcha] = useState(generarCodigoCaptcha)
  const [errores, setErrores] = useState({})
  const [errorLogin, setErrorLogin] = useState('')
  const [ingresando, setIngresando] = useState(false)

  // Si ya hay sesion, no tiene sentido mostrar el login.
  if (obtenerUsuario()) {
    return <Navigate to="/" replace />
  }

  function cambiar(evento) {
    const { name, value } = evento.target
    setValores((anteriores) => ({ ...anteriores, [name]: value }))
    setErrores((anteriores) => ({ ...anteriores, [name]: undefined }))
  }

  // Nuevo codigo y se borra lo escrito en el campo del CAPTCHA.
  function refrescarCaptcha() {
    setCodigoCaptcha(generarCodigoCaptcha())
    setValores((anteriores) => ({ ...anteriores, captcha: '' }))
  }

  async function enviar(evento) {
    evento.preventDefault()
    setErrorLogin('')
    const nuevosErrores = validar(valores)
    if (!nuevosErrores.captcha && !captchaCoincide(valores.captcha, codigoCaptcha)) {
      nuevosErrores.captcha = 'El codigo no coincide con la imagen. Se genero otro.'
      refrescarCaptcha()
    }
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    setIngresando(true)
    try {
      await iniciarSesion({ email: valores.email, password: valores.password })
      navigate('/', { replace: true })
    } catch (error) {
      // 401 credenciales incorrectas, 423 cuenta bloqueada.
      setErrorLogin(error.message)
      setValores((anteriores) => ({ ...anteriores, password: '' }))
      refrescarCaptcha() // cada intento usa un CAPTCHA nuevo
      setIngresando(false)
    }
  }

  return (
    <>
      <h1>Iniciar sesion</h1>

      {errorLogin && (
        <p className="aviso aviso-error" role="alert">
          {errorLogin}
        </p>
      )}

      <form onSubmit={enviar} noValidate>
        <Campo id="email" etiqueta="Email" error={errores.email}>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="username"
            value={valores.email}
            onChange={cambiar}
            aria-invalid={Boolean(errores.email)}
            aria-describedby={errores.email ? 'email-error' : undefined}
            autoFocus
          />
        </Campo>

        <Campo id="password" etiqueta="Contrasenia" error={errores.password}>
          <InputPassword
            id="password"
            name="password"
            autoComplete="current-password"
            value={valores.password}
            onChange={cambiar}
            aria-invalid={Boolean(errores.password)}
            aria-describedby={errores.password ? 'password-error' : undefined}
          />
        </Campo>

        <Campo id="captcha" etiqueta="Codigo de verificacion" error={errores.captcha}>
          <Captcha codigo={codigoCaptcha} onRefrescar={refrescarCaptcha} />
          <input
            id="captcha"
            name="captcha"
            type="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={5}
            placeholder="Escriba las 5 letras de la imagen"
            value={valores.captcha}
            onChange={cambiar}
            aria-invalid={Boolean(errores.captcha)}
            aria-describedby={errores.captcha ? 'captcha-error' : undefined}
          />
        </Campo>

        <button type="submit" className="boton boton-primario" disabled={ingresando}>
          {ingresando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="auth-enlaces">
        <Link to="/recuperar-password">¿Olvidaste tu contrasenia?</Link>
      </p>

      {/* TODO(auth): quitar este recuadro cuando el login use el backend. */}
      <div className="auth-demo">
        <p>
          <strong>Modo demostracion</strong> (sin backend). Cuentas de prueba:
        </p>
        <ul>
          {CREDENCIALES_DEMO.map((cuenta) => (
            <li key={cuenta.email}>
              {ETIQUETAS_ROL[cuenta.rol]}: <code>{cuenta.email}</code> /{' '}
              <code>{cuenta.password}</code>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
