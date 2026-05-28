<template>
    <div class="form-checkbox">
        <label
            class="checkbox"
            :class="{
                'checkbox--disabled': disabled,
                'checkbox--error': error,
            }"
            :for="id">

            <input
                :id="id"
                class="checkbox__input"
                type="checkbox"
                :checked="modelValue"
                :disabled="disabled"
                :aria-invalid="!!error"
                :aria-describedby="error ? `${id}-error` : undefined"
                @change="handleChange"
            />

            <span class="checkbox__box"></span>

            <span class="checkbox__label">
                <slot>{{ label }}</slot>
            </span>
        </label>

        <span 
            v-if="error" 
            :id="`${id}-error`" 
            class="form-error" 
            role="alert" 
            aria-live="polite">
            {{ error }}
        </span>
    </div>
</template>

<script setup>

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },

    label: {
        type: String,
        default: '',
    },

    error: {
        type: String,
        default: '',
    },

    disabled: {
        type: Boolean,
        default: false,
    },

    id: {
        type: String,
        default: '',
    },
})

const emit = defineEmits([
    'update:modelValue',
])

const handleChange = (event) => {

    emit(
        'update:modelValue',
        event.target.checked
    )
}

</script>