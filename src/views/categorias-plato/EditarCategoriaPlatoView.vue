<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiService } from '@/services/api.service'
import InnerHeader from '@/components/InnerHeader.vue'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const isFetching = ref(true)
const errorMessage = ref('')
const local = ref(null)

const categoria = ref({
  id: null,
  nombre: '',
  descripcion: '',
  localId: null,
})

const obtenerCategoria = async () => {
  const id = route.params.id
  if (!id) {
    router.push('/categorias-plato')
    return
  }

  try {
    const localStr = localStorage.getItem('local')
    if (localStr) {
      local.value = JSON.parse(localStr)
      categoria.value.localId = local.value.id
    }

    const data = await apiService.get(`categorias-plato/${id}?localId=${local.value?.id}`)
    categoria.value = {
      ...data,
      localId: local.value?.id || data.localId,
    }
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isFetching.value = false
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
    await apiService.put(`categorias-plato/${categoria.value.id}`, {
      nombre: categoria.value.nombre,
      descripcion: categoria.value.descripcion,
      localId: categoria.value.localId,
    })
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
  obtenerCategoria()
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
            <h2>Editar categoría</h2>
          </div>
        </div>

        <div class="page-content__body">
          <div v-if="isFetching" class="loader"></div>

          <form v-else @submit.prevent="guardarCategoria">
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
