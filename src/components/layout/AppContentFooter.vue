<template>
    <footer class="app-content__footer">

        <div
            v-if="$slots.summary"
            class="app-content__summary">
            <slot name="summary" />
        </div>

        <div
            v-if="$slots.counter"
            class="app-content__counter">
            <slot name="counter" />
        </div>

        <div
            v-if="$slots.actions"
            class="app-content__actions">
            <slot name="actions" />
        </div>

        <DsSignature />

    </footer>
</template>

<script setup>
import DsSignature from '@/components/DsSignature.vue'
</script>