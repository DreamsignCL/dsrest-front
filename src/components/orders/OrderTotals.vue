<template>
    <div class="summary summary--order-totals">
        <div
            v-for="item in totalItems"
            :key="item.label"
            class="summary__item"
            :class="item.class">

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

const props = defineProps({
    subtotal: {
        type: Number,
        default: 0,
    },

    tipPercentage: {
        type: Number,
        default: 10,
    },
})

const tipAmount = computed(() => {

    return Math.round(
        props.subtotal *
        (props.tipPercentage / 100)
    )
})

const totalAmount = computed(() => {

    return (
        props.subtotal +
        tipAmount.value
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

const totalItems = computed(() => [

    {
        label: 'Subtotal',
        value: props.subtotal,
        class: 'subtotal',
    },

    {
        label: `Propina (${props.tipPercentage}%)`,
        value: tipAmount.value,
        class: 'tip',
    },

    {
        label: 'Total',
        value: totalAmount.value,
        class: 'total',
    },
])
</script>