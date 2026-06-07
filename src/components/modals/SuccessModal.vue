<template>
    <BaseModal
        :model-value="modelValue"
        :title="title"
        @update:modelValue="$emit('update:modelValue', $event)">
        
        <div class="success-modal">
            <div class="success-modal__icon">
                <CircleCheckBig :size="56" />
            </div>

            <p class="success-modal__message">
                {{ message }}
            </p>
        </div>

        <template #footer>
            <BaseButton
                type="button"
                variant="secondary"
                block
                @click="closeModal">
                {{ buttonText }}
            </BaseButton>
        </template>
    </BaseModal>
</template>

<script setup>
import { CircleCheckBig } from 'lucide-vue-next'

import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },

    title: {
        type: String,
        default: 'Operación exitosa',
    },

    message: {
        type: String,
        default: '',
    },

    buttonText: {
        type: String,
        default: 'Aceptar',
    },
})

const emit = defineEmits([
    'update:modelValue',
])

const closeModal = () => {
    emit('update:modelValue', false)
}
</script>