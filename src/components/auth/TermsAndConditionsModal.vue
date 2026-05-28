<template>
    <transition name="fade">
        <div
            v-if="modelValue"
            class="modal modal--terms"
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-title">

            <div class="modal__overlay" @click="closeModal"></div>

            <div class="modal__content">
                <header class="modal__header">
                    <h2 id="terms-title">Términos y condiciones</h2>
                </header>

                <div
                    ref="scrollContainer"
                    class="modal__body"
                    @scroll="handleScroll">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                    </p>

                    <p>
                        Aquí irán todos tus términos legales reales.
                    </p>

                    <p v-for="i in 20" :key="i">
                        Contenido legal {{ i }}
                    </p>
                </div>

                <footer class="modal__footer">
                    <BaseButton variant="outline-primary" @click="closeModal">
                        Cancelar
                    </BaseButton>

                    <BaseButton variant="primary" :disabled="!hasReachedEnd" @click="acceptTerms">
                        Aceptar
                    </BaseButton>
                </footer>
            </div>
        </div>
    </transition>
</template>

<script setup>

import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits([
    'update:modelValue',
    'accepted',
])

const scrollContainer = ref(null)

const hasReachedEnd = ref(false)

const closeModal = () => {
    emit('update:modelValue', false)
}

const handleScroll = () => {

    const element = scrollContainer.value

    if (!element) return

    const isBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 10

    if (isBottom) {
        hasReachedEnd.value = true
    }
}

const acceptTerms = () => {

    emit('accepted')

    emit('update:modelValue', false)
}

</script>