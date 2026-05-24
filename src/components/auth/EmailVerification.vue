<template>
  <div class="verification-content page-content animate__animated animate__fadeInUp">
    <div class="form">
      <div class="form-header">
        <h2 class="text-secondary">¡Confirma tu correo!</h2>
        <p>
          Hemos enviado un email a {{ email }}, ingresa el código de verificación en el siguiente
          campo.
        </p>
      </div>

      <div class="form-body">
        <div class="mb-3">
          <input
            id="verification-code"
            class="form-control"
            type="text"
            :value="code"
            maxlength="4"
            placeholder="Ingrese código de 4 dígitos"
            :class="{ 'input-error': verificationError }"
            @input="$emit('update:code', $event.target.value)"
          />
          <span v-if="verificationError" class="error-message animate__animated animate__fadeInUp">
            {{ verificationError }}
          </span>
        </div>

        <div class="button-group d-flex flex-column gap-2 mb-1">
          <button
            class="btn btn-primary rounded-pill w-100 py-2"
            :disabled="isLoading"
            @click="$emit('verify')"
          >
            {{ isLoading ? 'Verificando...' : 'Ingresar' }}
          </button>
          <button
            class="btn btn-outline-primary rounded-pill w-100 py-2"
            :disabled="isLoading || resendCooldown > 0"
            @click="$emit('resend')"
          >
            {{ resendCooldown > 0 ? `Reenviar (${resendCooldown}s)` : 'Reenviar código' }}
          </button>
        </div>

        <div
          v-if="verificationMessage"
          class="message mt-0"
          :class="{ 'error-message': verificationError }"
        >
          {{ verificationMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmailVerification',
  props: {
    email: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    verificationError: {
      type: String,
      default: '',
    },
    verificationMessage: {
      type: String,
      default: '',
    },
    resendCooldown: {
      type: Number,
      default: 0,
    },
  },
  emits: ['verify', 'resend', 'update:code'],
}
</script>

<style scoped>
/* Los estilos específicos de la verificación de email se heredan del componente padre */
</style>
