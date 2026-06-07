<template>
    <div class="field">
        <label v-if="label" class="form-label" :for="id">
            {{ label }} <span v-if="required" class="form-label__required">*</span>
        </label>

        <div class="form-control-wrapper">
            <input
                :id="id"
                class="form-control"
                :class="{
                    'is-error': error,
                    'has-icon': type === 'password',
                }"
                :type="inputType"
                :placeholder="placeholder"
                :value="modelValue"
                :required="required"
                :aria-label="ariaLabel"
                :aria-describedby="[
                    helper ? `${id}-helper` : null,
                    error ? `${id}-error` : null
                ].filter(Boolean).join(' ')"
                :aria-invalid="!!error"
                @input="emit('update:modelValue', $event.target.value)"
            />
            <button
                v-if="type === 'password'"
                type="button"
                class="form-control__icon"
                @click="togglePassword">
                <Eye v-if="!showPassword" :size="18" />
                <EyeOff v-else :size="18" />
            </button>
        </div>

        <div :id="`${id}-helper`" v-if="helper" class="form-helper">
            {{ helper }}
        </div>
        
        <div v-if="error" :id="`${id}-error`" class="form-error" role="alert">
            {{ error }}
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import {Eye,EyeOff,} from 'lucide-vue-next'

const props = defineProps({
    modelValue: {
        type: String,
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
    }
})

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