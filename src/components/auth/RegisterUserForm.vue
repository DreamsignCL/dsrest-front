<template>
  <div class="form-container">
    <div class="form-container__header">
      <h2 class="text-primary">¡Queremos conocerte!</h2>
      <p>A continuación ingresa tus datos personales para empezar a ocupar tu aplicación.</p>
    </div>

    <div class="form-container__body">
      <div class="mb-3">
        <label class="form-label" for="nombre">Nombre</label>
        <input
          id="nombre"
          class="form-control"
          type="text"
          :value="form.nombre"
          placeholder="Nombre completo"
          :class="{ 'is-invalid': registerErrors.nombre }"
          @input="$emit('update:form', { ...form, nombre: $event.target.value })"
        />
        <span
          v-if="registerErrors.nombre"
          class="message error-message animate__animated animate__fadeInUp"
          >{{ registerErrors.nombre }}</span
        >
      </div>

      <div class="mb-3">
        <label class="form-label" for="rut">Rut</label>
        <input
          id="rut"
          class="form-control"
          type="text"
          :value="form.rut"
          placeholder="12345678-9"
          :class="{ 'is-invalid': registerErrors.rut }"
          @input="onRutInput"
        />
        <span
          v-if="registerErrors.rut"
          class="message error-message animate__animated animate__fadeInUp"
          >{{ registerErrors.rut }}</span
        >
      </div>

      <div class="mb-3">
        <label class="form-label" for="register-email">Email</label>
        <input
          id="register-email"
          class="form-control"
          type="email"
          :value="form.correo"
          placeholder="correo@ejemplo.com"
          :class="{ 'is-invalid': registerErrors.correo }"
          @input="$emit('update:form', { ...form, correo: $event.target.value })"
        />
        <span
          v-if="registerErrors.correo"
          class="message error-message animate__animated animate__fadeInUp"
          >{{ registerErrors.correo }}</span
        >
      </div>

      <div class="mb-3">
        <label class="form-label" for="telefono">Teléfono</label>
        <input
          id="telefono"
          class="form-control"
          type="tel"
          :value="form.telefono"
          placeholder="+56912345678"
          :class="{ 'is-invalid': registerErrors.telefono }"
          @input="$emit('update:form', { ...form, telefono: $event.target.value })"
        />
        <span
          v-if="registerErrors.telefono"
          class="message error-message animate__animated animate__fadeInUp"
          >{{ registerErrors.telefono }}</span
        >
      </div>

      <div class="mb-3">
        <label class="form-label" for="register-password">Contraseña</label>
        <input
          id="register-password"
          class="form-control"
          type="password"
          :value="form.contrasena"
          placeholder="Contraseña"
          :class="{ 'is-invalid': registerErrors.contrasena }"
          @input="$emit('update:form', { ...form, contrasena: $event.target.value })"
        />
        <span
          v-if="registerErrors.contrasena"
          class="message error-message animate__animated animate__fadeInUp"
          >{{ registerErrors.contrasena }}</span
        >
      </div>

      <div class="mb-3">
        <label class="form-label" for="confirm-password">Repetir contraseña</label>
        <input
          id="confirm-password"
          class="form-control"
          type="password"
          :value="confirmPassword"
          placeholder="Repetir contraseña"
          :class="{ 'is-invalid': registerErrors.confirmPassword }"
          @input="$emit('update:confirm-password', $event.target.value)"
        />
        <span
          v-if="registerErrors.confirmPassword"
          class="message error-message animate__animated animate__fadeInUp"
          >{{ registerErrors.confirmPassword }}</span
        >
      </div>
    </div>
    <div class="form-container__footer">
      <button class="btn btn-outline-primary rounded-pill" @click="$emit('switch-view', 'login')">
        Cancelar
      </button>
      <button class="btn btn-primary rounded-pill" :disabled="isLoading" @click="$emit('register')">
        {{ isLoading ? 'Registrando...' : 'Registrar' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterUserForm',
  props: {
    form: {
      type: Object,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    registerErrors: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['switch-view', 'register', 'update:form', 'update:confirm-password'],
  methods: {
    formatRut(rut) {
      rut = rut.replace(/[^\dkK]/g, '').toUpperCase()
      rut = rut.slice(0, 9)
      if (rut.length < 2) return rut
      const cuerpo = rut.slice(0, -1)
      const dv = rut.slice(-1)

      return `${cuerpo}-${dv}`
    },
    onRutInput(event) {
      const rutFormateado = this.formatRut(event.target.value)
      this.$emit('update:form', { ...this.form, rut: rutFormateado })
    },
  },
}
</script>

<style scoped>
/* Los estilos específicos del formulario de registro se heredan del componente padre */
</style>
