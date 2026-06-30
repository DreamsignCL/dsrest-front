<template>
    <div class="field field--image">
        <label
            v-if="label"
            :for="inputId"
            class="form-label">
            {{ label }}
        </label>

        <label
            :for="inputId"
            class="image-uploader"
            :class="[
                `image-uploader--${variant}`,
                {
                    'image-uploader--disabled': disabled,
                    'image-uploader--has-image': previewUrl,
                    'is-error': error,
                },
            ]">

            <input
                :id="inputId"
                ref="fileInput"
                class="image-uploader__input"
                type="file"
                accept="image/*"
                :disabled="disabled"
                @change="handleFileChange"
            />

            <template v-if="previewUrl">
                <img :src="previewUrl" alt="" class="image-uploader__preview" />

                <BaseButton
                    type="button"
                    class="btn--close"
                    variant="primary"
                    aria-label="Eliminar imagen"
                    @click.stop="removeImage">
                    <X :size="18" aria-hidden="true" />
                </BaseButton>

                <div class="image-uploader__overlay">
                    Cambiar imagen
                </div>
            </template>

            <template v-else>
                <div class="image-uploader__placeholder">
                    <span class="image-uploader__icon">
                        <Plus :size="18" aria-hidden="true" />
                    </span>

                    <span class="image-uploader__text">
                        Agregar imagen
                    </span>
                </div>
            </template>
        </label>

        <div v-if="helper" class="form-helper">
            {{ helper }}
        </div>

        <div v-if="error" class="form-error">
            {{ error }}
        </div>
    </div>
</template>

<script setup>
import { computed, useId } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { X, Plus } from 'lucide-vue-next'

const props = defineProps({
    id: {
        type: String,
        required: true,
    },

    modelValue: {
        type: [File, String],
        default: null,
    },

    label: {
        type: String,
        default: '',
    },

    helper: {
        type: String,
        default: '',
    },

    disabled: {
        type: Boolean,
        default: false,
    },

    variant: {
        type: String,
        default: 'circle',
    },

    error: {
        type: String,
        default: '',
    },

    maxSize: {
        type: Number,
        default: 1024 * 1024,
    },
})

const generatedId = useId()

const inputId = computed(() =>
    props.id || generatedId
)

const emit = defineEmits([
    'update:modelValue',
    'error',
])

const removeImage = () => {
    emit(
        'update:modelValue',
        null
    )
}

const previewUrl = computed(() => {

    if (!props.modelValue) {
        return null
    }

    if (typeof props.modelValue === 'string') {
        return props.modelValue
    }

    return URL.createObjectURL(
        props.modelValue
    )
})

const handleFileChange = event => {

    const file = event.target.files?.[0]

    console.log(
        'FILE SIZE',
        file.size
    )

    if (!file) {
        return
    }

    if (
        file.size >
        props.maxSize
    ) {

        emit(
            'error',
            'La imagen supera el tamaño permitido'
        )

        event.target.value = ''

        return
    }

    emit(
        'update:modelValue',
        file
    )
}
</script>