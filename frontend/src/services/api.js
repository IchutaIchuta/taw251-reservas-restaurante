// Cliente HTTP central. Todas las llamadas al backend pasan por aqui.
// La URL sale de VITE_API_URL (.env); si no esta definida se usa la local.
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// Error con el codigo HTTP y la lista de mensajes que devuelve NestJS.
export class ApiError extends Error {
  constructor(status, mensajes) {
    super(mensajes.join('. '))
    this.status = status
    this.mensajes = mensajes
  }
}

export async function peticion(ruta, { metodo = 'GET', datos } = {}) {
  let respuesta
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers: datos ? { 'Content-Type': 'application/json' } : undefined,
      body: datos ? JSON.stringify(datos) : undefined,
    })
  } catch {
    throw new ApiError(0, ['No se pudo conectar con el servidor'])
  }

  const cuerpo = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    // NestJS responde { message: string | string[], statusCode }.
    const mensaje = cuerpo?.message ?? `Error ${respuesta.status}`
    throw new ApiError(
      respuesta.status,
      Array.isArray(mensaje) ? mensaje : [mensaje],
    )
  }

  return cuerpo
}
