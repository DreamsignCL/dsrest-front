<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api.service'
import QrModal from '@/components/QrModal.vue'

const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref('')
const showQrModal = ref(false)
const local = ref(null)

const plato = ref({
  nombre: '',
  descripcion: '',
  foto: '',
  precio: '',
  precio_comparacion: '',
  categoria: '',
  recomendacion_chef: false,
  localId: null
})

const fotoPreview = ref(null)

const categorias = [
  'Entrada',
  'Plato de fondo',
  'Postre',
  'Bebida'
]

// Nueva referencia para almacenar la lista de platos
const platos = ref([])

// Obtener información del primer local del usuario
const obtenerInfoLocal = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    // Usa el local guardado en localStorage
    const localGuardado = JSON.parse(localStorage.getItem('local'))
    if (localGuardado && localGuardado.id) {
      local.value = localGuardado
      plato.value.localId = localGuardado.id
      await obtenerPlatosDelPrimerLocal()
    } else {
      // Solo si no hay local guardado, pide la lista y toma el primero
      const localesData = await apiService.get('locales/mis-locales')
      if (localesData && localesData.length > 0) {
        local.value = localesData[0]
        plato.value.localId = local.value.id
        localStorage.setItem('local', JSON.stringify(local.value))
        await obtenerPlatosDelPrimerLocal()
      } else {
        errorMessage.value = 'No tienes locales registrados. Por favor crea un local primero.'
        router.push('/onboarding/local')
      }
    }
  } catch (error) {
    console.error('Error al obtener información del local:', error)
    errorMessage.value = 'Error al cargar la información del local'
    router.push('/login')
  } finally {
    isLoading.value = false
  }
}

const obtenerPlatosDelPrimerLocal = async () => {
  if (!local.value?.id) return
  try {
    isLoading.value = true
    const data = await apiService.get(`platos/porlocal/${local.value.id}`)
    platos.value = data
  } catch (error) {
    console.error('Error al obtener platos:', error)
    errorMessage.value = 'Error al cargar los platos'
  } finally {
    isLoading.value = false
  }
}

const localNombre = computed(() => {
  const localStr = localStorage.getItem('local')
  if (!localStr) return 'Mi Restaurante'
  try {
    const localObj = JSON.parse(localStr)
    return localObj.nombreFantasia || localObj.nombre || 'Mi Restaurante'
  } catch {
    return 'Mi Restaurante'
  }
})

// Función para comprimir imágenes
const comprimirImagen = (base64Image, maxWidth = 600, quality = 0.6) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = base64Image

    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedBase64)
    }
  })
}

const handleFotoChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5000000) { // 5MB
      errorMessage.value = 'La imagen es demasiado grande. Por favor seleccione una imagen más pequeña.'
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64String = e.target.result
      comprimirImagen(base64String).then(imagenComprimida => {
        fotoPreview.value = imagenComprimida
        plato.value.foto = imagenComprimida
      })
    }
    reader.readAsDataURL(file)
  }
}

const guardarPlato = async () => {
  if (!plato.value.nombre || !plato.value.descripcion || !plato.value.precio || !plato.value.categoria) {
    errorMessage.value = 'Por favor complete todos los campos obligatorios'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Usar el servicio API centralizado
    await apiService.post('platos', plato.value)

    // Redirigir a la página de éxito
    router.push('/onboarding/exito')
  } catch (error) {
    errorMessage.value = error.message || 'Error al guardar el plato'
  } finally {
    isLoading.value = false
  }
}

const irAAdmin = () => {
  router.push('/platos')
}

const cargarOtroPlato = () => {
  router.push('/platos/nuevo')
}

onMounted(() => {
  obtenerInfoLocal()
})
</script>

<template>
  <div class="first-dish-page">
    <div class="content">
      <header>
        <!-- Puedes agregar contenido al header si es necesario -->
      </header>
      <main>
        <div class="page-content">
          <!-- Logo -->
          <div class="user-logo">
            <div class="logo">
              <img v-if="local?.foto" :src="local.foto" alt="Logo del Local" />
              <img v-else src="../../assets/img/no-logo.png" alt="Sin logo" />
            </div>
          </div>

          <div class="content">
            <div class="content-header pt-5 pb-4">
              <h2 class="fw-normal">¡Crea tu primer plato!</h2>
              <p v-if="local?.nombre" class="text-muted">Para: {{ local.nombreFantasia || local.nombre }}</p>
            </div>

            <div v-if="errorMessage" class="alert alert-danger">
              {{ errorMessage }}
            </div>

            <div v-if="isLoading" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
            </div>

            <div v-else class="content-body">
              <form @submit.prevent="guardarPlato" class="form">
                <!-- Foto -->
                <div class="mb-4">
                  <label class="form-label">Foto</label>
                  <div class="file-upload">
                    <input type="file" accept="image/*" id="foto" @change="handleFotoChange"
                      class="file-upload-input" />
                    <label for="foto" class="file-upload-label">
                      <div v-if="fotoPreview" class="file-upload-preview">
                        <img :src="fotoPreview" alt="Vista previa" />
                      </div>
                      <div v-else class="file-upload-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 5v14"></path>
                          <path d="M5 12h14"></path>
                        </svg>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Nombre -->
                <div class="mb-4">
                  <label for="nombre" class="form-label">Nombre</label>
                  <input type="text" id="nombre" v-model="plato.nombre" placeholder="Nombre del plato"
                    class="form-control" required />
                </div>

                <!-- Descripción -->
                <div class="mb-4">
                  <label for="descripcion" class="form-label">Descripción</label>
                  <textarea id="descripcion" v-model="plato.descripcion" placeholder="Descripción del plato"
                    class="form-control" rows="3" required></textarea>
                </div>

                <!-- Precio -->
                <div class="mb-4">
                  <label for="precio" class="form-label">Precio</label>
                  <input type="number" id="precio" v-model="plato.precio" placeholder="Precio en pesos"
                    class="form-control" required />
                </div>

                <!-- Precio de comparación -->
                <div class="mb-4">
                  <label for="precio_comparacion" class="form-label">Precio de comparación</label>
                  <input type="number" id="precio_comparacion" v-model="plato.precio_comparacion"
                    placeholder="Precio anterior (opcional)" class="form-control" />
                </div>

                <!-- Categoría -->
                <div class="mb-4">
                  <label for="categoria" class="form-label">Categoría</label>
                  <select id="categoria" v-model="plato.categoria" class="form-select" required>
                    <option value="" disabled selected>Selecciona categoría</option>
                    <option v-for="categoria in categorias" :key="categoria" :value="categoria.toLowerCase()">
                      {{ categoria }}
                    </option>
                  </select>
                </div>

                <!-- Recomendación del chef -->
                <div class="switch-group">
                  <label class="form-label">Recomendación del chef</label>
                  <label class="switch">
                    <input type="checkbox" v-model="plato.recomendacion_chef">
                    <span class="slider round"></span>
                  </label>
                </div>

                <div class="content-footer">
                  <div class="d-grid gap-2">
                    <!-- Submit button -->
                    <button type="submit" class="btn btn-primary rounded-pill" :disabled="isLoading">
                      {{ isLoading ? 'Guardando...' : 'Cargar' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

  <!-- Modal QR -->
  <QrModal :isOpen="showQrModal" :localNombre="localNombre" @close="irAAdmin" />
</template>