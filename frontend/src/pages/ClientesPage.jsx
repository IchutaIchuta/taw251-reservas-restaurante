import { useCallback, useEffect, useRef, useState } from 'react'
import ClienteFormulario from '../components/ClienteFormulario.jsx'
import Modal from '../components/Modal.jsx'
import {
  actualizarCliente,
  crearCliente,
  darDeBajaCliente,
  listarClientes,
} from '../services/clientesService.js'

// Espera tras la ultima tecla antes de buscar, para no llamar al API
// en cada letra.
const ESPERA_BUSQUEDA_MS = 300

// CRUD de clientes (PANTALLAS.md, pantalla 6).
export default function ClientesPage() {
  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [aviso, setAviso] = useState('')

  // Dialogo abierto: null, { tipo: 'formulario', cliente } o { tipo: 'baja', cliente }.
  // En el formulario, cliente = null significa "nuevo cliente".
  const [dialogo, setDialogo] = useState(null)
  const [errorBaja, setErrorBaja] = useState('')
  const [dandoDeBaja, setDandoDeBaja] = useState(false)

  // Numera las consultas: si llegan desordenadas, solo vale la ultima.
  const ultimaConsulta = useRef(0)

  const cargarClientes = useCallback((texto) => {
    const consulta = ++ultimaConsulta.current
    return listarClientes(texto)
      .then((datos) => {
        if (consulta !== ultimaConsulta.current) return
        setClientes(datos)
        setErrorCarga('')
      })
      .catch((error) => {
        if (consulta === ultimaConsulta.current) setErrorCarga(error.message)
      })
      .finally(() => setCargando(false))
  }, [])

  // Carga inicial y cada vez que cambia el texto de busqueda.
  useEffect(() => {
    const temporizador = setTimeout(
      () => cargarClientes(busqueda),
      ESPERA_BUSQUEDA_MS,
    )
    return () => clearTimeout(temporizador)
  }, [busqueda, cargarClientes])

  function abrirDialogo(nuevoDialogo) {
    setAviso('')
    setErrorBaja('')
    setDialogo(nuevoDialogo)
  }

  const cerrarDialogo = useCallback(() => setDialogo(null), [])

  // Si el API responde error, la excepcion la captura ClienteFormulario.
  async function guardarCliente(datos) {
    const cliente = dialogo.cliente
    if (cliente) {
      await actualizarCliente(cliente.id, datos)
      setAviso(`Cliente ${datos.nombre} actualizado`)
    } else {
      await crearCliente(datos)
      setAviso(`Cliente ${datos.nombre} registrado`)
    }
    setDialogo(null)
    await cargarClientes(busqueda)
  }

  async function confirmarBaja() {
    setDandoDeBaja(true)
    setErrorBaja('')
    try {
      const respuesta = await darDeBajaCliente(dialogo.cliente.id)
      setAviso(respuesta.mensaje)
      setDialogo(null)
      await cargarClientes(busqueda)
    } catch (error) {
      setErrorBaja(error.message)
    } finally {
      setDandoDeBaja(false)
    }
  }

  return (
    <section>
      <div className="pagina-encabezado">
        <h1>Clientes</h1>
        <button
          type="button"
          className="boton boton-primario"
          onClick={() => abrirDialogo({ tipo: 'formulario', cliente: null })}
        >
          + Nuevo cliente
        </button>
      </div>

      <input
        type="search"
        className="buscador"
        placeholder="Buscar por nombre o telefono"
        aria-label="Buscar cliente por nombre o telefono"
        value={busqueda}
        onChange={(evento) => setBusqueda(evento.target.value)}
      />

      {aviso && (
        <p className="aviso aviso-exito" role="status">
          {aviso}
        </p>
      )}

      {errorCarga && (
        <div className="aviso aviso-error" role="alert">
          {errorCarga}{' '}
          <button
            type="button"
            className="boton boton-secundario"
            onClick={() => cargarClientes(busqueda)}
          >
            Reintentar
          </button>
        </div>
      )}

      {cargando ? (
        <p>Cargando clientes...</p>
      ) : (
        !errorCarga &&
        (clientes.length === 0 ? (
          <p>
            {busqueda.trim()
              ? 'Ningun cliente coincide con la busqueda.'
              : 'No hay clientes registrados.'}
          </p>
        ) : (
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Telefono</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td data-label="Nombre">{cliente.nombre}</td>
                  <td data-label="Telefono">{cliente.telefono}</td>
                  <td data-label="Email" className="celda-texto-largo">
                    {cliente.email ?? '-'}
                  </td>
                  <td className="celda-acciones">
                    <div className="tabla-acciones">
                      <button
                        type="button"
                        className="boton boton-secundario"
                        onClick={() => abrirDialogo({ tipo: 'formulario', cliente })}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="boton boton-peligro"
                        onClick={() => abrirDialogo({ tipo: 'baja', cliente })}
                      >
                        Dar de baja
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))
      )}

      {dialogo?.tipo === 'formulario' && (
        <Modal
          titulo={dialogo.cliente ? 'Editar cliente' : 'Nuevo cliente'}
          onCerrar={cerrarDialogo}
        >
          <ClienteFormulario
            cliente={dialogo.cliente}
            onGuardar={guardarCliente}
            onCancelar={cerrarDialogo}
          />
        </Modal>
      )}

      {dialogo?.tipo === 'baja' && (
        <Modal titulo="Dar de baja al cliente" onCerrar={cerrarDialogo}>
          <p>
            <strong>{dialogo.cliente.nombre}</strong> dejara de aparecer en la
            lista. No se elimina de la base de datos y sus reservas anteriores se
            conservan.
          </p>
          {errorBaja && (
            <p className="aviso aviso-error" role="alert">
              {errorBaja}
            </p>
          )}
          <div className="formulario-acciones">
            <button
              type="button"
              className="boton boton-secundario"
              onClick={cerrarDialogo}
              disabled={dandoDeBaja}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="boton boton-peligro"
              onClick={confirmarBaja}
              disabled={dandoDeBaja}
            >
              {dandoDeBaja ? 'Dando de baja...' : 'Dar de baja'}
            </button>
          </div>
        </Modal>
      )}
    </section>
  )
}
