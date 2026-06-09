<template>
    <BaseModal
        :model-value="modelValue"
        title="Filtros"
        size="md"
        @update:modelValue="$emit('update:modelValue', $event)">
        <div class="filters-modal">

            <BaseSelect
                id="sort-by"
                label="Ordenar por"
                v-model="localFilters.sortBy"
                :options="sortOptions"
            />

            <div class="filters-modal__section">
                <span class="filters-modal__label">
                    Dirección
                </span>

                <div class="filters-modal__radios">
                    <BaseRadio
                        id="sort-asc"
                        name="sort-direction"
                        label="Ascendente"
                        value="asc"
                        v-model="localFilters.sortDirection"
                    />

                    <BaseRadio
                        id="sort-desc"
                        name="sort-direction"
                        label="Descendente"
                        value="desc"
                        v-model="localFilters.sortDirection"
                    />
                </div>
            </div>

            <div
                v-if="categories.length"
                class="filters-modal__section">
                <span class="filters-modal__label">
                    Categorías
                </span>

                <div class="filters-modal__categories">
                    <BaseSwitch
                        v-for="category in categories"
                        :key="category.id"
                        :id="`category-${category.id}`"
                        :label="category.nombre"
                        :model-value="isCategorySelected(category.id)"
                        @update:modelValue="
                            toggleCategory(
                                category.id,
                                $event
                            )
                        "
                    />
                </div>
            </div>
        </div>

        <template #footer>

            <BaseButton
                variant="outline-primary"
                @click="resetFilters">
                Limpiar
            </BaseButton>

            <BaseButton
                variant="primary"
                @click="applyFilters">
                Aplicar filtros
            </BaseButton>
        </template>
    </BaseModal>
</template>

<script setup>
import { reactive, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'
import BaseRadio from '@/components/ui/BaseRadio.vue'

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

const localFilters = reactive({
    sortBy: '',
    sortDirection: 'asc',
    categories: [],
})

watch(
    () => props.modelValue,
    (isOpen) => {

        if (!isOpen) return

        Object.assign(
            localFilters,
            structuredClone(props.filters)
        )
    }
)

const isCategorySelected = categoryId => {

    return localFilters.categories.includes(
        categoryId
    )
}

const toggleCategory = (
    categoryId,
    checked
) => {

    if (checked) {

        localFilters.categories.push(
            categoryId
        )

        return
    }

    localFilters.categories =
        localFilters.categories.filter(
            id => id !== categoryId
        )
}

const resetFilters = () => {
    localFilters.sortBy = ''
    localFilters.sortDirection = 'asc'
    localFilters.categories = []
}

const applyFilters = () => {
    emit(
        'apply',
        structuredClone(localFilters)
    )

    emit(
        'update:modelValue',
        false
    )
}
</script>