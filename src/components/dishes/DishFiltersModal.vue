<template>
    <BaseModal
        :model-value="modelValue"
        title="Orden y Filtros"
        size="sm"
        @update:modelValue="$emit('update:modelValue', $event)">
        
        <div class="filters-modal">

            <div class="filters-modal__group">
                <h5>Ordenar por:</h5>
    
                <BaseSelect
                    id="sort-by"
                    v-model="localFilters.sortBy"
                    :options="sortOptions"
                />
                
                <BaseRadio
                    name="sort-direction"
                    v-model="localFilters.sortDirection"
                    :options="[
                        {
                            value: 'asc',
                            label: 'Ascendente',
                        },
                        {
                            value: 'desc',
                            label: 'Descendente',
                        }
                    ]"
                />
            </div>

            <div v-if="categories.length" class="filters-modal__group">
                <h5>Filtro de categorías:</h5>

                <div
                    v-for="category in categories"
                    :key="category.id"
                    class="filters-modal__switch">

                    <BaseSwitch
                        :id="`category-${category.id}`"
                        :label="category.nombre"
                        :model-value="localFilters.categories.includes(category.id)"
                        @update:modelValue="
                            toggleCategory(
                                category.id,
                                $event
                            )"
                    />
                </div>
            </div>
        </div>

        <template #footer>
            <BaseButton
                type="button"
                variant="outline-primary"
                size="sm"
                @click="resetFilters">
                Limpiar
            </BaseButton>

            <BaseButton
                type="button"
                variant="primary"
                size="sm"
                @click="applyFilters">
                Aplicar
            </BaseButton>
        </template>
    </BaseModal>
</template>

<script setup>
import { reactive, watch, } from 'vue'

import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseRadio from '@/components/ui/BaseRadio.vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },

    filters: {
        type: Object,
        required: true,
    },

    categories: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits([
    'update:modelValue',
    'apply',
])

const localFilters = reactive({
    search: '',
    categories: [],
    recommended: false,
    sortBy: '',
    sortDirection: 'asc',
})

const sortOptions = [
    {
        value: 'name',
        label: 'Nombre',
    },
    {
        value: 'price',
        label: 'Precio',
    },
    {
        value: 'date',
        label: 'Fecha',
    },
]

watch(
    () => props.modelValue,
    isOpen => {

        if (!isOpen) return

        Object.assign(
            localFilters,
            {
                search: props.filters.search,
                categories: [...props.filters.categories],
                recommended: props.filters.recommended,
                sortBy: props.filters.sortBy,
                sortDirection: props.filters.sortDirection,
            }
        )
    }
)

const toggleCategory = (
    categoryId,
    enabled
) => {

    if (enabled) {

        if (
            !localFilters.categories.includes(categoryId)
        ) {

            localFilters.categories.push(categoryId)
        }

        return
    }

    localFilters.categories =
        localFilters.categories.filter(
            id => id !== categoryId
        )
}

const resetFilters = () => {
    localFilters.search = ''
    localFilters.categories = []
    localFilters.recommended = false
    localFilters.sortBy = ''
    localFilters.sortDirection = 'asc'
}

const applyFilters = () => {
    emit(
        'apply',
        {
            search: localFilters.search,
            categories: [...localFilters.categories],
            recommended: localFilters.recommended,
            sortBy: localFilters.sortBy,
            sortDirection: localFilters.sortDirection,
        }
    )

    emit(
        'update:modelValue',
        false
    )
}
</script>
