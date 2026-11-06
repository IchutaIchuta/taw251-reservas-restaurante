import { Link } from 'react-router-dom'

export default function NoEncontradaPage() {
  return (
    <section>
      <h1>Pagina no encontrada</h1>
      <Link to="/">Volver al inicio</Link>
    </section>
  )
}
