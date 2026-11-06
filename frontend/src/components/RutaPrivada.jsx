import { Navigate, Outlet } from 'react-router-dom'
import { obtenerUsuario } from '../services/sesion.js'

// Sin sesion iniciada se redirige al login.
// TODO(auth): ademas revisar que el JWT no haya expirado.
export default function RutaPrivada() {
  if (!obtenerUsuario()) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
