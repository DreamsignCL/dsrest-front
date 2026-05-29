<template>
    <form @submit.prevent="$emit('submit')">

        <BaseInput
            id="password"
            label="Nueva contraseña"
            type="password"
            :model-value="form.password"
            :error="errors.password"
            @update:model-value="updateField('password', $event)"
        />

        <BaseInput
            id="confirmPassword"
            label="Confirmar contraseña"
            type="password"
            :model-value="form.confirmPassword"
            :error="errors.confirmPassword"
            @update:model-value="updateField('confirmPassword', $event)"
        />

        <BaseButton
            type="submit"
            variant="secondary"
            block
        >
            Actualizar contraseña
        </BaseButton>

    </form>
</template>

<script setup>
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
    form: Object,
    errors: Object,
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