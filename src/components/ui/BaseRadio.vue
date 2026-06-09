<template>
    <div class="field">
        <div
            class="radio-group"
            :class="`radio-group--${variant}`"
            :role="inline ? 'radiogroup' : undefined">

            <label
                v-for="option in options"
                :key="option.value"
                class="radio">

                <input
                    type="radio"
                    :name="name"
                    :value="option.value"
                    :checked="modelValue === option.value"
                    :disabled="disabled"
                    @change="updateValue"
                />

                <span class="radio__control"></span>

                <span class="radio__label">
                    {{ option.label }}
                </span>
            </label>

        </div>

        <div v-if="helper" class="form-helper">
            {{ helper }}
        </div>
    </div>
</template>

<script setup>

defineProps({
    modelValue: {
        type: [String, Number],
        default: '',
    },

    name: {
        type: String,
        required: true,
    },

    options: {
        type: Array,
        default: () => [],
    },

    disabled: {
        type: Boolean,
        default: false,
    },

    helper: {
        type: String,
        default: '',
    },

    inline: {
        type: Boolean,
        default: false,
    },

    variant: {
        type: String,
        default: 'vertical',
    }
})

const emit = defineEmits([
    'update:modelValue',
])

const updateValue = event => {

    emit(
        'update:modelValue',
        event.target.value
    )
}

</script>