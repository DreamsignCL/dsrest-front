<template>
    <section class="order-items">
        <div class="order-items__header">
            <button
                class="btn btn--add-items"
                type="button"
                aria-label="Agregar plato al pedido"
                aria-haspopup="dialog"
                @click="emit('add')">
                Agregar plato al pedido
                
                <span class="btn__icon" aria-hidden="true">
                    <Plus :size="18" aria-hidden="true" />
                </span>
            </button>
        </div>

        <div v-if="!items.length" class="order-items__empty">
            No hay platos agregados
        </div>

        <div v-else class="order-items__list">
            <div
                v-for="item in items"
                :key="item.id"
                class="order-items__card">

                <div class="order-items__info">
                    <strong>{{ item.name }}</strong>

                    <span>
                        Cantidad:
                        {{ item.quantity }}
                    </span>
                </div>

                <strong>{{ formatCurrency(item.total) }}</strong>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Plus,} from 'lucide-vue-next'

defineProps({
    items: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits([
    'add',
])

const formatCurrency = value => {

    return Number(value || 0)
        .toLocaleString(
            'es-CL',
            {
                style: 'currency',
                currency: 'CLP',
                maximumFractionDigits: 0,
            }
        )
}

const openDishModal = () => {
    console.log(
        'Abrir modal platos'
    )
}
</script>