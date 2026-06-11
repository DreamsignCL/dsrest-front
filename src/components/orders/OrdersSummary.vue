<template>
    <div class="summary summary--orders">
        <div
            v-for="item in summaryItems"
            :key="item.label"
            class="summary__item">

            <span class="summary__icon">
                <component :is="item.icon" :size="18" aria-hidden="true" />
            </span>

            <span class="summary__label">
                {{ item.label }}
            </span>

            <strong class="summary__value">
                {{ formatCurrency(item.value) }}
            </strong>

        </div>
    </div>
</template>


<script setup>
import { computed } from 'vue'
import {
    Calculator,
    HandCoins,
    DollarSign,
    Percent
} from 'lucide-vue-next'

const props = defineProps({
    orders: {
        type: Array,
        default: () => [],
    },
})

const paidOrders = computed(() => {

    return props.orders.filter(
        order =>
            order.estado
                ?.toLowerCase()
                .trim() === 'pagado'
    )
})

const totalAmount = computed(() => {

    const total =
        paidOrders.value.reduce(
            (total, order) =>
                total +
                Number(order.total || 0),
            0
        )

    return total
})

const tipsAmount = computed(() => {
    return paidOrders.value.reduce(
        (total, order) =>
            total +
            Number(
                order.propinaPagada || 0
            ),
        0
    )
})

const netAmount = computed(() => {
    return (
        totalAmount.value / 1.19
    )
})

const vatAmount = computed(() => {
    return (
        totalAmount.value -
        netAmount.value
    )
})

const grandTotal = computed(() => {

    return (
        totalAmount.value +
        tipsAmount.value
    )
})

const formatCurrency = value => {
    return value.toLocaleString(
        'es-CL',
        {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0,
        }
    )
}

const summaryItems = computed(() => [
    {
        icon: Calculator,
        label: 'Neto',
        value: netAmount.value,
    },
    {
        icon: Percent,
        label: 'IVA (19%)',
        value: vatAmount.value,
    },
    {
        icon: HandCoins,
        label: 'Propina',
        value: tipsAmount.value,
    },
    {
        icon: DollarSign,
        label: 'Total',
        value: grandTotal.value,
    },
])
</script>