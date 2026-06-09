<template>
    <div class="field">
        <label class="switch-wrapper" :class="`switch--${variant}`" :for="id">
            <span class="switch" :class="`switch--${variant}`">
                <input
                    :id="id"
                    type="checkbox"
                    :checked="modelValue"
                    :disabled="disabled"
                    :aria-label="label || ariaLabel"
                    :aria-describedby="
                        helper
                            ? `${id}-helper`
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

        <div v-if="helper" :id="`${id}-helper`" class="form-helper">
            {{ helper }}
        </div>
    </div>
</template>

<script setup>
defineProps({
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