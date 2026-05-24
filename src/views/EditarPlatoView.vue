<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiService } from '@/services/api.service'
import InnerHeader from '@/components/InnerHeader.vue'
import Signature from '@/components/Signature.vue'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const isFetching = ref(true)
const errorMessage = ref('')
const imagenTamanio = ref(0) // Para mostrar el tamaño de la imagen
const local = ref(null)

const plato = ref({
  id: null,
  nombre: '',
  descripcion: '',
  foto: '',
  precio: '',
  precio_comparacion: '',
  categoriaPlatoId: '',
  recomendacion_chef: false,
  localId: null
})

const fotoPreview = ref(null)

// Categorías dinámicas desde la API
const categorias = ref([])

const obtenerCategorias = async () => {
  if (!local.value?.id) return
  try {
    const res = await apiService.get(`categorias-plato?localId=${local.value.id}`)
    categorias.value = res.filter(cat => cat.estado)
  } catch (error) {
    console.error('Error al obtener categorías:', error)
  }
}

const obtenerPlato = async () => {
  const id = route.params.id
  if (!id) {
    router.push('/platos')
    return
  }

  try {
    // Obtener el local desde localStorage
    const localStr = localStorage.getItem('local')
    if (localStr) {
      local.value = JSON.parse(localStr)
      // Asignar el localId al plato
      plato.value.localId = local.value.id
    }

    // Usar el servicio API centralizado para obtener el plato
    const data = await apiService.get(`platos/${id}`)

    // Asignar los datos del plato
    plato.value = {
      ...data,
      // Asegurarse de que el localId esté establecido
      localId: local.value?.id || data.localId
    }

    if (data.foto) {
      fotoPreview.value = data.foto
      // Calcular tamaño aproximado en KB
      imagenTamanio.value = Math.round(data.foto.length / 1.37 / 1024)
    }

    console.log('Plato cargado:', plato.value)
  } catch (error) {
    errorMessage.value = error.message
    console.error('Error al obtener el plato:', error)
  } finally {
    isFetching.value = false
  }
}

// Función para comprimir imágenes con mayor compresión para MariaDB
const comprimirImagen = (base64Image, maxWidth = 600, quality = 0.6) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = base64Image

    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      // Redimensionar si es necesario (más agresivo)
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      // Comprimir con calidad media (0.6) para MariaDB
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality)

      // Calcular tamaño aproximado en KB
      const approximateSizeInKB = Math.round(compressedBase64.length / 1.37 / 1024)
      imagenTamanio.value = approximateSizeInKB

      resolve(compressedBase64)
    }
  })
}

// Validar la recomendación del chef
const validarRecomendacionChef = async (e) => {
  const quiereMarcar = e.target.checked

  // Si está desmarcando, lo permito sin validar
  if (!quiereMarcar) {
    plato.value.recomendacion_chef = false
    errorMessage.value = ''
    return
  }

  try {
    // Llamada al endpoint que cuenta los recomendados
    const data = await apiService.get(`platos/recomendados/count/${local.value.id}`)
    if (data.totalRecomendados >= 3) {
      errorMessage.value = 'Ya hay 3 platos recomendados. Desmarca alguno antes de continuar.'
      // desmarco visualmente
      e.target.checked = false
      plato.value.recomendacion_chef = false
      return
    }
    // si hay menos de 3, lo marco
    errorMessage.value = ''
    plato.value.recomendacion_chef = true

  } catch (err) {
    console.error('Error validando recomendados:', err)
    errorMessage.value = 'No se pudo validar recomendación. Intenta más tarde.'
    e.target.checked = false
    plato.value.recomendacion_chef = false
  }
}

// Función para verificar si la imagen es demasiado grande
const imagenMuyGrande = computed(() => {
  return imagenTamanio.value > 500 // Advertencia si es mayor a 500KB
})

const handleFotoChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Verificar tamaño del archivo original
    if (file.size > 5000000) { // 5MB
      errorMessage.value = 'La imagen es demasiado grande. Por favor seleccione una imagen más pequeña.'
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64String = e.target.result

      // Comprimir la imagen para MariaDB
      comprimirImagen(base64String).then(imagenComprimida => {
        fotoPreview.value = imagenComprimida
        plato.value.foto = imagenComprimida
      })
    }
    reader.readAsDataURL(file)
  }
}

const guardarPlato = async () => {
  if (!plato.value.nombre || !plato.value.descripcion || !plato.value.precio || !plato.value.categoriaPlatoId) {
    errorMessage.value = 'Por favor complete los campos obligatorios'
    return
  }

  // Si la imagen es muy grande, comprimir más
  if (imagenMuyGrande.value && plato.value.foto) {
    try {
      plato.value.foto = await comprimirImagen(plato.value.foto, 400, 0.4)
      fotoPreview.value = plato.value.foto
    } catch (error) {
      console.error('Error al comprimir más la imagen:', error)
    }
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Crear una copia del objeto plato para enviar
    const platoData = { ...plato.value }

    // Si hay problemas con la imagen, podemos intentar reducir aún más
    if (platoData.foto && platoData.foto.length > 200000) {
      platoData.foto = await comprimirImagen(platoData.foto, 300, 0.3)
    }

    // Usar el servicio API centralizado
    await apiService.put(`platos/${plato.value.id}`, platoData)

    // Redirigir a la lista de platos
    router.push('/platos')
  } catch (error) {
    errorMessage.value = error.message
    console.error('Error completo:', error)
  } finally {
    isLoading.value = false
  }
}

const volver = () => {
  router.push('/platos')
}

onMounted(async () => {
  await obtenerPlato()
  await obtenerCategorias()
})
</script>

<template>
  <div class="page page--backoffice">
    <InnerHeader />
    <main>
      <div class="page-content page-content--backoffice-form">
        <div class="page-content__header">
          <div class="user-logo">
            <div class="user-logo__image">
              <img v-if="local?.foto" :src="local.foto" alt="Logo del Local" />
              <img v-else src="../../src/assets/img/no-logo.png" alt="Sin logo" />
            </div>
          </div>

          <div class="title">
            <h2>Editar {{ plato.nombre }}</h2>
          </div>
        </div>

        <div class="page-content__body">
          <!-- Loading -->
          <div v-if="isFetching" class="loader"></div>

          <!-- Formulario -->
          <form v-else @submit.prevent="guardarPlato">
            <div class="form-container form-container--no-header">
              <div class="form-container__body">
                <!-- Foto -->
                <div class="mb-3">
                  <label class="form-label">Foto</label>
                  <div class="file-upload">
                    <input type="file" accept="image/*" id="foto" @change="handleFotoChange" class="file-upload__input" />
                    <label for="foto" class="file-upload__label">
                      <div v-if="fotoPreview" class="file-upload__preview">
                        <img :src="fotoPreview" alt="Vista previa" />
                      </div>
                      <div v-else class="file-upload__placeholder">
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
                <div class="mb-3">
                  <label class="form-label" for="nombre">Nombre</label>
                  <input id="nombre" class="form-control" type="text" v-model="plato.nombre"
                    placeholder="Nombre del plato" required />
                </div>

                <!-- Descripción -->
                <div class="mb-3">
                  <label class="form-label" for="descripcion">Descripción</label>
                  <textarea id="descripcion" class="form-control" v-model="plato.descripcion"
                    placeholder="Descripción del plato" rows="3" required></textarea>
                </div>

                <!-- Precio -->
                <div class="mb-3">
                  <label class="form-label" for="precio">Precio</label>
                  <input id="precio" class="form-control" type="number" v-model="plato.precio"
                    placeholder="Precio en pesos" required />
                </div>

                <!-- Precio de comparación -->
                <div class="mb-3">
                  <label class="form-label" for="precio_comparacion">Precio de comparación</label>
                  <input id="precio_comparacion" type="number" class="form-control" v-model="plato.precio_comparacion"
                    placeholder="Precio anterior (opcional)" />
                </div>

                <!-- Categoría -->
                <div class="mb-3">
                  <label class="form-label" for="categoria">Categoría</label>
                  <select id="categoria" class="form-select" v-model="plato.categoriaPlatoId" required>
                    <option value="" disabled>Seleccione una categoría</option>
                    <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                      {{ cat.nombre }}
                    </option>
                  </select>
                </div>

                <!-- Recomendación del chef -->
                <div class="switch-group">
                  <label>Recomendación del chef</label>
                  <label class="switch">
                    <input type="checkbox" :checked="plato.recomendacion_chef" @change="validarRecomendacionChef" />
                    <span class="slider round"></span>
                  </label>
                </div>

                <!-- Error message -->
                <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
              </div>
              <div class="form-container__footer">
                <button type="button" class="btn btn-outline-primary rounded-pill" @click="volver">
                  Volver
                </button>
                
                <button type="submit" class="btn btn-primary rounded-pill" :disabled="isLoading">
                  {{ isLoading ? 'Guardando...' : 'Guardar' }}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <div class="content">
          <div class="content-header pt-5 pb-4">
            <h2 class="fw-normal">Editar {{ plato.nombre }}</h2>
          </div>
          <div class="content-body">
            
          </div>
        </div>
      </div>
    </main>
  </div>
</template>