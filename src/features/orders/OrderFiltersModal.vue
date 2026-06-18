<template>
    <BaseModal
        :model-value="modelValue"
        title="Filtros"
        @update:modelValue="$emit('update:modelValue', $event)">

        <div class="filters-modal">
            <div class="filters-modal__group">
                <h5>Ordenar por:</h5>
                
                <BaseSelect
                    id="order-sort-by"
                    v-model="localFilters.sortBy"
                    :options="sortOptions"
                />

                <BaseRadio
                    name="sort-direction"
                    v-model="localFilters.sortDirection"
                    variant="horizontal"
                    :options="[
                        {
                            value: 'asc',
                            label: 'Ascendente',
                        },
                        {
                            value: 'desc',
                            label: 'Descendente',
                        },
                    ]"
                />
            </div>

            <div class="filters-modal__group">
                <h5>Estado del pedido</h5>

                <div
                    v-for="status in orderStatuses"
                    :key="status.value"
                    class="filters-modal__switch">

                    <BaseSwitch
                        :id="`status-${status.value}`"
                        :label="status.label"
                        :model-value="
                            localFilters.statuses.includes(
                                status.value
                            )
                        "
                        @update:modelValue="
                            toggleStatus(
                                status.value,
                                $event
                            )
                        "
                    />
                </div>
            </div>

            <div v-if="supportsZones" class="filters-modal__group">
                <BaseSelect
                    id="order-zone"
                    label="Zona"
                    v-model="localFilters.zoneId"
                    :options="zoneOptions"
                />
            </div>

            <div class="filters-modal__group filters-modal__group--dates">
                <BaseInput
                    id="date-from"
                    type="date"
                    label="Desde"
                    v-model="localFilters.dateFrom"
                />

                <BaseInput
                    id="date-to"
                    type="date"
                    label="Hasta"
                    v-model="localFilters.dateTo"
                />
            </div>
        </div>

        <template #footer>
            <BaseButton
                type="button"
                variant="outline-primary"
                size="sm"
                @click="resetFilters">
                Limpiar
            </BaseButton>

            <BaseButton
                type="button"
                variant="primary"
                size="sm"
                @click="applyFilters">
                Aplicar
            </BaseButton>
        </template>
    </BaseModal>
</template>

<script setup>
import {reactive, computed, watch,} from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseRadio from '@/components/ui/BaseRadio.vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },

    filters: {
        type: Object,
        required: true,
    },

    zones: {
        type: Array,
        default: () => [],
    },

    supportsZones: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits([
    'update:modelValue',
    'apply',
])

const localFilters = reactive({
    statuses: [],
    zoneId: '',
    sortBy: 'date',
    sortDirection: 'desc',
    dateFrom: '',
    dateTo: '',
})

const sortOptions = [
    {
        value: 'date',
        label: 'Fecha',
    },
    {
        value: 'total',
        label: 'Monto',
    },
]

const orderStatuses = [
    {
        value: 'pendiente',
        label: 'Pendiente',
    },
    {
        value: 'preparacion',
        label: 'En preparación',
    },
    {
        value: 'pagado',
        label: 'Pagado',
    },
    {
        value: 'listo',
        label: 'Listo',
    },
    {
        value: 'servido',
        label: 'Servido',
    },
    {
        value: 'cancelado',
        label: 'Cancelado',
    },
]

const zoneOptions = computed(() => {
    return [
        {
            value: '',
            label: 'Todas las zonas',
        },

        ...props.zones.map(
            zone => ({
                value: zone.id,
                label: zone.nombre,
            })
        ),
    ]
})

watch(
    () => props.modelValue,
    isOpen => {

        if (!isOpen) {
            return
        }

        Object.assign(
            localFilters,
            JSON.parse(
                JSON.stringify(
                    props.filters
                )
            )
        )
    }
)

const toggleStatus = (
    status,
    enabled
) => {

    if (enabled) {

        if (
            !localFilters.statuses.includes(
                status
            )
        ) {

            localFilters.statuses.push(
                status
            )
        }

        return
    }

    localFilters.statuses =
        localFilters.statuses.filter(
            item => item !== status
        )
}

const resetFilters = () => {

    localFilters.statuses = []

    localFilters.zoneId = ''

    localFilters.sortBy = 'date'

    localFilters.sortDirection = 'desc'

    localFilters.dateFrom = ''

    localFilters.dateTo = ''
}

const applyFilters = () => {

    emit(
        'apply',
        JSON.parse(
            JSON.stringify(
                localFilters
            )
        )
    )

    emit(
        'update:modelValue',
        false
    )
}
</script>