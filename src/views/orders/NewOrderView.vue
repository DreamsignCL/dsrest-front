<template>

    <QuickOrderView v-if="!rules.usesTables" />

    <RestaurantOrderView v-else />

</template>

<script setup>
import { useBusinessRules } from '@/composables/useBusinessRules'
import QuickOrderView from '@/views/orders/QuickOrderView.vue'
import RestaurantOrderView from '@/views/orders/RestaurantOrderView.vue'

const { rules } = useBusinessRules()
</script>