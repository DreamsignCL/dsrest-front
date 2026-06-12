<template>
    <BaseModal
        :model-value="modelValue"
        title="Agregar platos"
        size="lg"
        @update:model-value="emit('update:modelValue', $event)">

        <div class="dish-selector">
            <div class="dish-selector__filters">
                <BaseInput v-model="search" placeholder="Buscar plato..." />
                <BaseSelect v-model="selectedCategory" label="Categoría" :options="categoryOptions" />
            </div>

            <div v-if="filteredDishes.length" class="dish-selector__list">

                <button
                    v-for="dish in filteredDishes"
                    :key="dish.id"
                    type="button"
                    class="dish-selector__item"
                    :class="{
                        'dish-selector__item--selected':
                            isSelected(dish.id)
                    }"
                    @click="toggleDish(dish)">
                    <div class="dish-selector__info">
                        <strong> {{ dish.nombre }} </strong>
                        <span> {{ formatCurrency(dish.precio) }} </span>
                    </div>

                    <Check  v-if="isSelected(dish.id)" :size="18" aria-hidden="true" />
                </button>
            </div>

            <div v-else class="dish-selector__empty">
                No se encontraron platos
            </div>
        </div>

        <template #footer>
            <BaseButton
                type="button"
                variant="outline-primary"
                @click="closeModal">
                Cancelar
            </BaseButton>

            <BaseButton
                type="button"
                variant="primary"
                :disabled="selectedCount === 0"
                @click="confirmSelection">
                Agregar {{ selectedCount }} plato<span v-if="selectedCount !== 1">s</span>
            </BaseButton>
        </template>
    </BaseModal>
</template>

<script setup>
import {
    ref,
    computed,
} from 'vue'

import { Check, } from 'lucide-vue-next'

import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },

    dishes: {
        type: Array,
        default: () => [],
    },

    categories: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits([
    'update:modelValue',
    'confirm',
])

const search = ref('')
const selectedCategory = ref('')
const selectedDishIds = ref([])
const categoryOptions = computed(() => {

    return [
        {
            value: '',
            label: 'Todas las categorías',
        },

        ...props.categories.map(
            category => ({
                value: category.id,
                label: category.nombre,
            })
        ),
    ]
})

const filteredDishes = computed(() => {

    let result = [...props.dishes]

    if (search.value.trim()) {
        const query =
            search.value.toLowerCase()

        result = result.filter(
            dish =>
                dish.nombre
                    ?.toLowerCase()
                    .includes(query)
        )
    }

    if (selectedCategory.value) {
        result = result.filter(
            dish =>
                dish.categoriaId ===
                selectedCategory.value
        )
    }

    return result
})

const isSelected = dishId => {
    return selectedDishIds.value.includes(
        dishId
    )
}

const toggleDish = dish => {
    const exists =
        selectedDishIds.value.includes(
            dish.id
        )

    if (exists) {

        selectedDishIds.value =
            selectedDishIds.value.filter(
                id => id !== dish.id
            )

        return
    }

    selectedDishIds.value.push(
        dish.id
    )
}

const selectedCount = computed(() => {
    return selectedDishIds.value.length
})

const confirmSelection = () => {
    const selectedDishes =
        props.dishes
            .filter(
                dish =>
                    selectedDishIds.value.includes(
                        dish.id
                    )
            )
            .map(
                dish => ({
                    id: dish.id,
                    name: dish.nombre,
                    price: Number(
                        dish.precio || 0
                    ),
                    quantity: 1,
                })
            )

    emit(
        'confirm',
        selectedDishes
    )

    closeModal()
}

const closeModal = () => {
    emit(
        'update:modelValue',
        false
    )

    search.value = ''

    selectedCategory.value = ''

    selectedDishIds.value = []
}

const formatCurrency = value => {

    return Number(
        value || 0
    ).toLocaleString(
        'es-CL',
        {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0,
        }
    )
}
</script>