<template>
    <div class="field">
        <label v-if="label" :for="id" class="form-label">
            {{ label }} <span v-if="required" class="form-label__required">*</span>
        </label>

        <select
            :id="id"
            class="form-select"
            :class="{ 'is-error': error }"
            :value="modelValue"
            :required="required"
            :disabled="disabled"
            :aria-label="ariaLabel"
            :aria-describedby="[
                helper ? `${id}-helper` : null,
                error ? `${id}-error` : null
            ].filter(Boolean).join(' ')"
            :aria-invalid="!!error"
            @change="updateValue">
            
            <option value="" disabled>
                {{ placeholder }}
            </option>

            <option
                v-for="option in options"
                :key="option.value"
                :value="option.value">
                {{ option.label }}
            </option>
        </select>

        <div :id="`${id}-helper`" v-if="helper" class="form-helper">
            {{ helper }}
        </div>
        
        <div v-if="error" :id="`${id}-error`" class="form-error" role="alert">
            {{ error }}
        </div>
    </div>
</template>

<script setup>
defineProps({
    id: {
        type: String,
        required: true,
    },

    label: {
        type: String,
        default: '',
    },

    modelValue: {
        type: [String, Number],
        default: '',
    },

    placeholder: {
        type: String,
        default: 'Seleccionar',
    },

    options: {
        type: Array,
        default: () => [],
    },

    error: {
        type: String,
        default: '',
    },

    disabled: {
        type: Boolean,
        default: false,
    },

    required: {
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
        event.target.value
    )
}
</script>