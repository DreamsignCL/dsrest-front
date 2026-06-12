<template>
    <div class="panel__content panel__content--new-order">
        <AppHeader
            title="Nuevo pedido"
            description="Completa la información para generar un nuevo pedido"
        />

        <div class="panel__body">
            <OrderCustomerCollapse v-model="customerName" />

            <hr aria-hidden="true">

            <OrderItemsSection :items="items" @add="openDishModal" />
        </div>

        <footer class="panel__footer">
            <OrderTotals 
                :subtotal="subtotal"
                 :tip="tipAmount"
            />
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
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import OrderCustomerCollapse from '@/components/orders/OrderCustomerCollapse.vue'
import OrderItemsSection from '@/components/orders/OrderItemsSection.vue'
import OrderTotals from '@/components/orders/OrderTotals.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import DsSignature from '@/components/DsSignature.vue'

const customerName = ref('')

const items = ref([])
</script>