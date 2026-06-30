<template>
    <div class="field">
        <label v-if="label" :for="selectId" class="form-label">
            {{ label }} <span v-if="required" class="form-label__required">*</span>
        </label>

        <select
            :id="selectId"
            class="form-select"
            :class="{ 'is-error': error }"
            :value="modelValue"
            :disabled="disabled"
            :aria-label="ariaLabel"
            :aria-describedby="[
                helper ? `${selectId}-helper` : null,
                error ? `${selectId}-error` : null
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

        <div :id="`${selectId}-helper`" v-if="helper" class="form-helper">
            {{ helper }}
        </div>
        
        <div v-if="error" :id="`${selectId}-error`" class="form-error" role="alert">
            {{ error }}
        </div>
    </div>
</template>

<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
    id: {
        type: String,
        default: '',
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

const generatedId = useId()

const selectId = computed(() =>
    props.id || generatedId
)

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