<template>
  <form @submit.prevent="$emit('submit')">
    <BaseInput
      id="email"
      label="Correo electrónico:"
      type="email"
      helper="correo@empresa.cl"
      :model-value="form.email"
      :error="errors.email"
      required
      @update:model-value="updateField('email', $event)"
    />

    <BaseButton type="submit" variant="secondary" block>
      Recuperar contraseña
    </BaseButton>
  </form>
</template>

<script setup>
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },

  errors: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits([
  'submit',
  'update:form',
])

const updateField = (field, value) => {
  emit('update:form', {
    ...props.form,
    [field]: value,
  })
}
</script>