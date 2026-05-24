<template>
  <form class="animate__animated animate__fadeInUp" @submit.prevent="$emit('login')">
    <div class="mb-3">
      <label class="form-label text-light" for="user">Usuario</label>
      <input
        id="user"
        class="form-control"
        type="email"
        :value="form.email"
        placeholder="Usuario"
        :class="{ 'input-error': loginErrors.email }"
        @input="$emit('update:form', { ...form, email: $event.target.value })"
      />
      <span
        v-if="loginErrors.email"
        class="message error-message animate__animated animate__fadeInUp"
      >{{ loginErrors.email }}</span
      >
    </div>

    <div class="mb-4">
      <label class="form-label text-light" for="password">Contraseña</label>
      <input
        id="password"
        class="form-control"
        type="password"
        :value="form.password"
        placeholder="Contraseña"
        :class="{ 'input-error': loginErrors.password }"
        @input="$emit('update:form', { ...form, password: $event.target.value })"
      />
      <span
        v-if="loginErrors.password"
        class="message error-message animate__animated animate__fadeInUp"
      >{{ loginErrors.password }}</span
      >
    </div>

    <div class="d-grid gap-2">
      <button type="submit" class="btn btn-warning rounded-pill" :disabled="isLoading">
        {{ isLoading ? 'Cargando...' : 'Iniciar sesión' }}
      </button>
    </div>

    <div
      v-if="loginMessage"
      class="message message-login"
      :class="{ 'message error-message animate__animated animate__fadeInUp': loginError }"
    >
      {{ loginMessage }}
    </div>

    <div class="form-options">
      <button class="btn btn-link text-light" @click="$emit('switch-view', 'register')">
        Crear cuenta
      </button>
      <button class="btn btn-link text-light" @click="$emit('switch-view', 'forgot')">
        ¿Olvidaste tu contraseña?
      </button>
    </div>
  </form>

  <div v-if="isLoading" class="modal animate__animated animate__fadeIn">
    <div class="loader"></div>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  props: {
    form: {
      type: Object,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    loginErrors: {
      type: Object,
      default: () => ({}),
    },
    loginMessage: {
      type: String,
      default: '',
    },
    loginError: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['switch-view', 'show-role-modal', 'update:form'],
}
</script>
