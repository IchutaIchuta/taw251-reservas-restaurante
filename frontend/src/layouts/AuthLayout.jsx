import { Outlet } from 'react-router-dom'
import { NOMBRE_RESTAURANTE } from './marca.js'
import './AuthLayout.css'

// Marco de las pantallas sin sesion (login, recuperar contrasenia):
// una tarjeta centrada, sin menu.
export default function AuthLayout() {
  return (
    <div className="auth">
      <main className="auth-tarjeta">
        <div className="auth-marca">{NOMBRE_RESTAURANTE}</div>
        <Outlet />
      </main>
    </div>
  )
}
