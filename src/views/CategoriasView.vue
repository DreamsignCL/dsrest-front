<script setup>
import { computed, onMounted, ref } from 'vue'
import InnerHeader from '@/components/InnerHeader.vue'
import Signature from '@/components/Signature.vue'
import QrModal from '@/components/QrModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import CategoriaProductoModal from '@/components/categorias-producto/CategoriaProductoModal.vue'
import { apiService } from '@/services/api.service'

const local = ref(null)
const categorias = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const showQrModal = ref(false)

const showCategoriaModal = ref(false)
const categoriaEditar = ref(null)
const categoriaModalRef = ref(null)

const showConfirmModal = ref(false)
const confirmMessage = ref('')

const localId = computed(() => local.value?.id)

const obtenerLocal = () => {
  const localStr = localStorage.getItem('local')
  local.value = localStr ? JSON.parse(localStr) : null
}

const localNombre = computed(() => {
  return local.value?.nombreFantasia || local.value?.nombre || 'Mi Restaurante'
})

const obtenerCategorias = async () => {
  if (!localId.value) return
  isLoading.value = true
  try {
    const res = await apiService.get(`categorias-producto?localId=${localId.value}`)
    categorias.value = res.map((cat) => ({ ...cat, isActive: false }))
  } catch (error) {
    confirmMessage.value = error.message || 'Error al obtener categorias'
    showConfirmModal.value = true
  } finally {
    isLoading.value = false
  }
}

const categoriasFiltradas = computed(() => {
  if (!searchQuery.value.trim()) return categorias.value
  const query = searchQuery.value.toLowerCase()
  return categorias.value.filter((cat) => cat.nombre.toLowerCase().includes(query))
})

const toggleItemActive = (categoria) => {
  categorias.value.forEach((c) => {
    if (c.id !== categoria.id) c.isActive = false
  })
  categoria.isActive = !categoria.isActive
}

const toggleEstado = async (categoria) => {
  try {
    await apiService.patch(`categorias-producto/${categoria.id}/estado`, {
      localId: localId.value,
    })
    await obtenerCategorias()
  } catch (error) {
    confirmMessage.value = error.message || 'Error al cambiar el estado'
    showConfirmModal.value = true
  }
}

const abrirNuevaCategoria = () => {
  categoriaEditar.value = null
  showCategoriaModal.value = true
}

const abrirEditarCategoria = (categoria) => {
  categoriaEditar.value = categoria
  showCategoriaModal.value = true
}

const cerrarCategoriaModal = () => {
  showCategoriaModal.value = false
  categoriaEditar.value = null
}

const setModalError = (msg) => {
  const modal = categoriaModalRef.value
  if (!modal) return
  if (typeof modal.setErrorGeneral === 'function') modal.setErrorGeneral(msg)
  if (typeof modal.setGuardando === 'function') modal.setGuardando(false)
}

const guardarCategoria = async (payload) => {
  try {
    if (payload.id) {
      await apiService.put(`categorias-producto/${payload.id}`, {
        nombre: payload.nombre,
        descripcion: payload.descripcion,
        localId: localId.value,
      })
    } else {
      await apiService.post('categorias-producto', {
        nombre: payload.nombre,
        descripcion: payload.descripcion,
        localId: localId.value,
      })
    }

    cerrarCategoriaModal()
    await obtenerCategorias()
  } catch (error) {
    setModalError(error.message || 'No se pudo guardar la categoria')
  }
}

onMounted(async () => {
  obtenerLocal()
  await obtenerCategorias()
})
</script>

<template>
  <div class="page page--backoffice">
    <InnerHeader @open-qr="showQrModal = true" />

    <main>
      <div class="page-content page-content--backoffice">
        <div class="page-content__header">
          <div class="title">
            <h2 class="fw-normal">Categorias</h2>
          </div>
        </div>

        <div class="page-content__body">
          <div class="list-filters">
            <form @submit.prevent>
              <input
                id="search"
                v-model="searchQuery"
                class="form-control"
                type="search"
                placeholder="Buscar..."
              />
            </form>
          </div>

          <div class="element-list">
            <div v-if="isLoading" class="loader"></div>

            <div v-else-if="categoriasFiltradas.length === 0" class="empty-state">
              <div class="no-image"></div>
              No hay categorias disponibles
            </div>

            <button
              v-for="categoria in categoriasFiltradas"
              v-else
              :key="categoria.id"
              class="element-item"
              type="button"
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
                <p>{{ categoria.descripcion || 'Sin descripcion' }}</p>
              </div>

              <div class="element-item__options-menu">
                <button class="btn btn-option" @click.stop="abrirEditarCategoria(categoria)">
                  <img src="../assets/img/edit-icon.svg" alt="Editar" />
                </button>
                <button
                  v-if="categoria.estado"
                  class="btn btn-option"
                  @click.stop="toggleEstado(categoria)"
                >
                  <img src="../assets/img/delete-icon.svg" alt="Desactivar" />
                </button>
                <button class="btn btn-option" @click.stop="categoria.isActive = false">
                  <img src="../assets/img/close-skyblue-icon.svg" alt="Cerrar" />
                </button>
              </div>
            </button>
          </div>
        </div>

        <div class="page-content__footer">
          <div class="d-grid gap-2">
            <button class="btn btn-primary rounded-pill" @click="abrirNuevaCategoria">
              Nueva categoria
            </button>
          </div>
          <Signature />
        </div>
      </div>
    </main>

    <CategoriaProductoModal
      ref="categoriaModalRef"
      :show="showCategoriaModal"
      :categoria-editar="categoriaEditar"
      @guardar="guardarCategoria"
      @cancel="cerrarCategoriaModal"
    />

    <QrModal
      :is-open="showQrModal"
      :local-nombre="localNombre"
      :local-foto="local?.foto"
      @close="showQrModal = false"
    />

    <ConfirmModal
      :show="showConfirmModal"
      :message="confirmMessage"
      @confirm="showConfirmModal = false"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>
