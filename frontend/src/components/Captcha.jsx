import { useEffect, useRef } from 'react'
import { dibujarCaptcha } from '../services/captcha.js'
import './Captcha.css'

// Muestra la imagen del CAPTCHA y un boton para generar otro codigo.
// El codigo lo guarda el componente padre (LoginPage).
export default function Captcha({ codigo, onRefrescar }) {
  const lienzo = useRef(null)

  useEffect(() => {
    dibujarCaptcha(lienzo.current, codigo)
  }, [codigo])

  return (
    <div className="captcha">
      <canvas
        ref={lienzo}
        width={170}
        height={52}
        role="img"
        aria-label="Imagen con el codigo de verificacion"
      />
      <button
        type="button"
        className="boton boton-secundario captcha-refrescar"
        onClick={onRefrescar}
        aria-label="Generar otro codigo"
        title="Generar otro codigo"
      >
        ↻
      </button>
    </div>
  )
}
