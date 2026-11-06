// =====================================================================
// TODO(auth): AUTENTICACION SIMULADA para la revision del frontend.
// Todo este archivo se reemplaza por llamadas al backend (Fase 2):
//   POST /auth/login, POST /auth/recuperar, POST /auth/restablecer.
// Ahi el backend valida con bcrypt, bloquea en la tabla usuarios
// (intentos_fallidos, bloqueado_hasta) y registra en log_accesos.
// =====================================================================
import { ApiError } from './api.js'
import { evaluarPassword } from './password.js'
import { guardarSesion, ROLES } from './sesion.js'

const USUARIOS_DEMO = [
  {
    nombre: 'Administrador Demo',
    email: 'admin@restaurante.com',
    password: 'Admin123!',
    rol: ROLES.ADMINISTRADOR,
  },
  {
    nombre: 'Recepcionista Demo',
    email: 'recepcion@restaurante.com',
    password: 'Recep123!',
    rol: ROLES.RECEPCIONISTA,
  },
]

// Se muestran en la pantalla de login solo en modo demostracion.
export const CREDENCIALES_DEMO = USUARIOS_DEMO.map(({ email, password, rol }) => ({
  email,
  password,
  rol,
}))

// Mismos valores que MAX_INTENTOS_LOGIN y MINUTOS_BLOQUEO del backend.
const MAX_INTENTOS = 3
const MINUTOS_BLOQUEO = 15

const CLAVE_INTENTOS = 'demo_intentos_login'
const CLAVE_RECUPERACION = 'demo_recuperacion'
const MINUTOS_CODIGO = 15

// Simula la demora de la red.
function esperar(ms = 500) {
  return new Promise((resolver) => setTimeout(resolver, ms))
}

function leer(clave, almacen = localStorage) {
  try {
    return JSON.parse(almacen.getItem(clave)) ?? {}
  } catch {
    return {}
  }
}

function buscarUsuario(email) {
  const clave = email.trim().toLowerCase()
  return USUARIOS_DEMO.find((usuario) => usuario.email === clave)
}

export async function iniciarSesion({ email, password }) {
  await esperar()
  const clave = email.trim().toLowerCase()
  const usuario = buscarUsuario(clave)
  const registros = leer(CLAVE_INTENTOS)
  const registro = registros[clave] ?? { intentos: 0, bloqueadoHasta: null }

  // Cuenta bloqueada y el tiempo aun no paso.
  if (registro.bloqueadoHasta && registro.bloqueadoHasta > Date.now()) {
    const minutos = Math.ceil((registro.bloqueadoHasta - Date.now()) / 60000)
    throw new ApiError(423, [
      `Cuenta bloqueada por intentos fallidos. Intente nuevamente en ${minutos} minuto(s).`,
    ])
  }

  if (!usuario || usuario.password !== password) {
    // Solo se cuentan intentos de cuentas que existen.
    if (usuario) {
      const intentos = (registro.bloqueadoHasta ? 0 : registro.intentos) + 1
      if (intentos >= MAX_INTENTOS) {
        registros[clave] = {
          intentos: 0,
          bloqueadoHasta: Date.now() + MINUTOS_BLOQUEO * 60000,
        }
        localStorage.setItem(CLAVE_INTENTOS, JSON.stringify(registros))
        throw new ApiError(423, [
          `Cuenta bloqueada por ${MAX_INTENTOS} intentos fallidos. Intente nuevamente en ${MINUTOS_BLOQUEO} minutos.`,
        ])
      }
      registros[clave] = { intentos, bloqueadoHasta: null }
      localStorage.setItem(CLAVE_INTENTOS, JSON.stringify(registros))
      const restantes = MAX_INTENTOS - intentos
      throw new ApiError(401, [
        `Email o contrasenia incorrectos. Le quedan ${restantes} intento(s).`,
      ])
    }
    throw new ApiError(401, ['Email o contrasenia incorrectos.'])
  }

  // Ingreso correcto: se reinician los intentos.
  delete registros[clave]
  localStorage.setItem(CLAVE_INTENTOS, JSON.stringify(registros))

  const sesion = { nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
  guardarSesion(sesion)
  return sesion
}

// Paso 1 de "olvide mi contrasenia". El mensaje es el mismo exista o no
// el email, para no revelar que cuentas existen. En la demo el codigo se
// devuelve para mostrarlo en pantalla (en vez de enviar un correo).
export async function solicitarRecuperacion(email) {
  await esperar()
  const usuario = buscarUsuario(email)
  let codigoDemo = null

  if (usuario) {
    const numeros = crypto.getRandomValues(new Uint32Array(1))[0]
    codigoDemo = String(numeros % 1000000).padStart(6, '0')
    sessionStorage.setItem(
      CLAVE_RECUPERACION,
      JSON.stringify({
        email: usuario.email,
        codigo: codigoDemo,
        expira: Date.now() + MINUTOS_CODIGO * 60000,
      }),
    )
  }

  return {
    mensaje: `Si el email esta registrado, se envio un codigo valido por ${MINUTOS_CODIGO} minutos.`,
    codigoDemo,
  }
}

// Paso 2: codigo de un solo uso + nueva contrasenia.
export async function restablecerPassword({ codigo, password }) {
  await esperar()
  const datos = leer(CLAVE_RECUPERACION, sessionStorage)

  if (!datos.codigo || datos.codigo !== codigo.trim() || datos.expira < Date.now()) {
    throw new ApiError(400, ['El codigo no es valido o ya expiro'])
  }
  if (evaluarPassword(password).nivel === 'debil') {
    throw new ApiError(400, ['La contrasenia es debil'])
  }

  sessionStorage.removeItem(CLAVE_RECUPERACION) // un solo uso
  return { mensaje: 'Contrasenia actualizada. Ya puede iniciar sesion.' }
}
