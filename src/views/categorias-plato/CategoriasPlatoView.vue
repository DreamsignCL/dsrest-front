<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api.service'
import QrModal from '@/components/QrModal.vue'
import InnerHeader from '@/components/InnerHeader.vue'
import Signature from '@/components/Signature.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const router = useRouter()
const categorias = ref([])
const local = ref(null)
const isLoading = ref(true)
const showQrModal = ref(false)
const searchQuery = ref('')

const showConfirmModal = ref(false)
const confirmMessage = ref('')

const obtenerLocal = () => {
  const localStr = localStorage.getItem('local')
  if (localStr) {
    local.value = JSON.parse(localStr)
  }
}

const localId = computed(() => local.value?.id)

const obtenerCategorias = async () => {
  if (!localId.value) return
  try {
    const res = await apiService.get(`categorias-plato?localId=${localId.value}`)
    categorias.value = res.map(cat => ({ ...cat, isActive: false }))
  } catch (error) {
    console.error('Error al obtener categorías:', error)
  } finally {
    isLoading.value = false
  }
}

const categoriasFiltradas = computed(() => {
  if (!searchQuery.value.trim()) return categorias.value
  const query = searchQuery.value.toLowerCase()
  return categorias.value.filter(cat =>
    cat.nombre.toLowerCase().includes(query)
  )
})

const toggleItemActive = (categoria) => {
  categorias.value.forEach(c => {
    if (c.id !== categoria.id) c.isActive = false
  })
  categoria.isActive = !categoria.isActive
}

const toggleEstado = async (categoria) => {
  try {
    await apiService.patch(`categorias-plato/${categoria.id}/estado`, {
      localId: localId.value
    })
    await obtenerCategorias()
  } catch (error) {
    confirmMessage.value = error.message || 'Error al cambiar el estado'
    showConfirmModal.value = true
    await obtenerCategorias()
  }
}

const irANuevaCategoria = () => {
  router.push('/categorias-plato/nueva')
}

const editarCategoria = (id) => {
  router.push(`/categorias-plato/${id}/editar`)
}

const abrirQrModal = () => { showQrModal.value = true }
const cerrarQrModal = () => { showQrModal.value = false }

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

onMounted(() => {
  obtenerLocal()
  obtenerCategorias()
})
</script>

<template>
  <div class="page page--backoffice">
    <InnerHeader @open-qr="abrirQrModal" />

    <main>
      <div class="page-content page-content--backoffice">
        <div class="page-content__header">
          <div class="user-logo">
            <div class="user-logo__image">
              <img v-if="local?.foto" :src="local.foto" alt="Logo del Local" />
              <img v-else src="../../assets/img/no-logo.png" alt="Sin logo" />
            </div>
          </div>

          <div class="title">
            <h2 class="fw-normal">Categorías</h2>
          </div>
        </div>

        <div class="page-content__body">
          <div class="list-filters">
            <form>
              <input
                id="search"
                class="form-control"
                type="search"
                placeholder="Buscar..."
                v-model="searchQuery"
              />
            </form>
          </div>
          <div class="element-list">
            <div v-if="isLoading" class="loader"></div>

            <div v-else-if="categoriasFiltradas.length === 0" class="empty-state">
              <div class="no-image"></div>
              No hay categorías disponibles
            </div>

            <button
              v-else
              v-for="categoria in categoriasFiltradas"
              class="element-item"
              type="button"
              :key="categoria.id"
              :class="{ active: categoria.isActive }"
              :style="{ opacity: categoria.estado ? 1 : 0.5 }"
              @click="toggleItemActive(categoria)"
            >
              <div class="element-item__switch" @click.stop>
                <label class="switch switch--vertical">
                  <input
                    type="checkbox"
                    :checked="categoria.estado"
                    @click.prevent="toggleEstado(categoria)"
                  />
                  <span class="slider round"></span>
                </label>
              </div>

              <div class="element-item__text">
                <h3>{{ categoria.nombre }}</h3>
                <p>{{ categoria.descripcion }}</p>
              </div>

              <div class="element-item__options-menu">
                <button class="btn btn-option" @click.stop="editarCategoria(categoria.id)">
                  <img src="../../assets/img/edit-icon.svg" alt="Editar" />
                </button>
                <button v-if="categoria.estado" class="btn btn-option" @click.stop="toggleEstado(categoria)">
                  <img src="../../assets/img/delete-icon.svg" alt="Desactivar" />
                </button>
                <button class="btn btn-option" @click.stop="categoria.isActive = false">
                  <img src="../../assets/img/close-skyblue-icon.svg" alt="Cerrar" />
                </button>
              </div>
            </button>
          </div>
        </div>

        <div class="page-content__footer">
          <div class="d-grid gap-2">
            <button class="btn btn-primary rounded-pill" @click="irANuevaCategoria">
              Nueva categoría
            </button>
          </div>
          <Signature />
        </div>
      </div>
    </main>

    <QrModal :isOpen="showQrModal" :localNombre="localNombre" :localFoto="local?.foto" @close="cerrarQrModal" />

    <ConfirmModal
      :show="showConfirmModal"
      :message="confirmMessage"
      @confirm="showConfirmModal = false"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>
