<template>
    <AppContentHeader
        title="Nuevo pedido"
        description="Completa la información para generar un nuevo pedido">

        <template v-if="hasSteps" #summary>
            <OrderSteps
                :current-step="currentStep"
                :total-steps="2"
                :step-labels="[
                    'Mesa',
                    'Pedido',
                ]"
            />

        </template>
    </AppContentHeader>

    <div class="app-content__body" aria-label="Nuevo pedido">
        <section class="app-view app-view--form">
            <OrderTableSelector 
                v-if=" hasSteps && currentStep === 1"
                :show-customer="config.customerNameMode === 'si'"
                v-model:selected-zone="selectedZone"
                v-model:selected-table="selectedTable"
                v-model:customer-name="customerName"
                :error-zone="errors.zone"
                :error-table="errors.table"
                :error-customer-name="errors.customerName"
            />

            <OrderForm
                v-if=" !hasSteps || currentStep === 2"
                :show-customer="showCustomerInOrderForm"
                v-model:customer-name="customerName"
                v-model:items="orderItems"
            />
        </section>
    </div>

    <AppContentFooter>
        <template #summary>
            <OrderTotals
                :subtotal="subtotal"
                :tip="tipAmount" />
        </template>

        <!-- Actions - Sin pasos -->
        <template v-if="!hasSteps" #actions>
            <RouterLink
                to="/app/orders"
                class="btn btn--outline-primary">
                Volver
            </RouterLink>

            <BaseButton
                type="submit"
                variant="primary">
                Guardar
            </BaseButton>
        </template>

        <!-- Actions - Paso 1 -->
        <template v-else-if="currentStep === 1" #actions>
            <RouterLink
                to="/app/orders"
                class="btn btn--outline-primary">
                Volver
            </RouterLink>

            <BaseButton
                type="button"
                variant="primary"
                @click="goToStepTwo">
                Continuar
            </BaseButton>
        </template>

        <!-- Actions - Paso 2 -->
        <template v-else #actions>
            <RouterLink
                to="/app/orders"
                class="btn btn--outline-primary">
                Volver
            </RouterLink>

            <BaseButton
                type="button"
                variant="outline-primary"
                @click="goToStepOne">

                Atrás
            </BaseButton>

            <BaseButton
                type="submit"
                variant="primary">
                Guardar
            </BaseButton>
        </template>
    </AppContentFooter>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useBusinessConfig } from '@/composables/useBusinessConfig'
import AppContentHeader from '@/components/layout/AppContentHeader.vue'
import OrderForm from '@/components/orders/OrderForm.vue'
import AppContentFooter from '@/components/layout/AppContentFooter.vue'
import OrderTotals from '@/components/orders/OrderTotals.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import OrderTableSelector from '@/components/orders/OrderTableSelector.vue'
import OrderSteps from '@/components/orders/OrderSteps.vue'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

const { config } = useBusinessConfig()

const errors = reactive({})

const currentStep = ref(1)

const goToStepTwo = () => {

    Object.keys(errors).forEach(
        key => delete errors[key]
    )

    if (!selectedZone.value) {
        errors.zone =
            'Debes seleccionar una zona'
    }

    if (!selectedTable.value) {
        errors.table =
            'Debes seleccionar una mesa'
    }

    if (
        config.value.customerNameMode === 'si' &&
        !customerName.value.trim()
    ) {
        errors.customerName =
            'Debes ingresar el nombre del cliente'
    }

    const firstError =
        Object.values(errors)[0]

    if (firstError) {

        showToast({
            message: firstError,
            variant: 'error',
            showIcon: true,
        })

        return
    }

    currentStep.value = 2
}

const goToStepOne = () => {
    showStepErrors.value = false
    currentStep.value = 1
}

const hasSteps = computed(() =>
    config.value.tablesMode === 'si'
)

const customerName = ref('')

const selectedZone = ref(null)

const selectedTable = ref(null)

const orderItems = ref([])

const showCustomerInOrderForm = computed(() => {
    if (config.value.tablesMode === 'si') {
        return false
    }

    return config.value.customerNameMode !== 'no'
})

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