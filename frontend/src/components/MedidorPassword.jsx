import { ETIQUETAS_NIVEL, evaluarPassword } from '../services/password.js'
import './MedidorPassword.css'

// Barra de fortaleza (debil / intermedio / fuerte) y lista de criterios.
// Se usa al recuperar la contrasenia y (Fase 2) al registrar usuarios.
export default function MedidorPassword({ password }) {
  if (!password) return null
  const { nivel, criterios } = evaluarPassword(password)

  return (
    <div className="medidor">
      <div className={`medidor-barra medidor-${nivel}`} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="medidor-texto" aria-live="polite">
        Fortaleza: <strong>{ETIQUETAS_NIVEL[nivel]}</strong>
      </p>
      <ul className="medidor-criterios">
        {criterios.map((criterio) => (
          <li key={criterio.clave} className={criterio.cumple ? 'cumple' : undefined}>
            <span aria-hidden="true">{criterio.cumple ? '✓' : '✗'}</span>{' '}
            {criterio.texto}
            <span className="solo-lector">
              {criterio.cumple ? ' (cumple)' : ' (falta)'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
