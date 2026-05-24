<template>
  <div class="form-container">
    <div class="form-container__header">
      <h2 class="text-primary">Datos del negocio</h2>
      <p>Ahora necesitamos información sobre tu negocio.</p>
    </div>

    <div class="form-container__body">
      <!-- Logo/Foto del local usando el componente ImageUploader -->
      <ImageUploader
        id="local-logo"
        label="Logotipo"
        :initial-preview="fotoPreview"
        @update:image="handleImageUpdate"
        @error="handleImageError"
      />

      <!-- RUT Empresa con autocompletado -->
      <div class="mb-3">
        <label class="form-label" for="local-rut">RUT empresa</label>
        <div :class="{ 'loading-empresa': buscandoEmpresa }">
          <input
            id="local-rut"
            class="form-control"
            type="text"
            :value="form.rut"
            placeholder="12.345.678-9"
            :class="{ 'input-error': localErrors.rut || errorBusquedaEmpresa }"
            @input="updateRut($event)"
          />
        </div>
        <span v-if="localErrors.rut" class="error-message animate__animated animate__fadeInUp">
          {{ localErrors.rut }}
        </span>
        <span
          v-if="errorBusquedaEmpresa && !localErrors.rut"
          class="error-message animate__animated animate__fadeInUp"
        >
          {{ errorBusquedaEmpresa }}
        </span>

        <!-- Nombre de la empresa (solo lectura) -->
        <div v-if="nombreEmpresa" class="mt-2">
          <label class="form-label">Razón social</label>
          <input class="form-control readonly-input" type="text" :value="nombreEmpresa" readonly />
        </div>
      </div>

      <!-- Nombre de fantasia -->
      <div class="mb-3">
        <label class="form-label" for="nombreFantasia">Nombre de fantasía</label>
        <input
          id="nombreFantasia"
          class="form-control"
          type="text"
          :value="form.nombreFantasia"
          placeholder="Como quieres que conozcan tu local"
          :class="{ 'input-error': localErrors.nombreFantasia }"
          @input="$emit('update:form', { ...form, nombreFantasia: $event.target.value })"
        />
        <span
          v-if="localErrors.nombreFantasia"
          class="error-message animate__animated animate__fadeInUp"
        >{{ localErrors.nombreFantasia }}</span
        >
      </div>

      <!-- Dirección -->
      <div class="mb-3">
        <label class="form-label" for="direccion">Dirección</label>
        <input
          id="direccion"
          class="form-control"
          type="text"
          :value="form.direccion"
          placeholder="Dirección del local"
          :class="{ 'input-error': localErrors.direccion }"
          @input="$emit('update:form', { ...form, direccion: $event.target.value })"
        />
        <span
          v-if="localErrors.direccion"
          class="error-message animate__animated animate__fadeInUp"
        >{{ localErrors.direccion }}</span
        >
      </div>

      <!-- Tipo -->
      <div class="mb-3">
        <label class="form-label" for="tipo">Tipo</label>
        <select
          id="tipo"
          class="form-select"
          :value="form.tipo"
          :class="{ 'input-error': localErrors.tipo }"
          @change="$emit('update:form', { ...form, tipo: $event.target.value })"
        >
          <option value="" disabled selected>Selecciona tipo</option>
          <option v-for="tipo in tipos" :key="tipo" :value="tipo">
            {{ tipo }}
          </option>
        </select>
        <span v-if="localErrors.tipo" class="error-message animate__animated animate__fadeInUp">{{
          localErrors.tipo
        }}</span>
      </div>
    </div>

    <div class="form-container__footer">
      <button class="btn btn-outline-primary rounded-pill" @click="$emit('back')">Atrás</button>
      <button class="btn btn-primary rounded-pill" :disabled="isLoading" @click="$emit('register')">
        {{ isLoading ? 'Registrando...' : 'Registrar' }}
      </button>
    </div>

    <div
      v-if="registerMessage"
      class="message"
      :class="{ 'error-message animate__animated animate__fadeInUp': registerError }"
    >
      {{ registerMessage }}
    </div>
  </div>
</template>

<script>
import ImageUploader from '../common/ImageUploader.vue'

export default {
  name: 'RegisterLocalForm',
  components: {
    ImageUploader,
  },
  props: {
    form: {
      type: Object,
      required: true,
    },
    fotoPreview: {
      type: String,
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    localErrors: {
      type: Object,
      default: () => ({}),
    },
    registerMessage: {
      type: String,
      default: '',
    },
    registerError: {
      type: Boolean,
      default: false,
    },
    nombreEmpresa: {
      type: String,
      default: '',
    },
    buscandoEmpresa: {
      type: Boolean,
      default: false,
    },
    errorBusquedaEmpresa: {
      type: String,
      default: '',
    },
    tipos: {
      type: Array,
      required: true,
    },
  },
  emits: ['back', 'register', 'buscar-empresa', 'update:form', 'error'],
  methods: {
    updateRut(event) {
      const rutFormateado = this.formatRut(event.target.value)
      this.$emit('update:form', { ...this.form, rut: rutFormateado })
      this.$emit('buscar-empresa')
    },
    handleImageUpdate(imageData) {
      this.$emit('update:form', { ...this.form, foto: imageData })
    },
    handleImageError(error) {
      this.$emit('error', { foto: error })
    },
    formatRut(rut) {
      rut = rut.replace(/[^\dkK]/g, '').toUpperCase()
      rut = rut.slice(0, 9)
      if (rut.length < 2) return rut
      const cuerpo = rut.slice(0, -1)
      const dv = rut.slice(-1)

      return `${cuerpo}-${dv}`
    },
  },
}
</script>

<style scoped>
/* Estilos para el autocompletado */
.readonly-input {
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.8;
}

.loading-empresa {
  position: relative;
}

.loading-empresa::after {
  content: '';
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border: 2px solid #ccc;
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}
</style>
