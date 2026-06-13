<template>
    <BaseModal
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)">

        <div class="list-modal">
            <div class="list-modal__header">
                <BaseInput 
                    v-model="search" 
                    type="search" 
                    aria-label="Filtra de acuerdo al nombre del plato"
                    placeholder="Nombre del plato..." />
                <BaseSelect 
                    v-model="selectedCategory" 
                    placeholder="Categoría" 
                    aria-label="Seleccioma la categoría del plato"
                    :options="categoryOptions" />
            </div>

            <div v-if="filteredDishes.length" class="list-modal__body">
                <button
                    v-for="dish in filteredDishes"
                    :key="dish.id"
                    type="button"
                    class="list-modal-item"
                    :class="{
                        'list-modal__item--selected': isSelected(dish.id)
                    }"
                    @click="toggleDish(dish)">
                    <div class="list-modal-item__content">
                        <div class="image">
                            <img v-if="dish.foto" :src="dish.foto" :alt="dish.nombre">
                            <img v-else :src="NoImage" alt="Sin logotipo">
                        </div>
                        <div class="info">
                            <span class="info__title">{{ dish.nombre }}</span>
                        </div>
                    </div>
                    <div class="list-modal-item__price">
                        <span class="current-price">
                            ${{ formatPrice(dish.precio) }}
                        </span>

                        <span v-if="dish.precio_comparacion" class="old-price">
                            ${{ formatPrice(dish.precio_comparacion) }}
                        </span>
                    </div>
                    <div class="list-modal-item__check">
                        <div
                            class="selector-badge"
                            :class="{ 'selector-badge--selected': isSelected(dish.id) }">
                            <span class="selector-badge__face selector-badge__face--front">
                                <Plus :size="14" />
                            </span>

                            <span class="selector-badge__face selector-badge__face--back">
                                <Check :size="14" />
                            </span>
                        </div>
                    </div>
                </button>
            </div>

            <div v-else class="dish-selector__empty">
                No se encontraron platos
            </div>
        </div>

        <div class="list-count">Se han seleccionado {{ selectedCount }} plato<span v-if="selectedCount !== 1">s</span></div>

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
                Agregar
            </BaseButton>
        </template>
    </BaseModal>
</template>

<script setup>
import {ref, computed,} from 'vue'
import { Check, Plus } from 'lucide-vue-next'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import NoImage from '@/assets/img/no-image.jpg'

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
                Number(dish.categoriaPlatoId) ===
                Number(selectedCategory.value)
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

const formatPrice = (value) => {

    if (!value) return '0'

    return new Intl.NumberFormat(
        'es-CL'
    ).format(value)
}
</script>