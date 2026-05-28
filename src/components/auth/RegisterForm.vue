<template>
    <form class="register-form" @submit.prevent="$emit('submit')">
        <BaseInput
            id="name"
            label="Nombre:"
            type="text"
            :model-value="form.nombre"
            :error="errors.nombre"
            required
            @update:model-value="$emit('update:form', {...form, nombre: $event})"
        />

        <BaseInput
            id="rut"
            label="Rut:"
            type="text"
            helper="Sin puntos ni guión (12345678-9)"
            :model-value="form.rut"
            :error="errors.rut"
            required
            @update:model-value="handleRutInput"
        />

        <BaseInput
            id="email"
            label="Email:"
            type="email"
            helper="correo@empresa.cl"
            :model-value="form.correo"
            :error="errors.correo"
            @update:model-value="$emit('update:form', {...form, correo: $event})"
        />

        <BaseInput
            id="phone"
            label="Teléfono"
            type="tel"
            helper="+56 9 1234 5678"
            :model-value="form.telefono"
            :error="errors.telefono"
            @update:model-value="$emit('update:form', {...form, telefono: $event})"
        />

        <BaseInput
            id="password"
            label="Contraseña"
            type="password"
            helper="Máximo 8 caracteres"
            :model-value="form.password"
            :error="errors.password"
            @update:model-value="$emit('update:form', {...form, password: $event})"
        />

        <BaseInput
            id="confirmPassword"
            label="Confirmar contraseña"
            type="password"
            :model-value="form.confirmPassword"
            :error="errors.confirmPassword"
            @update:model-value="$emit('update:form', {...form, confirmPassword: $event})"
        />

        <BaseCheckbox 
            v-model="form.acceptTerms" 
            :error="errors.acceptTerms"
            @update:model-value="updateField('acceptTerms', $event)">
            Acepto los <button type="button" @click="$emit('open-terms')">términos y condiciones</button>
        </BaseCheckbox>

        <BaseButton
            type="submit"
            variant="secondary"
            block>
            Crear cuenta
        </BaseButton>

    </form>

</template>

<script setup>

import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'
import {cleanRut,formatRut} from '@/helpers/rut'

const props = defineProps({
    form: {
        type: Object,
        required: true,
    },

    errors: {
        type: Object,
        default: () => ({}),
    },

    isLoading: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits([
    'submit',
    'update:form',
    'open-terms',
])

const updateField = (field, value) => {
    emit('update:form', {
        ...props.form,
        [field]: value,
    })
}

const handleRutInput = (value) => {
    const cleaned = cleanRut(value)
    const formatted = formatRut(cleaned)
    updateField('rut', formatted)
}
</script>