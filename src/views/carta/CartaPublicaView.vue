<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Signature from '@/components/Signature.vue'
import { apiService } from '@/services/api.service'

const route = useRoute()
const isLoading = ref(true)
const error = ref(null)

const local = ref(null)
const platos = ref([])
const categoriaActiva = ref('recomendados')

const mostrarModal = ref(false)
const platoSeleccionado = ref(null)

const abrirModal = (plato) => {
  platoSeleccionado.value = plato
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
}


const nombreCategoriaActiva = computed(() => {
  const cat = categorias.value.find(c => c.id === categoriaActiva.value)
  return cat ? cat.nombre : categoriaActiva.value
})

const categorias = computed(() => {
  const platosActivos = platos.value.filter(p => p.estado === true)
  const nombresUnicos = [...new Set(platosActivos.map(p => p.categoria).filter(Boolean))]
  const dinamicas = nombresUnicos.map(nombre => ({ id: nombre.toLowerCase(), nombre }))
  return [
    { id: 'recomendados', nombre: 'Recomendados' },
    ...dinamicas
  ]
})

const obtenerDatos = async () => {
  try {
    // Obtener el nombre del local desde la ruta
    const nombreLocal = route.params.nombreLocal

    // Obtener el local y sus platos directamente desde la API
    const localConPlatos = await apiService.get(`locales/carta/${nombreLocal}`)

    // Asignar el local y sus platos
    local.value = localConPlatos
    platos.value = localConPlatos.platos || []
  } catch (err) {
    error.value = 'No se pudo cargar la carta'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const filtrarPlatosPorCategoria = (categoria) => {
  // Primero filtramos solo los platos activos (estado: true)
  const platosActivos = platos.value.filter(plato => plato.estado === true);

  if (categoria === 'recomendados') {
    // Filtra entre los recomendados activos y luego agarra sólo los primeros 3
    return platosActivos
      .filter(plato => plato.recomendacion_chef)
      .slice(0, 3)
  }
  return platosActivos.filter(plato => plato.categoria.toLowerCase() === categoria)
}

const categoriasVisibles = computed(() => {
  const platosActivos = platos.value.filter(plato => plato.estado === true)
  const tieneRecomendados = platosActivos.some(plato => plato.recomendacion_chef)
  return categorias.value.filter(cat => {
    if (cat.id === 'recomendados') return tieneRecomendados
    return platosActivos.some(plato =>
      plato.categoria && plato.categoria.toLowerCase() === cat.id
    )
  })
})

onMounted(() => {
  obtenerDatos()
})
</script>

<template>
  <div class="page page--menu">
    <!-- Loading state -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando la experiencia gastronómica...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">!</div>
      <h3>Ups, algo salió mal</h3>
      <p>{{ error }}</p>
      <button class="retry-button" @click="obtenerDatos">Intentar nuevamente</button>
    </div>
      <!-- Carta content -->
    <template v-else>
        <header></header>
        <main>
          <div class="page-content page-content--menu">
            <div class="page-content__header">
              <div class="user-logo">
                <div class="user-logo__image">
                  <img v-if="local?.foto" :src="local.foto" alt="Logo del Local" />
                  <img v-else src="../../assets/img/no-logo.png" alt="Sin logo" />
                </div>
              </div>
              <!-- Categorías -->
              <div class="category-nav">
                <img src="../../assets/img/horizontal-scroll.gif" alt="" />
                <div class="category-nav-content">
                  <button v-for="categoria in categoriasVisibles" :key="categoria.id"
                    :class="['btn btn-outline-primary rounded-pill', { active: categoriaActiva === categoria.id }]"
                    @click="categoriaActiva = categoria.id">
                    <!--
                      <span class="icon">{{ categoria.icon }}</span>
                    -->
                    <span class="text">{{ categoria.nombre }}</span>
                  </button>
                </div>
              </div>
            </div>  
            <div class="page-content__body">
              <div>
                <img class="mb-3" v-if="categoriaActiva === 'recomendados'" src="../../assets/img/menu-text.svg" alt="" style="width:85%">
                <h1 v-else >{{ nombreCategoriaActiva }}</h1>
              </div>

              <!-- Platos -->
              <div v-if="categoriaActiva === 'recomendados' && filtrarPlatosPorCategoria('recomendados').length > 0"
                class="recommended-section">
                <div class="dishes-grid">
                  <div v-for="plato in filtrarPlatosPorCategoria('recomendados')" :key="plato.id" class="dish-item"
                    :style="{ backgroundImage: `url(${plato.foto})` }" @click="abrirModal(plato)">
                    <div class="dish-info">
                      <h3>{{ plato.nombre }}</h3>
                      <div class="price">
                        <span class="badge text-bg-primary">${{ plato.precio }}</span><br>
                        <small v-if="plato.precio_comparacion">${{ plato.precio_comparacion }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mensaje si no hay platos en la categoría -->
              <div v-if="filtrarPlatosPorCategoria(categoriaActiva).length === 0" class="no-dishes">
                <div class="no-dishes-content">
                  <span class="icon">🍽️</span>
                  <h3>No hay platos disponibles</h3>
                  <p>Actualmente no tenemos platos en esta categoría</p>
                </div>
              </div>

              <!-- Lista de platos por categoría -->
              <div v-else-if="categoriaActiva !== 'recomendados'" class="element-list">
                <button v-for="plato in filtrarPlatosPorCategoria(categoriaActiva)" :key="plato.id" class="element-item"
                  @click="abrirModal(plato)">
                  <div class="element-item__image"
                    v-bind:style="{ backgroundImage: plato.foto ? 'url(' + plato.foto + ')' : 'url(assets/no-image.png)' }">
                  </div>
                  <div class="element-item__text">
                    <h3>{{ plato.nombre }}</h3>
                    <p>{{ plato.descripcion }}</p>
                  </div>
                  <div class="element-item__price">
                    <div class="current-price">${{ plato.precio }}</div>
                    <div class="prev-price" v-if="plato.precio_comparacion">${{ plato.precio_comparacion }}</div>
                  </div>
                  <div></div>
                </button>
              </div>
            </div>
            <div class="page-content__footer">
              <Signature />
            </div>
          </div>
        </main>
    </template>
  </div>

  <!-- Modal para los platos -->
  <div v-if="mostrarModal" class="modal modal-dish animate__animated animate__fadeIn" @click.self="cerrarModal">
    <div 
      class="modal-content animate__animated animate__fadeInUp"
      v-bind:style="{ backgroundImage: platoSeleccionado?.foto ? 'url(' + platoSeleccionado?.foto + ')' : 'url(assets/no-image.png)' }" 
      @click.stop>
      <div class="modal-header">
        <button class="btn-close" @click.self="cerrarModal"></button>
        <div class="price">
          <small v-if="platoSeleccionado?.precio_comparacion">
            Antes: <span>${{ platoSeleccionado.precio_comparacion }}</span>
          </small>
          <div class="current">
            <span>$</span>
            <span>{{ platoSeleccionado?.precio }}</span>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h4 class="mb-0">{{ platoSeleccionado?.nombre }}</h4>
          <span class="badge text-bg-primary fs-6">{{ platoSeleccionado?.categoria }}</span>
        </div>
        <p>{{ platoSeleccionado?.descripcion }}</p>
      </div>
      <div class="modal-footer"></div>
    </div>
  </div>
</template>