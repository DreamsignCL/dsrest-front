<template>
  <div v-if="show" class="modal-overlay" @click.self="onCancel">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5>{{ categoriaEditar ? 'Editar categoría' : 'Crear categoría' }}</h5>
        <button class="close" @click="onCancel">&times;</button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <label class="form-label">Nombre de la categoría</label>
          <input
            v-model="nombre"
            class="form-control"
            placeholder="Ej: Cafés"
            :class="{ 'is-invalid': errorNombre }"
          />
          <div v-if="errorNombre" class="invalid-feedback">{{ errorNombre }}</div>
        </div>
        <div class="mb-3">
          <label class="form-label">Descripción (opcional)</label>
          <textarea
            v-model="descripcion"
            class="form-control"
            placeholder="Descripción de la categoría"
            rows="2"
          ></textarea>
        </div>
        <div v-if="errorGeneral" class="alert alert-danger py-2">{{ errorGeneral }}</div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline-primary" @click="onCancel">Cancelar</button>
        <button class="btn btn-primary" :disabled="!nombre.trim() || guardando" @click="onGuardar">
          {{ guardando ? 'Guardando...' : categoriaEditar ? 'Guardar cambios' : 'Crear categoría' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  categoriaEditar: Object,
})

const emit = defineEmits(['guardar', 'cancel'])

const nombre = ref('')
const descripcion = ref('')
const errorNombre = ref('')
const errorGeneral = ref('')
const guardando = ref(false)

watch(
  () => props.categoriaEditar,
  (cat) => {
    nombre.value = cat?.nombre || ''
    descripcion.value = cat?.descripcion || ''
    errorNombre.value = ''
    errorGeneral.value = ''
  },
  { immediate: true }
)

watch(
  () => props.show,
  (val) => {
    if (val) {
      errorNombre.value = ''
      errorGeneral.value = ''
      guardando.value = false
    }
  }
)

const onGuardar = () => {
  errorNombre.value = ''
  errorGeneral.value = ''

  if (!nombre.value.trim()) {
    errorNombre.value = 'Debe ingresar el nombre de la categoría'
    return
  }

  guardando.value = true
  emit('guardar', {
    id: props.categoriaEditar?.id,
    nombre: nombre.value.trim(),
    descripcion: descripcion.value.trim() || null,
  })
}

const onCancel = () => {
  errorNombre.value = ''
  errorGeneral.value = ''
  emit('cancel')
}

const setErrorGeneral = (value) => {
  errorGeneral.value = value || ''
}

const setGuardando = (value) => {
  guardando.value = !!value
}

defineExpose({ errorGeneral, guardando, setErrorGeneral, setGuardando })
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 24px 20px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  position: relative;
}
.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  top: 12px;
  right: 16px;
}
</style>
