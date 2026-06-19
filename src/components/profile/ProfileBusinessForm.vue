<template>
    <div class="profile-form">

        <BaseImageUploader
            id="business-logo"
            label="Logotipo"
            v-model="form.logo" />

        <BaseInput
            id="business-name"
            label="Nombre de fantasía"
            required =true
            v-model="form.nombreFantasia" />

        <BaseInput
            id="business-address"
            label="Dirección"
            v-model="form.direccion" />

        <BaseSelect
            id="business-type"
            label="Tipo de negocio"
            v-model="form.tipoNegocio"
            :options="businessTypeOptions" />

        <BaseSelect
            id="tables-mode"
            label="¿Usa mesas?"
            required =true
            v-model="form.usaMesas"
            :options="tablesModeOptions" />

        <BaseSelect
            id="customer-name-mode"
            label="¿Usa nombre de cliente?"
            required =true
            v-model="form.usaNombreCliente"
            :options="customerNameOptions" />

    </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseImageUploader from '@/components/ui/BaseImageUploader.vue'

defineProps({
    form: {
        type: Object,
        required: true,
    },
})

const businessTypeOptions = computed(() => [
    {
        value: '',
        label: 'Sin especificar',
    },
    {
        value: 'Bar',
        label: 'Bar',
    },
    {
        value: 'Cafetería rápida',
        label: 'Cafetería rápida',
    },
    {
        value: 'Foodtruck',
        label: 'Foodtruck',
    },
    {
        value: 'Restaurante',
        label: 'Restaurante',
    },
])

const tablesModeOptions = computed(() => [
    {
        value: 'si',
        label: 'Sí',
    },
    {
        value: 'no',
        label: 'No',
    },
    {
        value: 'opcional',
        label: 'Opcional',
    },
])

const customerNameOptions = computed(() => [
    {
        value: 'si',
        label: 'Sí',
    },
    {
        value: 'no',
        label: 'No',
    },
    {
        value: 'opcional',
        label: 'Opcional',
    },
])
</script>