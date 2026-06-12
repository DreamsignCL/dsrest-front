<template>
    <div class="panel__content panel__content--new-order">
        <AppHeader
            title="Nuevo pedido"
            description="Completa la información para generar un nuevo pedido"
        />

        <div class="panel__body">
            <OrderCustomerCollapse v-model="customerName" />

            <hr aria-hidden="true">

            <OrderItemsSection :items="orderItems" @add="showDishModal = true" />

            <OrderDishSelectorModal
                v-model="showDishModal"
                :dishes="dishes"
                @confirm="handleAddItems"
            />
        </div>

        <footer class="panel__footer">
            <OrderTotals :subtotal="subtotal" :tip="tipAmount" />

            <div class="panel__actions">
                <RouterLink to="/app/orders" class="btn btn--outline-primary">Volver</RouterLink>

                <BaseButton
                    type="submit"
                    variant="primary"
                    :disabled="isLoading">
                    Guardar pedido
                </BaseButton>
            </div>
            
            <DsSignature />
        </footer>
    </div>
</template>

<script setup>
import {ref,computed,inject,onMounted,} from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import OrderCustomerCollapse from '@/components/orders/OrderCustomerCollapse.vue'
import OrderItemsSection from '@/components/orders/OrderItemsSection.vue'
import OrderTotals from '@/components/orders/OrderTotals.vue'
import OrderDishSelectorModal from '@/components/orders/OrderDishSelectorModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import DsSignature from '@/components/DsSignature.vue'
import { apiService } from '@/services/api.service'

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

const isLoading = ref(false)
const customerName = ref('')
const showDishModal = ref(false)
const dishes = ref([])
const orderItems = ref([])

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

const subtotal = computed(() => {
    return orderItems.value.reduce(
        (total, item) => {

            return (
                total +
                (
                    Number(item.price || 0) *
                    Number(item.quantity || 0)
                )
            )

        },
        0
    )
})

const tipAmount = computed(() => {
    return Math.round(
        subtotal.value * 0.1
    )
})

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
| Order Items
|--------------------------------------------------------------------------
*/

const handleAddItems = items => {
    orderItems.value = items
    console.log(
        'Items agregados:',
        orderItems.value
    )
}

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(() => {
    loadDishes()
})
</script>