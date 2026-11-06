// Envoltorio de un campo de formulario: etiqueta + control + mensaje de error.
// El control (input/select) va como hijo y debe tener el mismo id.
export default function Campo({ id, etiqueta, error, children }) {
  return (
    <div className={error ? 'campo campo-con-error' : 'campo'}>
      <label htmlFor={id}>{etiqueta}</label>
      {children}
      {error && (
        <span id={`${id}-error`} className="campo-error">
          {error}
        </span>
      )}
    </div>
  )
}
