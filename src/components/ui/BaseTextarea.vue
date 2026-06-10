<template>
    <div class="field">
        <label v-if="label" class="form-label" :for="textareaId">
            {{ label }} <span v-if="required" class="form-label__required">*</span>
        </label>

        <div class="form-control-wrapper">
            <textarea
                :id="textareaId"
                class="form-control"
                :class="{'is-error': error}"
                :placeholder="placeholder"
                :value="modelValue"
                :required="required"
                :disabled="disabled"
                :aria-label="ariaLabel"
                :aria-describedby="[
                    helper ? `${textareaId}-helper` : null,
                    error ? `${textareaId}-error` : null,
                    maxlength ? `${textareaId}-counter` : null
                ].filter(Boolean).join(' ')"
                :rows="rows"
                :maxlength="maxlength"
                :style="{ resize }"
                :aria-invalid="!!error"
                @input="emit('update:modelValue', $event.target.value)">
            </textarea>
        </div>

        <div
            v-if="maxlength"
            :id="`${textareaId}-counter`"
            class="form-counter">
            {{ modelValue.length }}/{{ maxlength }}
        </div>

        <div :id="`${textareaId}-helper`" v-if="helper" class="form-helper">
            {{ helper }}
        </div>
        
        <div v-if="error" :id="`${textareaId}-error`" class="form-error" role="alert">
            {{ error }}
        </div>
    </div>
</template>

<script setup>
import { computed, useId } from 'vue'

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

    rows: {
        type: Number,
        default: 4,
    },

    maxlength: {
        type: Number,
        default: undefined,
    },

    resize: {
        type: String,
        default: 'vertical',
        validator: value =>
            ['none', 'both', 'horizontal', 'vertical'].includes(value),
    },

    error: {
        type: String,
        default: '',
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
    }
})

const generatedId = useId()

const textareaId = computed(() =>
    props.id || generatedId
)

const emit = defineEmits([
    'update:modelValue',
])

</script>