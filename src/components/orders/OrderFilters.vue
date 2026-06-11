<template>
    <div class="items-content__filters">

        <BaseButton
            type="button"
            class="btn--filter"
            variant="outline-primary"
            aria-label="Abrir filtros"
            aria-controls="filters-panel"
            @click="$emit('openFilters')">

            <SlidersHorizontal :size="18" aria-hidden="true" />

        </BaseButton>

        <BaseInput
            id="order-search"
            type="search"
            placeholder="Buscar pedidos..."
            :model-value="search"
            ariaLabel="Buscar pedidos"
            @update:model-value="
                $emit(
                    'update:search',
                    $event
                )
            "
        />

        <RouterLink
            class="btn btn--primary"
            to="/app/orders/new">
            Nuevo pedido
        </RouterLink>

    </div>
</template>

<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

import { SlidersHorizontal,} from 'lucide-vue-next'

defineProps({
    search: {
        type: String,
        default: '',
    },
})

defineEmits([
    'update:search',
    'openFilters',
])
</script>