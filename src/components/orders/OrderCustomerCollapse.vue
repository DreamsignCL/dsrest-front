<template>
    <div class="collapse collapse--order-customer">
        <button
            type="button"
            class="order-customer__header"
            :class="isOpen ? 'active' : ''"
            :aria-expanded="isOpen"
            aria-controls="order-customer-content"
            :aria-label="
                modelValue
                    ? `Cliente ${modelValue}`
                    : 'Cliente opcional'
            "
            @click="isOpen = !isOpen">

            <span>
                <template v-if="modelValue"> 
                    <strong>Cliente:</strong> {{ modelValue }} 
                </template>
                <template v-else> 
                    Ingresa el nombre del cliente (opcional) 
                </template>
            </span>

            <ChevronDown v-if="!isOpen" :size="18" />
            <ChevronUp v-else :size="18" />
        </button>

        <Transition name="collapse">
            <div
                v-if="isOpen" 
                id="order-customer-content" 
                class="collapse__body">

                <BaseInput
                    id="customer-name"
                    size="sm"
                    placeholder="Ej: Gabriel"
                    :model-value="modelValue"
                    @update:model-value="updateValue"
                />

                <BaseButton
                    type="button"
                    size="sm"
                    variant="secondary"
                    @click="confirmName">
                    {{ modelValue ? 'Actualizar' : 'Aceptar' }}
                </BaseButton>

            </div>
        </Transition>
    </div>

</template>

<script setup>
import { ref } from 'vue'
import { ChevronDown, ChevronUp, } from 'lucide-vue-next'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
})

const emit = defineEmits([
    'update:modelValue',
])

const isOpen = ref(true)

const updateValue = value => {
    emit(
        'update:modelValue',
        value
    )
}

const confirmName = () => {
    isOpen.value = false
}
</script>