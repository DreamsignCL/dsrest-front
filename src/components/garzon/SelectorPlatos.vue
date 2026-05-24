<template>
  <div class="form-group d-flex align-items-center gap-2 px-4 mb-3">
    <select v-model="platoSeleccionado" class="form-select flex-grow-1">
      <option disabled value="">Selecciona un plato</option>
      <option v-for="plato in platos" :key="plato.id" :value="plato">
        {{ plato.nombre }}
      </option>
    </select>
    <input
      v-model="cantidadSeleccionada"
      class="form-control"
      style="width: 40%"
      type="number"
      min="1"
      placeholder="Cantidad"
    />
    <button class="btn btn-primary" @click="agregarPlato">
      <img
        src="../../assets/img/edit-icon.svg"
        alt="Agregar"
        style="width: 20px; height: 20px; filter: brightness(0) invert(1)"
      />
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiService } from '@/services/api.service'

const emit = defineEmits(['plato-agregado'])

const platos = ref([])
const platoSeleccionado = ref('')
const cantidadSeleccionada = ref('')

const agregarPlato = () => {
  const cantidad = parseInt(cantidadSeleccionada.value)

  if (!platoSeleccionado.value || isNaN(cantidad) || cantidad < 1) {
    alert('Selecciona un plato y una cantidad válida')
    return
  }

  const nuevoPlato = {
    plato: platoSeleccionado.value,
    cantidad: cantidad,
  }

  emit('plato-seleccionado', nuevoPlato)
  platoSeleccionado.value = ''
  cantidadSeleccionada.value = ''
}

const obtenerPlatos = async () => {
  try {
    const localStr = localStorage.getItem('local')
    const local = localStr ? JSON.parse(localStr) : null
    const localId = local?.id
    if (!localId) {
      alert('No se encontró el local')
      return
    }
    const data = await apiService.get(`platos/porlocal/${localId}`)
    platos.value = data
  } catch (error) {
    console.error('Error al obtener platos:', error)
  }
}

onMounted(() => {
  obtenerPlatos()
})
</script>
