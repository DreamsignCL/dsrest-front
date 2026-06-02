<template>
  <form id="login-form" @submit.prevent="$emit('login')">
    <fieldset>
      <BaseInput
        id="user"
        label="Usuario:"
        type="text"
        placeholder="Ingresa tu usuario"
        :model-value="form.email"
        :error="loginErrors.email"
        @update:model-value="$emit('update:form',{...form, email: $event,})"
      />
  
      <BaseInput
        id="password"
        label="Contraseña:"
        type="password"
        placeholder="Ingresa tu contraseña"
        :model-value="form.password"
        :error="loginErrors.password"
        @update:model-value=" $emit('update:form',{...form, password: $event,})"
      />
  
      <BaseButton
        type="submit"
        variant="secondary"
        block>
        Iniciar sesión
      </BaseButton>
    </fieldset>
  </form>
</template>

<script setup>

import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

defineProps({
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
})

defineEmits([
  'login',
  'update:form',
])

</script>