// Fortaleza de la contrasenia: 'debil' | 'intermedio' | 'fuerte'
// (los mismos valores del ENUM usuarios.nivel_password).
// El backend debe calcularlo con estas mismas reglas al registrar.

export const ETIQUETAS_NIVEL = {
  debil: 'Debil',
  intermedio: 'Intermedio',
  fuerte: 'Fuerte',
}

export function evaluarPassword(password) {
  const criterios = [
    { clave: 'largo', texto: 'Al menos 8 caracteres', cumple: password.length >= 8 },
    { clave: 'minuscula', texto: 'Una letra minuscula', cumple: /[a-z]/.test(password) },
    { clave: 'mayuscula', texto: 'Una letra mayuscula', cumple: /[A-Z]/.test(password) },
    { clave: 'numero', texto: 'Un numero', cumple: /[0-9]/.test(password) },
    { clave: 'simbolo', texto: 'Un simbolo (ej. ! @ # $)', cumple: /[^A-Za-z0-9]/.test(password) },
  ]

  // Tipos de caracteres usados (minuscula, mayuscula, numero, simbolo).
  const tipos = criterios.filter((c) => c.clave !== 'largo' && c.cumple).length
  const largo = password.length

  let nivel = 'debil'
  if (largo >= 8 && (tipos === 4 || (largo >= 12 && tipos >= 3))) {
    nivel = 'fuerte'
  } else if (largo >= 8 && tipos >= 3) {
    nivel = 'intermedio'
  }

  return { nivel, criterios }
}
