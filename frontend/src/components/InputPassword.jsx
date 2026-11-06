import { useState } from 'react'

// Campo de contrasenia con boton para mostrarla u ocultarla.
// Recibe las mismas props que un <input> (id, name, value, onChange...).
export default function InputPassword(props) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="input-password">
      <input {...props} type={visible ? 'text' : 'password'} />
      <button
        type="button"
        className="boton boton-secundario"
        onClick={() => setVisible((anterior) => !anterior)}
        aria-label={visible ? 'Ocultar contrasenia' : 'Mostrar contrasenia'}
        aria-pressed={visible}
      >
        {visible ? 'Ocultar' : 'Ver'}
      </button>
    </div>
  )
}
