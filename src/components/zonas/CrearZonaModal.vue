<template>
  <div v-if="show" class="modal-overlay" @click.self="onCancel">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5>{{ zonaEditar ? 'Editar zona' : 'Crear zona' }}</h5>
        <button class="close" @click="onCancel">&times;</button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <label class="form-label">Nombre de la zona</label>
          <input class="form-control" v-model="nombre" placeholder="Ej: Terraza" />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline-primary" @click="onCancel">Cancelar</button>
        <button class="btn btn-primary" :disabled="!nombre" @click="onCrear">
          {{ zonaEditar ? 'Guardar cambios' : 'Crear zona' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  show: Boolean,
  zonaEditar: Object 
})
const emit = defineEmits(['crear', 'cancel'])

const nombre = ref('')

watch(() => props.zonaEditar, (zona) => {
  nombre.value = zona?.nombre || ''
}, { immediate: true })

const onCrear = () => {
  emit('crear', { nombre: nombre.value, id: props.zonaEditar?.id })
}
const onCancel = () => emit('cancel')
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 24px 20px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  position: relative;
}
.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  top: 12px; right: 16px;
}
</style>