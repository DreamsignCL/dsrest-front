<template>
    <div class="items-content__list">
        <div v-if="loading">
            <SkeletonCardListItem2 v-for="index in 6" :key="index" />
        </div>

        <div v-else-if="!orders.length" class="dish-list__empty">
            No hay platos registrados.
        </div>

        <CardOrder
            v-for="order in orders"
            :key="order.id"
            :order="order"
            @edit="$emit('edit', order)"
            @delete="$emit('delete', order)"
            @toggle-status="$emit('toggle-status', order)"
        />
    </div>
</template>

<script setup>
import CardOrder from '@/components/orders/CardOrder.vue'
import SkeletonCardListItem2 from '@/components/skeletons/SkeletonCardListItem2.vue'

defineProps({
    orders: {
        type: Array,
        default: () => [],
    },

    loading: {
        type: Boolean,
        default: false,
    },
})

defineEmits([
    'edit',
    'delete',
    'toggle-status',
])
</script>