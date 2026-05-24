<script setup>
import { ref, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'

const props = defineProps({
  localNombre: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
  localFoto: {
    type: String,
    required: false, // Puedes poner `true` si siempre vendrá
  },
})

const emit = defineEmits(['close'])

const copySuccess = ref(false)

//Imprimir
const imprimir = () => {
  window.print()
}

// URL computada del QR
const qrUrl = computed(() => {
  return `${window.location.origin}/carta/${encodeURIComponent(props.localNombre)}`
})

const visitarCarta = () => {
  const url = `${window.location.origin}/carta/${encodeURIComponent(props.localNombre)}`
  window.open(url, '_blank')
}

const compartirCarta = async () => {
  const url = qrUrl.value

  try {
    if (navigator.share) {
      // Usar Web Share API si está disponible
      await navigator.share({
        title: `Carta de ${props.localNombre}`,
        text: `¡Visita nuestra carta digital!`,
        url: url,
      })
    } else {
      // Fallback: copiar al portapapeles
      await navigator.clipboard.writeText(url)
      copySuccess.value = true
      setTimeout(() => {
        copySuccess.value = false
      }, 2000)
    }
  } catch (error) {
    console.error('Error al compartir:', error)
  }
}
</script>

<template>
  <div
    v-if="isOpen"
    class="modal modal--qr animate__animated animate__fadeIn"
    @click="emit('close')"
  >
    <div class="modal-content animate__animated animate__fadeInUp" @click.stop>
      <div class="modal-header">
        <button class="btn-close" @click="emit('close')"></button>
      </div>
      <div class="modal-body">
        <div class="logo">
          <img v-if="props.localFoto" :src="props.localFoto" :alt="localNombre" />
        </div>
        <img class="mb-4" src="../assets/img/menu-text.svg" alt="" />
        <!-- Placeholder QR Code -->
        <div class="qr-placeholder real-qr">
          <QrcodeVue :value="qrUrl" :size="200" />
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button class="btn btn-outline-primary rounded-pill" type="button" @click="imprimir">
          Imprimir
        </button>
        <button class="btn btn-primary rounded-pill" type="button" @click="visitarCarta">
          Ver Web
        </button>
        <button class="btn btn-outline-primary rounded-pill" type="button" @click="compartirCarta">
          {{ copySuccess ? '¡Enlace copiado!' : 'Compartir' }}
        </button>
      </div>
    </div>
  </div>
</template>
