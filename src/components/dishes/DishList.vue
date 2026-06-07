<template>
    <div class="items-content__list">

        <div
            v-if="loading"
            class="dish-list__loading"
        >
            Cargando platos...
        </div>

        <div
            v-else-if="!dishes.length"
            class="dish-list__empty"
        >
            No hay platos registrados.
        </div>

        <DishCard
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
import DishCard from '@/components/dishes/DishCard.vue'

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