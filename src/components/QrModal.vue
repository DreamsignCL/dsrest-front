<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue'


const props = defineProps({
  localNombre: {
    type: String,
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  },
  localFoto: {
    type: String,
    required: false // Puedes poner `true` si siempre vendrá
  }
})

const emit = defineEmits(['close'])

const router = useRouter()
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
  const url = qrUrl.value;

  try {
    if (navigator.share) {
      // Usar Web Share API si está disponible
      await navigator.share({
        title: `Carta de ${props.localNombre}`,
        text: `¡Visita nuestra carta digital!`,
        url: url
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

const imprimirQr = () => {
  const url = qrUrl.value.replace(/"/g, '&quot;');
  const nombre = props.localNombre.replace(/"/g, '&quot;');
  const printWindow = window.open('', '', 'width=800,height=1100');
  printWindow.document.write(`
    <html>
      <head>
        <title>Imprimir QR</title>
        <style>
          @media print {
            body { margin: 0; }
            .modal-print {
              box-shadow: none !important;
              margin: 0 !important;
              border-radius: 0 !important;
              width: 100vw !important;
              max-width: 100vw !important;
              min-height: 100vh !important;
              padding: 0 !important;
            }
          }
          body {
            background: #f8f9fa;
            font-family: sans-serif;
            margin: 0;
            padding: 0;
          }
          .modal-print {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 2px 16px rgba(0,0,0,0.15);
            width: 100vw;
            max-width: 100vw;
            min-height: 100vh;
            margin: 0;
            padding-top: 48px;
            text-align: center;
            border-top: 12px solid #0dcaf0; /* Línea celeste más gruesa */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .modal-title {
            font-size: 2.5rem;
            margin-bottom: 32px;
            font-weight: bold;
          }
          .qr {
            margin: 0 auto 32px auto;
            display: flex;
            justify-content: center;
          }
          .url {
            font-size: 1.2rem;
            margin-top: 32px;
            word-break: break-all;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="modal-print">
          <div class="modal-title">Carta de ${nombre}</div>
          <div id="qr" class="qr"></div>
          <div class="url">${url}</div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"><\/script>
        <script>
          window.onload = function() {
            new QRCode(document.getElementById('qr'), {
              text: "${url}",
              width: 400,
              height: 400
            });
            setTimeout(function() { window.print(); }, 400);
          }
        <\/script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
</script>

<template>
  <div v-if="isOpen" class="modal modal--qr animate__animated animate__fadeIn" @click="emit('close')">
    <div class="modal-content animate__animated animate__fadeInUp" @click.stop>
      <div class="modal-header">
        <button class="btn-close" @click="emit('close')"></button>
      </div>
      <div class="modal-body">
        <div class="logo">
          <img :src="props.localFoto" :alt="localNombre" v-if="props.localFoto">
        </div>
        <img class="mb-4" src="../assets/img/menu-text.svg" alt="">
        <!-- Placeholder QR Code -->
        <div class="qr-placeholder real-qr">
          <qrcode-vue :value="qrUrl" :size="200" />
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