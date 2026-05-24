<template>
  <div v-if="show" class="modal animate__animated animate__fadeIn" @click.self="$emit('cancel')">
    <div class="modal-content animate__animated animate__fadeInUp modal-caja">
      <div class="modal-header">
        <h4 class="modal-title">Apertura de caja</h4>
        <button class="btn-close" type="button" @click="$emit('cancel')"></button>
      </div>
      <div class="modal-body">
        <p v-if="sugerida" class="hint">
          Se encontró cierre previo. Monto sugerido:
          <strong>${{ formatear(montoSugerido) }}</strong>
        </p>
        <label class="form-label">Saldo inicial:</label>
        <div class="input-group">
          <span class="input-group-text">$</span>
          <input
            v-model.number="monto"
            type="number"
            class="form-control"
            min="0"
            placeholder="50000"
          />
        </div>
        <small v-if="monto === null || monto === undefined || monto === ''"
class="text-danger"
        >Debe ingresar el monto inicial de caja</small
        >
        <small v-else-if="monto < 0"
class="text-danger"
        >El monto inicial debe ser mayor o igual a 0</small
        >
      </div>
      <div class="modal-footer justify-content-center">
        <button class="btn btn-outline-primary rounded-pill" type="button" @click="$emit('cancel')">
          Cancelar
        </button>
        <button
          class="btn btn-primary rounded-pill"
          type="button"
          :disabled="!puedeAbrir"
          @click="confirmar"
        >
          Sí, abrir
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  montoSugerido: { type: Number, default: 50000 },
  sugerida: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'cancel'])
const monto = ref(50000)

watch(
  () => props.show,
  (value) => {
    if (value) {
      monto.value = Number(props.montoSugerido || 50000)
    }
  }
)

const puedeAbrir = computed(
  () => monto.value !== '' && monto.value !== null && Number(monto.value) >= 0
)

const confirmar = () => {
  if (!puedeAbrir.value) return
  emit('confirm', Math.round(Number(monto.value)))
}

const formatear = (n) => Math.round(Number(n) || 0).toLocaleString('es-CL')
</script>

<style scoped>
.modal-caja {
  max-width: 420px;
}
.hint {
  color: #0a8ed8;
  font-size: 0.9rem;
}
</style>
