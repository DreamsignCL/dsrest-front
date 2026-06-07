<template>
    <BaseModal
        :model-value="modelValue"
        :title="title"
        :variant="confirmVariant"
        @update:modelValue="$emit('update:modelValue', $event)"
    >
        <p class="confirm-modal__message">
            {{ message }}
        </p>

        <template #footer>
            <BaseButton
                type="button"
                variant="outline-primary"
                size="sm"
                @click="$emit('cancel')">
                {{ cancelText }}                
            </BaseButton>

            <BaseButton
                type="button"
                :variant="confirmVariant"
                size="sm"
                @click="handleConfirm">
                {{ confirmText }}
            </BaseButton>
        </template>
    </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },

    title: {
        type: String,
        default: 'Confirmar acción',
    },

    message: {
        type: String,
        default: '',
    },

    confirmText: {
        type: String,
        default: 'Confirmar',
    },

    cancelText: {
        type: String,
        default: 'Cancelar',
    },

    confirmVariant: {
        type: String,
        default: 'danger',
    },
})

const emit = defineEmits([
    'update:modelValue',
    'confirm',
    'cancel',
])

const handleConfirm = () => {

    emit('confirm')

    emit('update:modelValue', false)
}
</script>