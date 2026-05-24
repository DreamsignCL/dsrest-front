<template>
  <div class="page">
    <div class="content">
      <InnerHeader @open-qr="abrirQrModal" />
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
              <h2 class="fw-normal">Gestión de Zonas</h2>
            </div>

            <div class="zonas-list">
              <div v-if="isLoading" class="loading">Cargando zonas...</div>
              <div v-else-if="zonas.length === 0" class="empty-state">
                <p>No hay zonas registradas.</p>
              </div>
              <div v-else>
                <div v-for="zona in zonas" :key="zona.id" class="zona-item d-flex justify-content-between align-items-center border rounded-3 p-3 mb-3">
                  <div>
                    <div class="fw-bold">{{ zona.nombre }}</div>
                    <div class="text-muted">{{ zona.descripcion }}</div>
                  </div>
                  <div>
                    <button class="btn btn-outline-primary btn-sm me-2" @click="abrirEditarZona(zona)">Editar</button>
                    <button class="btn btn-outline-danger btn-sm" @click="confirmarEliminarZona(zona)">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="content-footer">
              <div class="d-grid gap-2">
                <button class="btn btn-primary rounded-pill" @click="abrirNuevaZona">
                  Nueva zona
                </button>
              </div>
              <Signature />
            </div>
          </div>
        </div>
        <!-- Modal QR -->
        <QrModal :isOpen="showQrModal" :localNombre="localNombre" @close="cerrarQrModal" />
        <!-- Modal para crear/editar zona -->
        <CrearZonaModal
          :show="showZonaModal"
          :zonaEditar="zonaEditar"
          @crear="guardarZona"
          @cancel="cerrarZonaModal"
        />
        <!-- Modal de confirmación para eliminar zona -->
        <ConfirmModal
          :show="showDeleteModal"
          :message="deleteMessage"
          @confirm="eliminarZona"
          @cancel="cancelarEliminarZona"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { apiService } from '@/services/api.service'
import InnerHeader from '@/components/InnerHeader.vue'
import QrModal from '@/components/QrModal.vue'
import Signature from '@/components/Signature.vue'
import CrearZonaModal from '@/components/zonas/CrearZonaModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const showQrModal = ref(false)
const showZonaModal = ref(false)
const zonaEditar = ref(null)
const local = ref(null)
const zonas = ref([])
const isLoading = ref(true)

// Para eliminar zona con confirmación
const showDeleteModal = ref(false)
const zonaAEliminar = ref(null)
const deleteMessage = ref('')

const obtenerLocal = () => {
  const localStr = localStorage.getItem('local')
  if (localStr) {
    local.value = JSON.parse(localStr)
  }
}

const obtenerZonas = async () => {
  try {
    const res = await apiService.get('zonas')
    zonas.value = res
  } catch (error) {
    console.error('Error al obtener zonas:', error)
  } finally {
    isLoading.value = false
  }
}

const abrirQrModal = () => { showQrModal.value = true }
const cerrarQrModal = () => { showQrModal.value = false }
const localNombre = computed(() => local.value?.nombre || 'Mi Restaurante')

const abrirNuevaZona = () => {
  zonaEditar.value = null
  showZonaModal.value = true
}
const abrirEditarZona = (zona) => {
  zonaEditar.value = zona
  showZonaModal.value = true
}
const cerrarZonaModal = () => {
  showZonaModal.value = false
}

const guardarZona = async (zonaData) => {
  try {
    if (zonaData.id) {
      await apiService.put(`zonas/${zonaData.id}`, zonaData)
    } else {
      await apiService.post('zonas', zonaData)
    }
    await obtenerZonas()
    showZonaModal.value = false
  } catch (error) {
    alert('Error al guardar zona')
  }
}

// NUEVO: Confirmación con modal
const confirmarEliminarZona = (zona) => {
  zonaAEliminar.value = zona
  deleteMessage.value = `¿Seguro que deseas eliminar la zona "${zona.nombre}"?`
  showDeleteModal.value = true
}
const eliminarZona = async () => {
  if (!zonaAEliminar.value) return
  try {
    await apiService.delete(`zonas/${zonaAEliminar.value.id}`)
    await obtenerZonas()
  } catch (error) {
    alert('Error al eliminar zona')
  } finally {
    showDeleteModal.value = false
    zonaAEliminar.value = null
  }
}
const cancelarEliminarZona = () => {
  showDeleteModal.value = false
  zonaAEliminar.value = null
}

onMounted(() => {
  obtenerLocal()
  obtenerZonas()
})
</script>

<style scoped>
.zona-item {
  transition: box-shadow 0.2s ease;
}
.zona-item:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}
.zonas-list {
  margin-top: 20px;
}
</style>