<template>
  <div>
    <label class="form-label">{{ label }}</label>
    <div class="file-upload">
      <input
        :id="id"
        class="file-upload__input"
        type="file"
        accept="image/*"
        @change="handleFileChange"
      />
      <label :for="id" class="file-upload__label">
        <div v-if="preview" class="file-upload__preview">
          <img :src="preview" :alt="altText" />
        </div>
        <div v-else class="file-upload__placeholder">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 5v14"></path>
            <path d="M5 12h14"></path>
          </svg>
        </div>
      </label>
      <span v-if="error" class="error-message animate__animated animate__fadeInUp">
        {{ error }}
      </span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useImageHandler } from '../../composables/useImageHandler'

export default {
  name: 'ImageUploader',
  props: {
    label: {
      type: String,
      default: 'Imagen',
    },
    id: {
      type: String,
      default: () => `image-upload-${Date.now()}`,
    },
    altText: {
      type: String,
      default: 'Vista previa',
    },
    maxSize: {
      type: Number,
      default: 5000000, // 5MB
    },
    initialPreview: {
      type: String,
      default: null,
    },
  },
  emits: ['update:image', 'error'],
  setup(props, { emit }) {
    const { processImageFile } = useImageHandler()
    const preview = ref(props.initialPreview)
    const error = ref('')

    const handleFileChange = (event) => {
      error.value = ''
      processImageFile(
        event,
        (compressedImage) => {
          preview.value = compressedImage
          emit('update:image', compressedImage)
        },
        (errorMsg) => {
          error.value = errorMsg
          emit('error', errorMsg)
        },
        props.maxSize
      )
    }

    return {
      preview,
      error,
      handleFileChange,
    }
  },
}
</script>
