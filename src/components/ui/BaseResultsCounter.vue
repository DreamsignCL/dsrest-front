<template>
    <p class="results-counter" aria-live="polite">
        Mostrando <strong>{{ count }}</strong> {{ label }}
    </p>
</template>

<script setup>
defineProps({
    count: {
        type: Number,
        default: 0,
    },

    label: {
        type: String,
        default: 'resultados',
    },
})
</script>