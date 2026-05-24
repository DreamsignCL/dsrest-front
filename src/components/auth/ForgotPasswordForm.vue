<template>
    <div class="forgot-content animate__animated animate__fadeInUp">
      <h2 class="text-light mb-4">Recuperar contraseña</h2>
  
      <div class="mb-3">
        <label class="form-label text-light" for="forgot-email">Correo electrónico</label>
        <input id="forgot-email" class="form-control" type="email" 
          :value="email"
          @input="$emit('update:email', $event.target.value)"
          placeholder="Ingrese su correo electrónico" />
      </div>
  
      <div class="d-grid gap-2">
        <button class="btn btn-warning rounded-pill" @click="$emit('recover-password')">Enviar instrucciones</button>
        <button class="btn btn-outline-light rounded-pill" @click="$emit('switch-view', 'login')">Volver al inicio de
          sesión</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ForgotPasswordForm",
    props: {
      email: {
        type: String,
        required: true
      }
    },
    emits: ["switch-view", "update:email", "recover-password"]
  }
  </script>
  
  <style scoped>
  /* Los estilos específicos del formulario de recuperación de contraseña se heredan del componente padre */
  </style>