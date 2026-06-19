
<template>
    <div class="profile-form">

        <BaseInput
            id="name"
            label="Nombre"
            v-model="form.nombre" />

        <BaseInput
            id="phone"
            label="Teléfono"
            v-model="form.telefono" />

        <BaseInput
            id="password"
            type="password"
            label="Contraseña"
            v-model="form.password" />

        <BaseInput
            id="password-confirmation"
            type="password"
            label="Repetir contraseña"
            v-model="form.passwordConfirmation" />

    </div>
</template>

<script setup>

import BaseInput from '@/components/ui/BaseInput.vue'

defineProps({
    form: {
        type: Object,
        required: true,
    },
})

</script>