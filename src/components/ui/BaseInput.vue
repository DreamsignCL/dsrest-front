<template>
    <div class="field">
        <label v-if="label" class="form-label" :for="inputId">
            {{ label }} <span v-if="required" class="form-label__required">*</span>
        </label>

        <div class="form-control-wrapper">
            <input
                :id="inputId"
                class="form-control"
                :class="classes"
                :type="inputType"
                :placeholder="placeholder"
                :value="modelValue"
                :disabled="disabled"
                :aria-label="ariaLabel"
                :aria-describedby="[
                    helper ? `${inputId}-helper` : null,
                    error ? `${inputId}-error` : null
                ].filter(Boolean).join(' ')"
                :aria-invalid="!!error"
                @input="emit('update:modelValue', $event.target.value)"
            />
            <button
                v-if="type === 'password'"
                type="button"
                class="form-control__icon"
                @click="togglePassword">
                <Eye v-if="!showPassword" :size="18" aria-hidden="true" />
                <EyeOff v-else :size="18" aria-hidden="true" />
            </button>
        </div>

        <div :id="`${inputId}-helper`" v-if="helper" class="form-helper">
            {{ helper }}
        </div>
        
        <div v-if="error" :id="`${inputId}-error`" class="form-error" role="alert">
            {{ error }}
        </div>
    </div>
</template>

<script setup>
import { computed, ref, useId } from 'vue'
import {Eye,EyeOff,} from 'lucide-vue-next'

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: '',
    },

    id: {
        type: String,
        default: '',
    },

    label: {
        type: String,
        default: '',
    },

    error: {
        type: String,
        default: '',
    },

    type: {
        type: String,
        default: 'text',
    },

    placeholder: {
        type: String,
        default: '',
    },

    disabled: {
        type: Boolean,
        default: false,
    },

    ariaLabel: {
        type: String,
        default: '',
    },

    helper: {
        type: String,
        default: '',
    },

    required: {
        type: Boolean,
        default: false,
    },

    size: {
        type: String,
        default: null,
        validator: (value) => ['sm', 'lg'].includes(value),
    },
})

const classes = computed(() => [
  'form-control',
  `form-control--${props.variant}`,
  props.size ? `form-control--${props.size}` : null,
  {
    'is-error': props.error,
    'has-icon': props.type === 'password',
  },
])

const generatedId = useId()

const inputId = computed(() =>
    props.id || generatedId
)

const emit = defineEmits([
    'update:modelValue',
])

/* Password visibility */

const showPassword = ref(false)

const togglePassword = () => {
    showPassword.value = !showPassword.value
}

/* Dynamic input type */

const inputType = computed(() => {
    if (props.type !== 'password') {
        return props.type
    }

    return showPassword.value
        ? 'text'
        : 'password'
})

</script>