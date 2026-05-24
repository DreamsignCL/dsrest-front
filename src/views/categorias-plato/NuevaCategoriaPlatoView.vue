<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api.service'
import InnerHeader from '@/components/InnerHeader.vue'

const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref('')
const local = ref(null)

const categoria = ref({
  nombre: '',
  descripcion: '',
  localId: null,
})

const obtenerInfoLocal = () => {
  try {
    const localData = JSON.parse(localStorage.getItem('local') || 'null')
    if (localData) {
      local.value = localData
      categoria.value.localId = localData.id
    } else {
      errorMessage.value = 'No se encontró información del local. Inicia sesión nuevamente.'
      router.push('/login')
    }
  } catch (error) {
    console.error('Error al obtener información del local:', error)
    router.push('/login')
  }
}

const guardarCategoria = async () => {
  if (!categoria.value.nombre) {
    errorMessage.value = 'El nombre es obligatorio'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await apiService.post('categorias-plato', categoria.value)
    router.push('/categorias-plato')
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

const volver = () => {
  router.push('/categorias-plato')
}

onMounted(() => {
  obtenerInfoLocal()
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
              <img v-else src="../../assets/img/no-logo.png" alt="Sin logo" />
            </div>
          </div>

          <div class="title">
            <h2>Nueva categoría</h2>
          </div>
        </div>

        <div class="page-content__body">
          <form @submit.prevent="guardarCategoria">
            <div class="form-container form-container--no-header">
              <div class="form-container__body">
                <div class="mb-3">
                  <label class="form-label" for="nombre">Nombre</label>
                  <input
                    id="nombre"
                    v-model="categoria.nombre"
                    class="form-control"
                    type="text"
                    placeholder="Nombre de la categoría"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label" for="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    v-model="categoria.descripcion"
                    class="form-control"
                    placeholder="Descripción de la categoría"
                    rows="3"
                  ></textarea>
                </div>

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
      </div>
    </main>
  </div>
</template>
