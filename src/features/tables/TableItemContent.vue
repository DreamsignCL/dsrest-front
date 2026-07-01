<template>
    <div class="table-item">
        <div class="table-item__header">
            <h3 class="title">Mesa #{{ table.numero }}</h3>

            <span class="badge" :class="statusClass">
                {{ table.estado }}
            </span>
        </div>

        <div
            v-if="table.nombre"
            class="table-item__info">
            Nombre: {{ table.nombre }}
        </div>

        <div class="table-item__footer">
            <div class="table-item__info">
                <span>Ubicación:</span>
                <p>{{ table.zona?.nombre }}</p>
            </div>

            <div class="table-item__info">
                <span>Capacidad:</span>
                <p>{{ table.capacidad }} personas</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    table: {
        type: Object,
        required: true,
    },
})

const statusClass = computed(() => {

    const status =
        props.table.estado?.toLowerCase()

    switch (status) {

        case 'disponible':
            return 'badge--success'

        case 'ocupada':
            return 'badge--warning'

        case 'reservada':
            return 'badge--info'

        case 'fuera de servicio':
        case 'fuera_servicio':
            return 'badge--danger'

        default:
            return 'badge--neutral'
    }
})
</script>