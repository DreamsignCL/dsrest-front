<template>
    <form
        id="table-form"
        class="table-form"
        @submit.prevent="$emit('submit')">

        <BaseInput
            id="table-number"
            label="Número de mesa:"
            type="number"
            placeholder="Ej: 10"
            :model-value="form.numero"
            :error="errors.numero"
            required
            @update:model-value="
                updateField(
                    'numero',
                    $event
                )
            "
        />

        <BaseInput
            id="table-name"
            label="Nombre de la mesa:"
            placeholder="Ej: VIP"
            helper="Opcional"
            :model-value="form.nombre"
            :error="errors.nombre"
            @update:model-value="
                updateField(
                    'nombre',
                    $event
                )
            "
        />

        <BaseInput
            id="table-capacity"
            label="Capacidad:"
            type="number"
            placeholder="Ej: 6"
            :model-value="form.capacidad"
            :error="errors.capacidad"
            required
            @update:model-value="
                updateField(
                    'capacidad',
                    $event
                )
            "
        />

        <BaseSelect
            id="table-zone"
            label="Zona:"
            placeholder="Seleccione una zona"
            :model-value="form.zona_id"
            :options="zoneOptions"
            :error="errors.zona_id"
            required
            @update:model-value="
                updateField(
                    'zona_id',
                    $event
                )
            "
        />

        <BaseSelect
            v-if="showStatus"
            id="table-status"
            label="Estado operativo:"
            :model-value="form.estado"
            :options="statusOptions"
            :error="errors.estado"
            required
            @update:model-value="
                updateField(
                    'estado',
                    $event
                )
            "
        />

    </form>
</template>

<script setup>
import { computed } from 'vue'

import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

const props = defineProps({

    form: {
        type: Object,
        required: true,
    },

    zones: {
        type: Array,
        default: () => [],
    },

    errors: {
        type: Object,
        default: () => ({}),
    },

    showStatus: {
        type: Boolean,
        default: false,
    },

})

const emit = defineEmits([
    'update:form',
    'submit',
])

const zoneOptions = computed(() => {

    return props.zones.map(
        zone => ({

            value: zone.id,

            label: zone.nombre,

        })
    )

})

const updateField = (
    field,
    value
) => {

    emit(
        'update:form',
        {

            ...props.form,

            [field]: value,

        }
    )

}

const statusOptions = [

    {
        value: 'disponible',
        label: 'Disponible',
    },

    {
        value: 'ocupada',
        label: 'Ocupada',
    },

    {
        value: 'reservada',
        label: 'Reservada',
    },

    {
        value: 'fuera_servicio',
        label: 'Fuera de servicio',
    },

]
</script>