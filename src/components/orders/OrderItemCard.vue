<template>
    <div class="card card--order-dish">
        <div class="card__content">
            <div class="card__quantity">
                x{{ props.item.quantity }}
            </div>

            <div class="card__info">
                <div>{{ props.item.name }}</div>

                <div>
                    ${{ formatCurrency(props.item.price) }}
                    |
                    <strong>
                        ${{ formatCurrency(props.item.price * props.item.quantity) }}
                    </strong>
                </div>

                <button
                    class="btn btn--delete"
                    @click="emit('remove', props.item.id)">
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
</template>

<script setup>
import { formatCurrency } from '@/helpers/formatters'
import { Plus, Minus} from 'lucide-vue-next'

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits([
    'increase',
    'decrease',
    'remove',
])
</script>