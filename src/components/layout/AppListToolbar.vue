<template>
    <div class="list-toolbar">
        <div class="list-toolbar__top">
            <div class="list-toolbar__controls">
                <BaseButton
                    type="button"
                    class="btn--filter"
                    variant="outline-primary"
                    aria-label="Abrir filtros"
                    aria-controls="filters-panel" 
                    @click="$emit('open-filters')">
                    <SlidersHorizontal :size="18" aria-hidden="true" />
                </BaseButton>
    
                <BaseInput
                    :id="searchId"
                    label=""
                    type="search"
                    :placeholder="searchPlaceholder"
                    :model-value="search"
                    :ariaLabel="searchLabel"
                    @update:model-value=" $emit('update:search',$event)
                "/>
            </div>
    
            <div class="list-toolbar__meta">
                Total: <strong>{{ total }}</strong> {{ totalLabel }}
            </div>
    
            <div class="list-toolbar__actions">
                <RouterLink
                    v-if="actionLink"
                    class="btn btn--primary"
                    :to="actionLink">
                    {{ actionLabel }}
                </RouterLink>
            </div>
        </div>

        <div
            v-if="$slots['table-header']"
             class="list-toolbar__header">
            <slot name="table-header" />
        </div>
    </div>
</template>

<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { SlidersHorizontal, } from 'lucide-vue-next'

defineProps({
    search: {
        type: String,
        default: '',
    },

    searchId: {
        type: String,
        default: 'search',
    },

    searchPlaceholder: {
        type: String,
        default: 'Buscar...',
    },

    searchLabel: {
        type: String,
        default: 'Buscar',
    },

    actionLabel: {
        type: String,
        default: '',
    },

    actionLink: {
        type: String,
        default: '',
    },

    total: {
        type: Number,
        default: null,
    },

    totalLabel: {
        type: String,
        default: 'resultados',
    },
})

defineEmits([
    'update:search',
    'open-filters',
])
</script>