<template>
    <div
        class="toast"
        :class="`toast--${variant}`"
        role="status"
        aria-live="polite">

        <span
            v-if="showIcon"
            class="toast__icon"
            aria-hidden="true">

            {{ icon }}

        </span>

        <span class="toast__message">
            {{ message }}
        </span>

    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    message: {
        type: String,
        required: true,
    },

    variant: {
        type: String,
        default: 'info',
    },

    showIcon: {
        type: Boolean,
        default: false,
    },
})

const icon = computed(() => {

    switch (props.variant) {

        case 'success':
            return '✓'

        case 'warning':
            return '⚠'

        case 'error':
            return '✕'

        default:
            return 'ℹ'
    }
})
</script>