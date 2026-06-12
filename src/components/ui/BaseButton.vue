<template>
    <button
        :type="type"
        :disabled="disabled"
        :form="form"
        :class="classes">
        <slot />
    </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
    },

    size: {
        type: String,
        default: null,
        validator: (value) => ['sm', 'lg'].includes(value),
    },

    block: {
        type: Boolean,
        default: false,
    },

    disabled: {
        type: Boolean,
        default: false,
    },

    type: {
        type: String,
        default: 'button',
    },

    form: {
        type: String,
        default: null,
    }
})

const classes = computed(() => [
    'btn',
    `btn--${props.variant}`,
    props.size ? `btn--${props.size}` : null,
    {
        'btn--block': props.block,
    },
])
</script>