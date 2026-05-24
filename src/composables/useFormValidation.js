import { useValidation } from './useValidation';

/**
 * Composable para validación de formularios específicos
 */
export function useFormValidation() {
  const { isValidEmail, isValidRut, isValidPhone } = useValidation();

  /**
   * Valida el formulario de login
   * @param {Object} form - Formulario de login
   * @returns {Object} - Errores y validez del formulario
   */
  const validateLoginForm = (form) => {
    const errors = {};
    let isValid = true;

    if (!form.email) {
      errors.email = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!isValidEmail(form.email)) {
      errors.email = 'Ingrese un correo electrónico válido';
      isValid = false;
    }

    if (!form.password) {
      errors.password = 'La contraseña es requerida';
      isValid = false;
    }

    return { errors, isValid };
  };

  /**
   * Valida el formulario de registro de usuario
   * @param {Object} form - Formulario de registro
   * @param {string} confirmPassword - Confirmación de contraseña
   * @returns {Object} - Errores y validez del formulario
   */
  const validateRegisterForm = (form, confirmPassword) => {
    const errors = {};
    let isValid = true;

    if (!form.nombre) {
      errors.nombre = 'El nombre es requerido';
      isValid = false;
    }

    if (!form.rut) {
      errors.rut = 'El RUT es requerido';
      isValid = false;
    } else if (!isValidRut(form.rut)) {
      errors.rut = 'Ingrese un RUT válido';
      isValid = false;
    }

    if (!form.correo) {
      errors.correo = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!isValidEmail(form.correo)) {
      errors.correo = 'Ingrese un correo electrónico válido';
      isValid = false;
    }

    if (!form.telefono) {
      errors.telefono = 'El teléfono es requerido';
      isValid = false;
    } else if (!isValidPhone(form.telefono)) {
      errors.telefono = 'Ingrese un número de teléfono válido';
      isValid = false;
    }

    if (!form.contrasena) {
      errors.contrasena = 'La contraseña es requerida';
      isValid = false;
    } else if (form.contrasena.length < 6) {
      errors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Debe confirmar la contraseña';
      isValid = false;
    } else if (confirmPassword !== form.contrasena) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    return { errors, isValid };
  };

  /**
   * Valida el formulario de registro de local
   * @param {Object} form - Formulario de local
   * @param {string} nombreEmpresa - Nombre de la empresa
   * @returns {Object} - Errores y validez del formulario
   */
  const validateLocalForm = (form, nombreEmpresa) => {
    const errors = {};
    let isValid = true;

    if (!form.rut) {
      errors.rut = 'El RUT de la empresa es requerido';
      isValid = false;
    } else if (!isValidRut(form.rut)) {
      errors.rut = 'Ingrese un RUT válido';
      isValid = false;
    } else if (!nombreEmpresa) {
      errors.rut = 'No se encontró una empresa con este RUT';
      isValid = false;
    }

    if (!form.direccion) {
      errors.direccion = 'La dirección es requerida';
      isValid = false;
    }

    if (!form.tipo) {
      errors.tipo = 'El tipo de local es requerido';
      isValid = false;
    }

    return { errors, isValid };
  };

  return {
    validateLoginForm,
    validateRegisterForm,
    validateLocalForm
  };
}