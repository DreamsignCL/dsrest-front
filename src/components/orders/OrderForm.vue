<template>
    <div class="app-view__toolbar">
        <OrderCustomerCollapse
            v-if="props.showCustomer"
            :model-value="props.customerName"
            @update:model-value="
                emit(
                    'update:customerName',
                    $event
                )
            "
        />

        <button
            class="btn btn--add-items"
            type="button"
            aria-label="Agregar plato al pedido"
            aria-haspopup="dialog"
            @click="showDishModal = true">
            Agregar plato al pedido
            
            <span class="btn__icon" aria-hidden="true">
                <Plus :size="18" aria-hidden="true" />
            </span>
        </button>
    </div>
    
    <div class="app-view__content">
        <div class="app-view__list app-view__list--added-dishes" :class="!props.items.length ? 'app-view__list--added-dishes--empty' : ''">
            <div v-if="!props.items.length" class="app-view__empty">
                No hay platos agregados
            </div>
            
            <OrderItemCard
                v-for="item in props.items"
                :key="item.id"
                :item="item"
                @increase="increaseQuantity"
                @decrease="decreaseQuantity"
                @remove="removeItem"
            />
        </div>
    </div>
    
    <OrderDishSelectorModal
        title="Agregar platos"
        v-model="showDishModal"
        :added-dish-ids="props.items.map(item => item.id)"
        :dishes="dishes"
        :categories="categories"
        @confirm="handleAddItems"
    />
</template>

<script setup>
import {ref, inject,onMounted,} from 'vue'
import OrderCustomerCollapse from '@/components/orders/OrderCustomerCollapse.vue'
import OrderDishSelectorModal from '@/components/orders/OrderDishSelectorModal.vue'
import OrderItemCard from '@/components/orders/OrderItemCard.vue'
import { Plus } from 'lucide-vue-next'
import { apiService } from '@/services/api.service'

const props = defineProps({
    customerName: {
        type: String,
        default: '',
    },

    items: {
        type: Array,
        default: () => [],
    },

    showCustomer: {
        type: Boolean,
        default: true,
    },
})

const emit = defineEmits([
    'update:customerName',
    'update:items',
])

/*
|--------------------------------------------------------------------------
| Current Local
|--------------------------------------------------------------------------
*/

const local = inject('currentLocal')

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const showDishModal = ref(false)
const dishes = ref([])
const categories = ref([])


/*
|--------------------------------------------------------------------------
| Dishes
|--------------------------------------------------------------------------
*/

const loadDishes = async () => {

    if (!local?.value?.id) {
        return
    }

    try {
        const response =
            await apiService.get(
                `platos/porlocal/${local.value.id}`
            )

        dishes.value = response

    } catch (error) {

        console.error(
            'Error loading dishes:',
            error
        )
    }
}

/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
*/

const loadCategories = async () => {

    if (!local?.value?.id) return

    try {

        const response = await apiService.get(`categorias-plato?localId=${local.value.id}`)

        categories.value = response

    } catch (error) {
        console.error('Error loading categories:',error)
    }
}

/*
|--------------------------------------------------------------------------
| Order Items
|--------------------------------------------------------------------------
*/

const handleAddItems = items => {
    emit(
        'update:items',
        [
            ...props.items,
            ...items,
        ]
    )
}

const increaseQuantity = itemId => {
    const updatedItems =
        props.items.map(item => {

            if (item.id !== itemId) {
                return item
            }

            return {
                ...item,
                quantity: item.quantity + 1,
            }
        })

    emit(
        'update:items',
        updatedItems
    )
}

const decreaseQuantity = itemId => {
    const updatedItems =
        props.items
            .map(item => {
                if (item.id !== itemId) {
                    return item
                }

                return {
                    ...item,
                    quantity: item.quantity - 1,
                }
            })

            .filter(
                item => item.quantity > 0
            )

    emit(
        'update:items',
        updatedItems
    )
}

const removeItem = itemId => {
    const updatedItems =
        props.items.filter(
            item =>
                item.id !== itemId
        )

    emit(
        'update:items',
        updatedItems
    )
}

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(() => {
    loadDishes()
    loadCategories()
})
</script>