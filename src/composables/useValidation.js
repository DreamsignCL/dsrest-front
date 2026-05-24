/**
 * Composable para validaciones comunes en formularios
 */
export function useValidation() {
  /**
   * Valida un correo electrónico
   * @param {string} email - Correo electrónico a validar
   * @returns {boolean} - True si es válido, false si no
   */
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  /**
   * Valida un RUT chileno
   * @param {string} rut - RUT a validar
   * @returns {boolean} - True si es válido, false si no
   */
  const isValidRut = (rut) => {
    if (!rut) return false

    // Validar formato con o sin guión
    if (!/^0*(\d{1,3}(\.?\d{3})*)-?([\dkK])$/.test(rut)) {
      return false
    }

    return true
  }

  /**
   * Valida un número de teléfono chileno
   * @param {string} phone - Teléfono a validar
   * @returns {boolean} - True si es válido, false si no
   */
  const isValidPhone = (phone) => {
    return /^\+?56[0-9]{9}$/.test(phone)
  }

  /**
   * Formatea un RUT agregando guión si no lo tiene
   * @param {string} rut - RUT a formatear
   * @returns {string} - RUT formateado
   */
  const formatRut = (rut) => {
    if (!rut) return ''

    // Si el RUT no tiene guión, agregarlo antes del dígito verificador
    if (!rut.includes('-')) {
      const rutLimpio = rut.replace(/[^0-9kK]/g, '')
      const cuerpo = rutLimpio.slice(0, -1)
      const dv = rutLimpio.slice(-1)
      return `${cuerpo}-${dv}`
    }

    return rut
  }

  return {
    isValidEmail,
    isValidRut,
    isValidPhone,
    formatRut,
  }
}
