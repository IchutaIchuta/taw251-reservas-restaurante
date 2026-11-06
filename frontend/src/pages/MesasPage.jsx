import { useCallback, useEffect, useState } from 'react'
import MesaFormulario from '../components/MesaFormulario.jsx'
import Modal from '../components/Modal.jsx'
import {
  actualizarMesa,
  crearMesa,
  darDeBajaMesa,
  etiquetaUbicacion,
  listarMesas,
} from '../services/mesasService.js'

// CRUD de mesas (PANTALLAS.md, pantalla 4).
export default function MesasPage() {
  const [mesas, setMesas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [aviso, setAviso] = useState('')

  // Dialogo abierto: null, { tipo: 'formulario', mesa } o { tipo: 'baja', mesa }.
  // En el formulario, mesa = null significa "nueva mesa".
  const [dialogo, setDialogo] = useState(null)
  const [errorBaja, setErrorBaja] = useState('')
  const [dandoDeBaja, setDandoDeBaja] = useState(false)

  // Pide la lista al API. Se usa al entrar, al guardar y en "Reintentar".
  const cargarMesas = useCallback(() => {
    return listarMesas()
      .then((datos) => {
        setMesas(datos)
        setErrorCarga('')
      })
      .catch((error) => setErrorCarga(error.message))
      .finally(() => setCargando(false))
  }, [])

  // Carga inicial al abrir la pantalla.
  useEffect(() => {
    cargarMesas()
  }, [cargarMesas])

  function abrirDialogo(nuevoDialogo) {
    setAviso('')
    setErrorBaja('')
    setDialogo(nuevoDialogo)
  }

  const cerrarDialogo = useCallback(() => setDialogo(null), [])

  // Si el API responde error, la excepcion la captura MesaFormulario.
  async function guardarMesa(datos) {
    const mesa = dialogo.mesa
    if (mesa) {
      await actualizarMesa(mesa.id, datos)
      setAviso(`Mesa ${datos.numero} actualizada`)
    } else {
      await crearMesa(datos)
      setAviso(`Mesa ${datos.numero} creada`)
    }
    setDialogo(null)
    await cargarMesas()
  }

  async function confirmarBaja() {
    setDandoDeBaja(true)
    setErrorBaja('')
    try {
      const respuesta = await darDeBajaMesa(dialogo.mesa.id)
      setAviso(respuesta.mensaje)
      setDialogo(null)
      await cargarMesas()
    } catch (error) {
      setErrorBaja(error.message)
    } finally {
      setDandoDeBaja(false)
    }
  }

  return (
    <section>
      <div className="pagina-encabezado">
        <h1>Mesas</h1>
        <button
          type="button"
          className="boton boton-primario"
          onClick={() => abrirDialogo({ tipo: 'formulario', mesa: null })}
        >
          + Nueva mesa
        </button>
      </div>

      {aviso && (
        <p className="aviso aviso-exito" role="status">
          {aviso}
        </p>
      )}

      {errorCarga && (
        <div className="aviso aviso-error" role="alert">
          {errorCarga}{' '}
          <button type="button" className="boton boton-secundario" onClick={cargarMesas}>
            Reintentar
          </button>
        </div>
      )}

      {cargando ? (
        <p>Cargando mesas...</p>
      ) : (
        !errorCarga &&
        (mesas.length === 0 ? (
          <p>No hay mesas registradas.</p>
        ) : (
          <table className="tabla">
            <thead>
              <tr>
                <th>Nro</th>
                <th>Capacidad</th>
                <th>Ubicacion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mesas.map((mesa) => (
                <tr key={mesa.id}>
                  <td data-label="Nro">{mesa.numero}</td>
                  <td data-label="Capacidad">{mesa.capacidad} personas</td>
                  <td data-label="Ubicacion">{etiquetaUbicacion(mesa.ubicacion)}</td>
                  <td className="celda-acciones">
                    <div className="tabla-acciones">
                      <button
                        type="button"
                        className="boton boton-secundario"
                        onClick={() => abrirDialogo({ tipo: 'formulario', mesa })}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="boton boton-peligro"
                        onClick={() => abrirDialogo({ tipo: 'baja', mesa })}
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
          titulo={dialogo.mesa ? `Editar mesa ${dialogo.mesa.numero}` : 'Nueva mesa'}
          onCerrar={cerrarDialogo}
        >
          <MesaFormulario
            mesa={dialogo.mesa}
            onGuardar={guardarMesa}
            onCancelar={cerrarDialogo}
          />
        </Modal>
      )}

      {dialogo?.tipo === 'baja' && (
        <Modal titulo={`Dar de baja la mesa ${dialogo.mesa.numero}`} onCerrar={cerrarDialogo}>
          <p>
            La mesa dejara de aparecer en la lista y no se podra reservar. No se
            elimina de la base de datos.
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
