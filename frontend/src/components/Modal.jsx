import { useEffect, useId } from 'react'
import './Modal.css'

// Ventana modal generica. Se cierra con Escape o con los botones del
// contenido (no al hacer clic afuera, para no perder lo escrito).
export default function Modal({ titulo, onCerrar, children }) {
  const idTitulo = useId()

  useEffect(() => {
    function alPresionarTecla(evento) {
      if (evento.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', alPresionarTecla)
    return () => document.removeEventListener('keydown', alPresionarTecla)
  }, [onCerrar])

  return (
    <div className="modal-fondo">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
      >
        <h2 id={idTitulo} className="modal-titulo">
          {titulo}
        </h2>
        {children}
      </div>
    </div>
  )
}
