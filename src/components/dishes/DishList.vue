<template>
    <div class="items-content__list">
        <div v-if="loading">
            <SkeletonCardListItem v-for="index in 6" :key="index" />
        </div>

        <div v-else-if="!dishes.length" class="dish-list__empty">
            No hay platos registrados.
        </div>

        <CardDish
            v-for="dish in dishes"
            :key="dish.id"
            :dish="dish"
            @edit="$emit('edit', dish)"
            @delete="$emit('delete', dish)"
            @toggle-status="$emit('toggle-status', dish)"
        />
    </div>
</template>

<script setup>
import CardDish from '@/components/dishes/CardDish.vue'
import SkeletonCardListItem from '@/components/skeletons/SkeletonCardListItem.vue'

defineProps({
    dishes: {
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