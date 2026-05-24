<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api.service'
import QrModal from '@/components/QrModal.vue'
import InnerHeader from '@/components/InnerHeader.vue'
import Signature from '@/components/Signature.vue'

const router = useRouter()
const platos = ref([])
const usuario = ref(null)
const local = ref(null)
const isLoading = ref(true)
const showQrModal = ref(false)
const showFilterModal = ref(false)
const searchQuery = ref('')

// Filtros
const categorias = ref([])
const filtrosCategorias = ref({})
const ordenarPor = ref('')
const ordenDireccion = ref('asc')

const obtenerCategorias = async () => {
  try {
    const localStr = localStorage.getItem('local')
    const localObj = localStr ? JSON.parse(localStr) : null
    const localId = localObj?.id
    if (!localId) return
    const res = await apiService.get(`categorias-plato?localId=${localId}`)
    categorias.value = res
    // Iniciar todos los filtros activados
    const filtros = {}
    res.forEach((cat) => {
      filtros[cat.id] = true
    })
    filtros['recomendados'] = true
    filtrosCategorias.value = filtros
  } catch (error) {
    console.error('Error al obtener categorías:', error)
  }
}

const platosFiltrados = computed(() => {
  let resultado = [...platos.value]

  // Filtro de búsqueda
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    resultado = resultado.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(q))
    )
  }

  // Filtro de categorías
  const hayFiltrosActivos = Object.keys(filtrosCategorias.value).length > 0
  if (hayFiltrosActivos) {
    resultado = resultado.filter((p) => {
      // Recomendados del chef
      if (p.recomendacion_chef && filtrosCategorias.value['recomendados']) return true
      // Por categoría via FK
      if (p.categoriaPlatoId && filtrosCategorias.value[p.categoriaPlatoId]) return true
      // Por categoría string legacy
      if (p.categoria) {
        const catObj = categorias.value.find((c) => c.nombre === p.categoria)
        if (catObj && filtrosCategorias.value[catObj.id]) return true
      }
      return false
    })
  }

  // Ordenar
  if (ordenarPor.value) {
    resultado.sort((a, b) => {
      let cmp = 0
      if (ordenarPor.value === 'nombre') cmp = a.nombre.localeCompare(b.nombre)
      else if (ordenarPor.value === 'fecha') cmp = new Date(a.createdAt) - new Date(b.createdAt)
      else if (ordenarPor.value === 'id') cmp = a.id - b.id
      return ordenDireccion.value === 'desc' ? -cmp : cmp
    })
  }

  return resultado
})

const aplicarFiltros = () => {
  showFilterModal.value = false
}

const resetearFiltros = () => {
  const filtros = {}
  categorias.value.forEach((cat) => {
    filtros[cat.id] = true
  })
  filtros['recomendados'] = true
  filtrosCategorias.value = filtros
  ordenarPor.value = ''
  ordenDireccion.value = 'asc'
  showFilterModal.value = false
}

//Modal de filtros
const openFilterModal = () => {
  showFilterModal.value = true
}

const closeFilterModal = () => {
  showFilterModal.value = false
}

// Variables para el modal de confirmación de eliminación
const showDeleteModal = ref(false)
const platoToDelete = ref(null)

const obtenerPlatos = async () => {
  try {
    // Obtener el local desde localStorage
    const localStr = localStorage.getItem('local')
    const localObj = localStr ? JSON.parse(localStr) : null
    const localId = localObj?.id
    if (!localId) {
      alert('No se encontró el local')
      return
    }
    // Usar el nuevo endpoint
    const data = await apiService.get(`platos/porlocal/${localId}`)
    platos.value = data.map((plato) => ({
      ...plato,
      isActive: false,
    }))
  } catch (error) {
    console.error('Error al obtener platos:', error)
  } finally {
    isLoading.value = false
  }
}

const obtenerUsuario = async () => {
  try {
    // Obtener el usuario desde localStorage
    const userStr = localStorage.getItem('user')
    if (userStr) {
      usuario.value = JSON.parse(userStr)
    }

    // Llamar al endpoint para obtener los locales
    const localesData = await apiService.get('locales/mis-locales')
    if (localesData && localesData.length > 0) {
      // Tomar el primer local
      const primerLocal = localesData[0]
      local.value = primerLocal
      console.log('Local cargado desde API:', local.value)
    } else {
      console.warn('No se encontraron locales para el usuario.')
    }
  } catch (error) {
    console.error('Error al obtener el local desde la API:', error)
  }
}

// Resto de tus métodos permanecen igual...
const irANuevoPlato = () => {
  router.push('/platos/nuevo')
}

const editarPlato = (id) => {
  router.push(`/platos/${id}/editar`)
}

// Mostrar modal de confirmación antes de eliminar
const confirmarEliminarPlato = (plato) => {
  platoToDelete.value = plato
  showDeleteModal.value = true
}

// Función que realmente elimina el plato después de la confirmación
const eliminarPlato = async () => {
  if (!platoToDelete.value) return

  try {
    await apiService.delete(`platos/${platoToDelete.value.id}`)
    // Actualizar la lista de platos después de eliminar
    obtenerPlatos()
    // Cerrar el modal
    showDeleteModal.value = false
    platoToDelete.value = null
  } catch (error) {
    console.error('Error al eliminar plato:', error)
    alert('Error al eliminar el plato: ' + error.message)
  }
}

// Cancelar la eliminación
const cancelarEliminarPlato = () => {
  showDeleteModal.value = false
  platoToDelete.value = null
}

// Método para alternar la visibilidad de las opciones
const toggleDishActive = (plato) => {
  // Cerrar todos los demás menús primero
  platos.value.forEach((p) => {
    if (p.id !== plato.id) {
      p.isActive = false
    }
  })
  // Alternar el estado del plato actual
  plato.isActive = !plato.isActive
}

const abrirQrModal = () => {
  showQrModal.value = true
}

const cerrarQrModal = () => {
  showQrModal.value = false
}

// Nombre del local para el QR (con valor por defecto)
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

// Función para cambiar el estado del plato (activo/inactivo)
const toggleEstadoPlato = async (plato) => {
  const nuevoEstado = !plato.estado
  try {
    await apiService.put(`platos/${plato.id}`, { estado: nuevoEstado })
    plato.estado = nuevoEstado
  } catch (error) {
    alert('No se pudo cambiar el estado del plato')
    console.error(error)
  }
}

onMounted(() => {
  obtenerUsuario()
  obtenerPlatos()
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
              <img v-else src="../../src/assets/img/no-logo.png" alt="Sin logo" />
            </div>
          </div>

          <div class="title">
            <strong class="text-primary">Bienvenido(a)</strong><br />
            <h2 class="fw-normal">{{ usuario?.nombre || '[*Nombre de Usuario*]' }}</h2>
          </div>
        </div>

        <div class="page-content__body">
          <div class="list-filters">
            <button
              class="btn btn-outline-secondary btn-filter"
              type="button"
              @click="openFilterModal"
            >
              <img src="../assets/img/filter-icon.svg" alt="" />
            </button>
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

            <div v-else-if="platosFiltrados.length === 0" class="empty-state">
              <div class="no-image"></div>
              No hay platos disponibles
            </div>

            <button
              v-for="plato in platosFiltrados"
              v-else
              :key="plato.id"
              class="element-item element-item--dish"
              type="button"
              :class="{ active: plato.isActive }"
              @click="toggleDishActive(plato)"
            >
              <!--
                <pre>{{ JSON.stringify(plato, null, 2) }}</pre>
              -->
              <div class="element-item__switch" @click.stop>
                <label class="switch switch--vertical">
                  <input
                    type="checkbox"
                    :checked="plato.estado"
                    @change="toggleEstadoPlato(plato)"
                  />
                  <span class="slider round"></span>
                </label>
              </div>

              <div
                class="element-item__image"
                :style="{
                  backgroundImage: plato.foto
                    ? 'url(' + plato.foto + ')'
                    : 'url(assets/no-image.png)',
                }"
              ></div>
              <div class="element-item__text">
                <h3>{{ plato.nombre }}</h3>
                <p>{{ plato.descripcion }}</p>
              </div>
              <div class="element-item__icon">
                <img v-if="plato.recomendacion_chef" src="../assets/img/crown-icon.svg" alt="" />
              </div>
              <div class="element-item__price">
                <div class="current-price">${{ plato.precio }}</div>
                <div v-if="plato.precio_comparacion" class="prev-price">
                  ${{ plato.precio_comparacion }}
                </div>
              </div>
              <div class="element-item__options-menu">
                <button class="btn btn-option" @click="editarPlato(plato.id)">
                  <img src="../assets/img/edit-icon.svg" alt="Editar" />
                </button>
                <button class="btn btn-option" @click="confirmarEliminarPlato(plato)">
                  <img src="../assets/img/delete-icon.svg" alt="Eliminar" />
                </button>
                <button class="btn btn-option">
                  <img src="../assets/img/close-skyblue-icon.svg" alt="Cerrar" />
                </button>
              </div>
            </button>
          </div>
        </div>

        <div class="page-content__footer">
          <div class="d-grid gap-2">
            <button class="btn btn-primary rounded-pill" @click="irANuevoPlato">Nuevo plato</button>
          </div>
          <Signature />
        </div>
      </div>
    </main>

    <!-- Modal QR -->
    <QrModal
      :is-open="showQrModal"
      :local-nombre="localNombre"
      :local-foto="local?.foto"
      @close="cerrarQrModal"
    />

    <!-- Modal de filtros -->
    <div
      v-if="showFilterModal"
      class="modal animate__animated animate__fadeIn"
      @click="closeFilterModal"
    >
      <div class="modal-content animate__animated animate__fadeInUp" @click.stop>
        <div class="modal-header">
          <h4 class="modal-title">Orden y filtros</h4>
          <button class="btn-close" type="button" @click="closeFilterModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent>
            <div class="mb-3">
              <label class="form-label" for="list-order">Ordenar por:</label>
              <select id="list-order" v-model="ordenarPor" class="form-select form-select-sm">
                <option value="">Selecciona</option>
                <option value="nombre">Abecedario</option>
                <option value="fecha">Fecha</option>
                <option value="id">ID</option>
              </select>
            </div>
            <div class="d-flex justify-content-start gap-3 mb-3">
              <div class="form-check">
                <input
                  id="proprity-order1"
                  v-model="ordenDireccion"
                  class="form-check-input"
                  type="radio"
                  name="proprity-order"
                  value="asc"
                />
                <label class="form-check-label" for="proprity-order1"> Ascendente </label>
              </div>
              <div class="form-check">
                <input
                  id="proprity-order2"
                  v-model="ordenDireccion"
                  class="form-check-input"
                  type="radio"
                  name="proprity-order"
                  value="desc"
                />
                <label class="form-check-label" for="proprity-order2"> Descendente </label>
              </div>
            </div>
            <div class="text-start mb-3">
              Filtrar por:
              <div v-for="cat in categorias" :key="cat.id" class="form-check form-switch mb-1">
                <input
                  :id="'show-cat-' + cat.id"
                  v-model="filtrosCategorias[cat.id]"
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                />
                <label class="form-check-label" :for="'show-cat-' + cat.id">{{ cat.nombre }}</label>
              </div>
              <div class="form-check form-switch">
                <input
                  id="show-recomendados"
                  v-model="filtrosCategorias['recomendados']"
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                />
                <label
class="form-check-label" for="show-recomendados"
                  >Recomendados del chef</label
                >
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer justify-content-center">
          <button
            class="btn btn-outline-primary rounded-pill"
            type="button"
            @click="resetearFiltros"
          >
            Limpiar
          </button>
          <button class="btn btn-primary rounded-pill" type="button" @click="aplicarFiltros">
            Filtrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar plato -->
    <div
      v-if="showDeleteModal"
      class="modal animate__animated animate__fadeIn"
      @click="cancelarEliminarPlato"
    >
      <div class="modal-content animate__animated animate__fadeInUp" @click.stop>
        <div class="modal-header">
          <h4 class="modal-title">Eliminar plato</h4>
          <button class="btn-close" @click="cancelarEliminarPlato"></button>
        </div>
        <div class="modal-body">
          <p>
            <strong class="text-danger">La siguiente acción no se puede deshacer.</strong><br />
            ¿Estás seguro que deseas eliminar el plato <strong>{{ platoToDelete?.nombre }}</strong
            >?
          </p>
        </div>
        <div class="modal-footer justify-content-center">
          <button
            class="btn btn-outline-primary rounded-pill"
            type="button"
            @click="cancelarEliminarPlato"
          >
            Cancelar
          </button>
          <button class="btn btn-danger rounded-pill" type="button" @click="eliminarPlato">
            Si, eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
