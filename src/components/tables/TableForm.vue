<template>
    <form
        id="table-form"
        class="table-form"
        @submit.prevent="$emit('submit')">

        <BaseInput
            id="table-number"
            label="Número"
            type="number"
            placeholder="Ej: 12"
            :model-value="form.number"
            :error="errors.number"
            required
            @update:model-value="
                updateField(
                    'number',
                    $event
                )
            "
        />

        <BaseInput
            id="table-name"
            label="Nombre"
            placeholder="Ej: VIP"
            :model-value="form.name"
            :error="errors.name"
            helper="Opcional"
            @update:model-value="
                updateField(
                    'name',
                    $event
                )
            "
        />

        <BaseInput
            id="table-capacity"
            label="Capacidad"
            type="number"
            placeholder="Ej: 4"
            :model-value="form.capacity"
            :error="errors.capacity"
            required
            @update:model-value="
                updateField(
                    'capacity',
                    $event
                )
            "
        />

        <BaseSelect
            id="table-zone"
            label="Zona"
            placeholder="Selecciona una zona"
            :options="zoneOptions"
            :model-value="form.zoneId"
            :error="errors.zoneId"
            required
            @update:model-value="
                updateField(
                    'zoneId',
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

const updateField = (field, value) => {

    emit(
        'update:form',
        {
            ...props.form,
            [field]: value,
        }
    )

}
</script>