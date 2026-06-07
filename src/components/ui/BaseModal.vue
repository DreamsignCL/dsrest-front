<template>
    <Teleport to="body">
        <transition name="modal-fade">
            <div
                v-if="modelValue"
                :class="classes"
                role="dialog"
                aria-modal="true"
                :aria-labelledby="title ? 'modal-title' : undefined"
                tabindex="-1"
                @click="handleOverlayClick">

                <div class="modal__overlay" @click="close"></div>

                <div class="modal__content" @click.stop>
                    <header v-if="title || $slots.header" class="modal__header">
                        <slot name="header">
                            <h5 id="modal-title" class="modal__title">
                                {{ title }}
                            </h5>
                        </slot>

                        <BaseButton
                            v-if="closable"
                            class="btn--close"
                            variant="primary"
                            type="button"
                            aria-label="Cerrar modal"
                            @click="close">
                            <X :size="18" aria-hidden="true" />
                        </BaseButton>
                    </header>

                    <div class="modal__body">
                        <slot />
                    </div>

                    <footer v-if="$slots.footer" class="modal__footer">
                        <slot name="footer" />
                    </footer>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from 'vue'
import { X } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },

    title: {
        type: String,
        default: '',
    },

    closable: {
        type: Boolean,
        default: true,
    },

    closeOnOverlay: {
        type: Boolean,
        default: true,
    },

    size: {
        type: String,
        default: 'md',
        validator: (value) => ['sm', 'md', 'lg'].includes(value),
    },

    fullscreen: {
        type: Boolean,
        default: false,
    },

    variant: {
        type: String,
        default: '',
    },
})

const classes = computed(() => [
    'modal',
    `modal--${props.variant}`,
    `modal--${props.size}`,
    {
        'modal--fullscreen': props.fullscreen,
    },
])

const emit = defineEmits([
    'update:modelValue',
    'close',
])

const close = () => {
    emit('update:modelValue', false)
    emit('close')
}

const handleOverlayClick = () => {
    if (!props.closeOnOverlay) return
    close()
}

const handleEscape = (event) => {
    if (event.key === 'Escape') {
        close()
    }
}

onMounted(() => {
    document.addEventListener(
        'keydown',
        handleEscape
    )
})

onUnmounted(() => {
    document.removeEventListener(
        'keydown',
        handleEscape
    )
})
</script>