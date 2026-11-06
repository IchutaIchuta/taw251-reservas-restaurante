// CAPTCHA de imagen dibujado en un <canvas>.
// TODO(auth): SIMULADO. Hoy el codigo se genera y compara en el
// navegador, asi que un bot podria leerlo. En la Fase 2 el backend genera
// el codigo (ej. con svg-captcha), lo guarda y lo valida en /auth/login.

// Sin caracteres que se confunden: 0/O, 1/I/L.
const CARACTERES = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const LARGO = 5

function aleatorio(min, max) {
  return Math.random() * (max - min) + min
}

export function generarCodigoCaptcha() {
  let codigo = ''
  for (let i = 0; i < LARGO; i++) {
    codigo += CARACTERES[Math.floor(Math.random() * CARACTERES.length)]
  }
  return codigo
}

// Sin distinguir mayusculas/minusculas ni espacios.
export function captchaCoincide(escrito, codigo) {
  return escrito.trim().toUpperCase() === codigo
}

export function dibujarCaptcha(lienzo, codigo) {
  const ctx = lienzo.getContext('2d')
  const { width: ancho, height: alto } = lienzo

  ctx.fillStyle = '#f3ede7'
  ctx.fillRect(0, 0, ancho, alto)

  // Lineas de ruido.
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = `hsl(${aleatorio(0, 360)}, 40%, 60%)`
    ctx.lineWidth = aleatorio(1, 2)
    ctx.beginPath()
    ctx.moveTo(aleatorio(0, ancho), aleatorio(0, alto))
    ctx.lineTo(aleatorio(0, ancho), aleatorio(0, alto))
    ctx.stroke()
  }

  // Letras con giro, tamano y color distintos.
  const paso = ancho / (codigo.length + 1)
  ctx.textBaseline = 'middle'
  for (let i = 0; i < codigo.length; i++) {
    ctx.save()
    ctx.translate(paso * (i + 1), alto / 2 + aleatorio(-5, 5))
    ctx.rotate(aleatorio(-0.45, 0.45))
    ctx.font = `bold ${Math.round(aleatorio(24, 30))}px Georgia, serif`
    ctx.fillStyle = `hsl(${aleatorio(0, 360)}, 60%, 30%)`
    ctx.textAlign = 'center'
    ctx.fillText(codigo[i], 0, 0)
    ctx.restore()
  }

  // Puntos de ruido.
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `hsla(${aleatorio(0, 360)}, 50%, 40%, 0.5)`
    ctx.fillRect(aleatorio(0, ancho), aleatorio(0, alto), 2, 2)
  }
}
