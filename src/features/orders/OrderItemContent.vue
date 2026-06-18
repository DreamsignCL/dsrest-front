<template>
    <div class="order-item">
        <div class="order-item__header">
            <h3 class="title">Pedido #{{ order.numeroPedido }}</h3>

            <span class="badge" :class="statusClass">
                {{ order.estado }}
            </span>
        </div>
        
        <div class="order-item__info">
            Garzón: {{ order.garzon }}
        </div>

        <div v-if="order.cliente" class="order-item__info">
            Cliente: {{ order.cliente }}
        </div>

        <div class="order-item__body">
            <div class="order-item__info">
                <span>Ubicación:</span>
                <p> {{ order.ubicacion }} </p>
            </div>

            <div v-if="config.tablesMode === 'si'" class="order-item__info">
                <span>Mesa:</span>
                <p> {{ order.mesa }}</p>
            </div>

            <div class="order-item__info">
                <span>Fecha:</span>
                <p> {{ order.fecha }}</p>
            </div>

            <div class="order-item__info order-item__info--price">
                <span>Total:</span>
                <strong> ${{ formatCurrency(order.total) }}</strong>
            </div>
        </div>

        <div class="order-item__footer">
            <div class="order-item__info order-item__info--hour">
                <Clock3 :size="18" aria-hidden="true" /> {{ order.hora }}
            </div>

            <div class="order-item__info order-item__info--indicator" aria-hidden="true">
                <span class="order-item__ellipsis"></span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Clock3 } from 'lucide-vue-next'
import { formatCurrency } from '@/helpers/formatters'
import { useBusinessConfig } from '@/composables/useBusinessConfig'

const props = defineProps({
    order: {
        type: Object,
        required: true,
    },
})

const { config } = useBusinessConfig()

const statusClass = computed(() => {

    const status = props.order.estado?.toLowerCase()

    switch (status) {

        case 'pendiente':
            return 'badge--warning'

        case 'en preparación':
        case 'preparacion':
            return 'badge--info'

        case 'listo':
            return 'badge--success'

        case 'servido':
            return 'badge--success'

        case 'pagado':
            return 'badge--success'

        case 'cancelado':
            return 'badge--danger'

        default:
            return 'badge--neutral'
    }
})
</script>