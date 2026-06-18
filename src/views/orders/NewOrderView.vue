<template>
    <AppContentHeader
        title="Nuevo pedido"
            description="Completa la información para generar un nuevo pedido">

        <template v-if="config.tablesMode === 'si'" #summary>
            Componente de pasos
        </template>
    </AppContentHeader>

    <div class="app-content__body" aria-label="Nuevo pedido">
        <section class="app-view app-view--form">
            <QuickOrderView 
                v-if="config.tablesMode !== 'si'"
                v-model:customer-name="customerName"
                v-model:items="orderItems"
            />
            <RestaurantOrderView v-else />
        </section>
    </div>

    <AppContentFooter>
        <template #summary>
            <OrderTotals :subtotal="subtotal" :tip="tipAmount" />
        </template>
        <template v-if="config.tablesMode === 'si'" #actions>
            <RouterLink to="/app/orders" class="btn btn--outline-primary">Volver</RouterLink>

            <BaseButton
                type="submit"
                variant="primary">
                Atrás
            </BaseButton>

            <BaseButton
                type="submit"
                variant="primary">
                Guardar
            </BaseButton>
        </template>

        <template v-else #actions>
            <RouterLink to="/app/orders" class="btn btn--outline-primary">Volver</RouterLink>

            <BaseButton
                type="submit"
                variant="primary"
                form="dish-form">
                Guardar
            </BaseButton>
        </template>
    </AppContentFooter>
</template>

<script setup>
import { ref, computed, } from 'vue'
import { useBusinessConfig } from '@/composables/useBusinessConfig'
import AppContentHeader from '@/components/layout/AppContentHeader.vue'
import QuickOrderView from '@/views/orders/QuickOrderView.vue'
import RestaurantOrderView from '@/views/orders/RestaurantOrderView.vue'
import AppContentFooter from '@/components/layout/AppContentFooter.vue'
import OrderTotals from '@/components/orders/OrderTotals.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { config } = useBusinessConfig()

const customerName = ref('')

const orderItems = ref([])

const subtotal = computed(() => {
    return orderItems.value.reduce(
        (total, item) =>
            total +
            (
                Number(item.price || 0) *
                Number(item.quantity || 0)
            ),
        0
    )
})

const tipAmount = computed(() => {
    return Math.round(
        subtotal.value * 0.1
    )
})
</script>