import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { cerrarSesion, ETIQUETAS_ROL, obtenerUsuario } from '../services/sesion.js'
import { NOMBRE_RESTAURANTE } from './marca.js'
import { opcionesParaRol } from './menu.js'
import './MainLayout.css'

// Marco comun de las pantallas: menu lateral + cabecera + contenido.
// En celular (<= 768px) el menu se oculta y se abre con el boton ☰.
export default function MainLayout() {
  const navigate = useNavigate()
  // RutaPrivada garantiza que aqui siempre hay sesion.
  const usuario = obtenerUsuario()
  const opciones = opcionesParaRol(usuario.rol)
  const [menuAbierto, setMenuAbierto] = useState(false)

  const cerrarMenu = () => setMenuAbierto(false)

  function salir() {
    cerrarSesion()
    navigate('/login', { replace: true })
  }

  // Escape cierra el menu en celular.
  useEffect(() => {
    if (!menuAbierto) return
    function alPresionarTecla(evento) {
      if (evento.key === 'Escape') setMenuAbierto(false)
    }
    document.addEventListener('keydown', alPresionarTecla)
    return () => document.removeEventListener('keydown', alPresionarTecla)
  }, [menuAbierto])

  const etiquetaUsuario = (
    <>
      {usuario.nombre} <small>({ETIQUETAS_ROL[usuario.rol]})</small>
    </>
  )

  return (
    <div className="layout">
      <aside
        id="menu-lateral"
        className={menuAbierto ? 'layout-menu abierto' : 'layout-menu'}
      >
        <div className="layout-marca">{NOMBRE_RESTAURANTE}</div>
        {/* En celular el usuario se muestra aqui (la cabecera es angosta). */}
        <div className="menu-usuario">{etiquetaUsuario}</div>
        <nav>
          {opciones.map((opcion) => (
            <NavLink
              key={opcion.ruta}
              to={opcion.ruta}
              end={opcion.ruta === '/'}
              className="menu-enlace"
              onClick={cerrarMenu}
            >
              {opcion.texto}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Fondo oscuro detras del menu abierto; al tocarlo se cierra. */}
      {menuAbierto && <div className="menu-fondo" onClick={cerrarMenu} />}

      <div className="layout-principal">
        <header className="layout-cabecera">
          <button
            type="button"
            className="boton-menu"
            aria-label={menuAbierto ? 'Cerrar menu' : 'Abrir menu'}
            aria-expanded={menuAbierto}
            aria-controls="menu-lateral"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            ☰
          </button>
          <span className="cabecera-marca">{NOMBRE_RESTAURANTE}</span>
          <span className="cabecera-usuario">{etiquetaUsuario}</span>
          <button type="button" className="boton-salir" onClick={salir}>
            Salir
          </button>
        </header>

        <main className="layout-contenido">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
