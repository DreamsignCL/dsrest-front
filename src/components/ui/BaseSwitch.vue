<template>
    <div class="field">
        <label class="switch-wrapper" :class="`switch--${variant}`" :for="inputId">
            <span class="switch" :class="`switch--${variant}`">
                <input
                    :id="inputId"
                    type="checkbox"
                    :checked="modelValue"
                    :disabled="disabled"
                    :aria-label="label || ariaLabel"
                    :aria-describedby="
                        helper
                            ? `${inputId}-helper`
                            : undefined
                    "
                    @change="updateValue"
                />
                <span class="slider round"></span>
            </span>
            
            <span v-if="label" class="switch__label">
                {{ label }}
            </span>
        </label>

        <div v-if="helper" :id="`${inputId}-helper`" class="form-helper">
            {{ helper }}
        </div>
    </div>
</template>

<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
    id: {
        type: String,
        required: true,
    },

    modelValue: {
        type: Boolean,
        default: false,
    },

    label: {
        type: String,
        default: '',
    },

    variant: {
        type: String,
        default: 'horizontal',
        validator: value =>
            ['horizontal', 'vertical'].includes(value),
    },

    disabled: {
        type: Boolean,
        default: false,
    },

    helper: {
        type: String,
        default: '',
    },

    ariaLabel: {
        type: String,
        default: '',
    },
})

const generatedId = useId()

const inputId = computed(() =>
    props.id || generatedId
)

const emit = defineEmits([
    'update:modelValue',
])

const updateValue = event => {
    emit(
        'update:modelValue',
        event.target.checked
    )
}
</script>