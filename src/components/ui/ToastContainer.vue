<template>
    <div
        v-if="toasts.length"
        class="toast-container"
        aria-live="polite"
        aria-atomic="true">

        <TransitionGroup
            name="toast">

            <BaseToast
                v-for="toast in toasts"
                :key="toast.id"
                :message="toast.message"
                :variant="toast.variant"
                :show-icon="toast.showIcon" />

        </TransitionGroup>

    </div>
</template>

<script setup>
import BaseToast from '@/components/ui/BaseToast.vue'
import { useToast } from '@/composables/useToast'

const { toasts } = useToast()
</script>