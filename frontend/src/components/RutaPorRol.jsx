import { Outlet } from 'react-router-dom'
import { obtenerUsuario } from '../services/sesion.js'

// Protege rutas por rol: aunque se escriba la URL a mano (ej. /usuarios),
// un rol sin permiso ve "Acceso denegado". El backend tambien lo validara
// con guards (Fase 2); esto es solo la parte visual.
export default function RutaPorRol({ roles }) {
  const usuario = obtenerUsuario()

  if (!roles.includes(usuario.rol)) {
    return (
      <section>
        <h1>Acceso denegado</h1>
        <p>Tu rol no tiene permiso para ver esta pagina.</p>
      </section>
    )
  }

  return <Outlet />
}
