<template>
    <div class="order-table-selector">

        <BaseSelect
            id="order-zone"
            label="Zona:"
            :options="zoneOptions"
            :model-value="selectedZone"
            :error="errorZone"
            required
            @update:model-value="
                emit(
                    'update:selectedZone',
                    $event
                )
            "
        />

        <BaseSelect
            id="order-table"
            label="Mesa:"
            :options="tableOptions"
            :model-value="selectedTable"
            :disabled="!selectedZone"
            :error="errorTable"
            required
            @update:model-value="
                emit(
                    'update:selectedTable',
                    $event
                )
            "
        />

        <BaseInput
            v-if="showCustomer"
            id="customer-name"
            label="Nombre del cliente:"
            :model-value="customerName"
            :error="errorCustomerName"
            required
            @update:model-value="
                emit(
                    'update:customerName',
                    $event
                )
            "
        />

    </div>
</template>

<script setup>
import {
    ref,
    inject,
    watch,
    computed,
    onMounted,
} from 'vue'

import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import { apiService } from '@/services/api.service'

const props = defineProps({

    selectedZone: {
        type: [
            Number,
            String,
            null,
        ],
        default: null,
    },

    selectedTable: {
        type: [
            Number,
            String,
            null,
        ],
        default: null,
    },

    customerName: {
        type: String,
        default: '',
    },

    showCustomer: {
        type: Boolean,
        default: true,
    },

    errorZone: {
        type: String,
        default: '',
    },

    errorTable: {
        type: String,
        default: '',
    },

    errorCustomerName: {
        type: String,
        default: '',
    },
})

const emit = defineEmits([
    'update:selectedZone',
    'update:selectedTable',
    'update:customerName',
])

const local = inject(
    'currentLocal'
)

const zones = ref([])

const tables = ref([])

/*
|--------------------------------------------------------------------------
| Zones
|--------------------------------------------------------------------------
*/

const loadZones = async () => {

    try {

        const response =
            await apiService.get(
                'zonas'
            )

        zones.value = response

    } catch (error) {

        console.error(
            'Error loading zones:',
            error
        )
    }
}

/*
|--------------------------------------------------------------------------
| Tables
|--------------------------------------------------------------------------
*/

const loadTables = async zoneId => {

    if (!zoneId) {

        tables.value = []

        return
    }

    try {

        const response =
            await apiService.get(
                `mesas/local/${local.value.id}/zona/${zoneId}`
            )

        tables.value = response

    } catch (error) {

        console.error(
            'Error loading tables:',
            error
        )
    }
}

/*
|--------------------------------------------------------------------------
| Options
|--------------------------------------------------------------------------
*/

const zoneOptions = computed(() =>
    zones.value.map(zone => ({
        value: zone.id,
        label: zone.nombre,
    }))
)

const tableOptions = computed(() =>
    tables.value.map(table => ({
        value: table.id,
        label:
            `Mesa ${table.numero} - ${table.nombre}`,
    }))
)

/*
|--------------------------------------------------------------------------
| Watchers
|--------------------------------------------------------------------------
*/

watch(
    () => props.selectedZone,
    zoneId => {

        emit(
            'update:selectedTable',
            null
        )

        loadTables(
            zoneId
        )
    }
)

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(() => {
    loadZones()
})
</script>