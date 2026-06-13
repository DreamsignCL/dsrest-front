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
                class="card card-item card-item--order-dish">

                <div class="card__content">
                    <div class="card__quantity">
                        x{{ item.quantity }}
                    </div>
    
                    <div class="card__info">
                        <div>{{ item.name }}</div>
                        <div>{{ formatCurrency(item.price) }} | <strong>{{formatCurrency(item.price * item.quantity)}}</strong></div>
                        <button 
                            class="btn btn--delete" 
                            @click="emit('remove', item.id)">
                            Quitar
                        </button>
                    </div>
                </div>

                <div class="card__actions">
                    <button
                        type="button"
                        class="quantity-btn"
                        @click="emit('decrease', item.id)">
                        <Minus aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        class="quantity-btn"
                        @click="emit('increase', item.id)">
                        <Plus aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Plus, Minus} from 'lucide-vue-next'

defineProps({
    items: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits([
    'add',
    'increase',
    'decrease',
    'remove',
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
</script>