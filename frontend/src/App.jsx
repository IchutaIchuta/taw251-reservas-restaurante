import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RutaPorRol from './components/RutaPorRol.jsx'
import RutaPrivada from './components/RutaPrivada.jsx'
import AuthLayout from './layouts/AuthLayout.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import ClientesPage from './pages/ClientesPage.jsx'
import EnConstruccionPage from './pages/EnConstruccionPage.jsx'
import InicioPage from './pages/InicioPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MesasPage from './pages/MesasPage.jsx'
import NoEncontradaPage from './pages/NoEncontradaPage.jsx'
import RecuperarPasswordPage from './pages/RecuperarPasswordPage.jsx'
import ReservasPage from './pages/ReservasPage.jsx'
import { ROLES } from './services/sesion.js'

// Login y recuperar contrasenia usan AuthLayout; el resto, con sesion,
// se muestra dentro de MainLayout (menu + cabecera).
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pantallas sin sesion */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="recuperar-password" element={<RecuperarPasswordPage />} />
        </Route>

        {/* Pantallas con sesion: sin login se redirige a /login */}
        <Route element={<RutaPrivada />}>
          <Route element={<MainLayout />}>
            <Route index element={<InicioPage />} />
            <Route path="reservas" element={<ReservasPage />} />
            <Route path="mesas" element={<MesasPage />} />
            <Route path="clientes" element={<ClientesPage />} />
            <Route path="reportes" element={<EnConstruccionPage titulo="Reportes" />} />

            {/* Solo Administrador */}
            <Route element={<RutaPorRol roles={[ROLES.ADMINISTRADOR]} />}>
              <Route path="usuarios" element={<EnConstruccionPage titulo="Usuarios" />} />
              <Route path="log-accesos" element={<EnConstruccionPage titulo="Log de accesos" />} />
            </Route>

            <Route path="*" element={<NoEncontradaPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
