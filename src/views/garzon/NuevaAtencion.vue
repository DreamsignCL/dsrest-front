<template>
    <div class="page page--backoffice">
        <InnerHeader @open-qr="abrirQrModal" />

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
                        <h2>Nuevo pedido</h2>
                    </div>
                </div>

                <div class="page-content__body">
                    <!-- Paso 1 -->
                    <div class="form-container form-container" v-if="pasoActual === 1">
                        <div class="form-container__header">
                            <div class="progress-steps">
                                <div class="step active">1</div>
                                <div class="step">2</div>
                            </div>
                        </div>
                        
                        <div class="form-container__body pt-3">
                            <div class="mb-3" v-if="requiereMesa">
                                <label class="form-label" for="ubication">Selecciona la ubicación de la mesa</label>
                                <select id="ubication" class="form-select" v-model="ubicacionSeleccionada">
                                    <option disabled value="">Selecciona</option>
                                    <option v-for="ubicacion in ubicaciones" :key="ubicacion" :value="ubicacion">
                                        {{ ubicacion }}
                                    </option>
                                </select>
                            </div>
        
                            <div class="mb-3" v-if="requiereMesa">
                                <label class="form-label" for="table-number">Selecciona el número de la mesa</label>
                                <select id="table-number" class="form-select" v-model="mesaSeleccionada" :disabled="!ubicacionSeleccionada">
                                    <option disabled value="">Selecciona</option>
                                    <option v-for="mesa in mesasFiltradas" :key="mesa.id" :value="mesa.id">
                                        {{ mesa.nombre }}
                                    </option>
                                </select>
                            </div>

                            <div class="mb-3" v-if="requiereNombreCliente">
                                <label class="form-label" for="nombre-cliente">Nombre del cliente</label>
                                <input
                                    id="nombre-cliente"
                                    type="text"
                                    class="form-control"
                                    v-model="nombreCliente"
                                    :placeholder="empresaConfig.usaNombreCliente === 'si' ? 'Requerido' : 'Opcional'" />
                            </div>
                        </div>

                        <div class="form-container__footer">
                            <button class="btn btn-outline-primary rounded-pill" type="button" @click="volver">Volver</button>
                            <button class="btn btn-outline-secondary rounded-pill" type="button" disabled>&lt; Atrás</button>
                            <button 
                                class="btn btn-primary rounded-pill" 
                                type="button" 
                                @click="siguiente" :disabled="requiereMesa && (!ubicacionSeleccionada || !mesaSeleccionada)">
                                Siguiente &gt;
                            </button>
                        </div>
                    </div>
    
                    <!-- Paso 2 -->
                    <div class="form-container form-container" v-else-if="pasoActual === 2">
                        <div class="form-container__header">
                            <div class="progress-steps">
                                <div class="step">1</div>
                                <div class="step active">2</div>
                            </div>
                        </div>

                        <div class="form-container__body pt-3">
                            <!-- Botón para abrir el modal -->
                            <div class="d-grid gap-2">
                                <button class="btn btn-add-dishes" type="button" @click="abrirModalPlatos">
                                    <span class="text">Agregar plato al pedido</span>
                                    <span class="icon">
                                        <img src="../../assets/img/plus-icon.svg" alt="">
                                    </span>
                                </button>
                            </div>

                            <!-- Lista de platos seleccionados -->
                            <div class="element-list pt-3">
                                <div v-for="(plato, index) in platosSeleccionados" :key="plato.menu_item_id" class="element-item element-item--add-dishes">
                                    <!-- Imagen -->
                                    <div class="element-item__image" v-bind:style="{ backgroundImage: plato.foto ? 'url(' + plato.foto + ')' : 'url(assets/no-image.png)' }"></div>

                                    <!-- Titulo y Precios -->
                                    <div class="element-item__text">
                                        <strong>{{ plato.nombre }}</strong><br>
                                        <div class="prices">
                                            <span>${{ plato.precioUnitario.toLocaleString() }}</span>
                                            <span v-if="plato.precioComparacion">
                                                ${{ plato.precioComparacion.toLocaleString() }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Favorito del chef -->
                                    <div v-if="plato.recomendacion_chef" class="element-item__text">
                                        <img src="../../assets/img/crown-icon.svg" alt="">
                                    </div>
    
                                    <!-- Cantidad -->
                                    <input 
                                        type="number" 
                                        min="1" 
                                        v-model.number="plato.quantity" 
                                        @input="actualizarCantidad(plato)" 
                                        style="width: 55px;" />
    
                                    <!-- Botón eliminar -->
                                    <button class="btn btn-sm btn-danger rounded-circle ms-2" type="button" @click="eliminarPlato(index)">&times;</button>
                                </div>
                            </div>
                        </div>

                        <div class="form-container__footer footer-totals">
                            <!-- Totales -->
                            <div class="totals">
                                <div class="totals__item">
                                    <strong>TOTAL</strong><br>
                                    ${{ subtotal.toLocaleString() }}
                                </div>
                            </div>

                            <div class="buttons">
                                <button class="btn btn-outline-primary rounded-pill" @click="volver">Volver</button>
                                <button v-if="requiereMesa || requiereNombreCliente" class="btn btn-outline-secondary rounded-pill" @click="anterior">&lt; Atrás</button>
                                <button class="btn btn-primary rounded-pill" @click="guardarPedido" :disabled="platosSeleccionados.length === 0">
                                    Guardar
                                </button>
                            </div>
                        </div>
    
                        <!-- Modal de platos -->
                        <div v-if="showPlatosModal" class="modal modal--add-dishes animate__animated animate__fadeIn">
                            <div class="modal-content animate__animated animate__fadeInUp">
                                <div class="modal-header">
                                    <h4 class="modal-title">Agregar plato al pedido</h4>
                                    <button class="btn-close" type="button" @click="cerrarModalPlatos"></button>
                                </div>
                                
                                <!-- Parte fija superior -->
                                <div class="modal-filters">
                                    <span class="d-block mb-1">Desliza para ver más opciones</span>
                                    <div class="select-dishes mb-3">
                                        <button
                                            v-for="cat in categoriasVisibles"
                                            :key="cat.id"
                                            class="btn btn-outline-primary btn-sm rounded-pill"
                                            :class="{ active: filtroCategoria === cat.id }"
                                            type="button"
                                            @click="filtroCategoria = cat.id">
                                            {{ cat.nombre }}
                                        </button>
                                    </div>
                                    <input class="form-control mb-2" type="search" placeholder="Buscar..." v-model="filtroTexto" />
                                </div>

                                <!-- Lista de platos scrolleable -->
                                <div class="modal-dishes-list">
                                    <div class="element-list">
                                        <div v-for="plato in platosFiltrados" :key="plato.id" class="element-item element-item--add-dishes">
                                            <div class="element-item__image" v-bind:style="{ backgroundImage: plato.foto ? 'url(' + plato.foto + ')' : 'url(assets/no-image.png)' }"></div>
                                            <div class="element-item__text">
                                                <strong>{{ plato.nombre }}</strong><br>
                                                <div class="prices">
                                                    <span>${{ plato.precio.toLocaleString() }}</span>
                                                    <span v-if="plato.precioComparacion">
                                                        ${{ plato.precioComparacion.toLocaleString() }}
                                                    </span>
                                                </div>
                                            </div>
                                            <button class="btn btn-primary btn-sm" type="button" @click="agregarPlatoTemporal(plato)">+</button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Parte fija inferior -->
                                <div class="modal-selection">
                                    <h6>Platos seleccionados:</h6>
                                    <div v-if="seleccionTemporal.length" class="added-list">
                                        <ul>
                                            <li v-for="plato in seleccionTemporal" :key="plato.menu_item_id">
                                                <div>
                                                    <strong>{{ plato.nombre }}</strong> x{{ plato.quantity }}
                                                </div>
                                                <button class="btn btn-danger btn-sm" type="button" @click="quitarPlatoTemporal(plato)">&times;</button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div v-else>-No se han agregado platos-</div>
                                </div>
                                
                                <div class="modal-footer d-flex justify-content-center">
                                    <button class="btn btn-outline-primary rounded-pill" type="button" @click="cerrarModalPlatos">Cancelar</button>
                                    <button class="btn btn-primary rounded-pill" :disabled="!seleccionTemporal.length" type="button" @click="agregarSeleccionAlPedido">Agregar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal QR -->
                <QrModal :isOpen="showQrModal" :localNombre="localNombre" @close="cerrarQrModal" />
                <!-- Modal de confirmación -->
                <ConfirmModal :show="showConfirmModal" :message="confirmMessage" @confirm="onConfirm"
                    @cancel="onCancel" />
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api.service'
import InnerHeader from '@/components/InnerHeader.vue'
import QrModal from '@/components/QrModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const router = useRouter()
const showQrModal = ref(false)
const local = ref(null)
const empresaConfig = ref({ usaMesas: 'si', usaNombreCliente: 'no' })
const nombreCliente = ref('')
const isLoading = ref(true)
const pasoActual = ref(1)
const ubicacionSeleccionada = ref('')
const mesaSeleccionada = ref('')
const zonas = ref([])
const mesas = ref([])
const platos = ref([])
const platoSeleccionado = ref('')
const cantidadSeleccionada = ref('')
const platosSeleccionados = ref([])
const showPlatosModal = ref(false)
const categorias = ref([
    { id: 'recomendados', nombre: 'Recomendados' }
])
const filtroCategoria = ref('recomendados')

const obtenerCategorias = async () => {
    try {
        const localStr = localStorage.getItem('local')
        const localObj = localStr ? JSON.parse(localStr) : null
        const localId = localObj?.id
        if (!localId) return
        const res = await apiService.get(`categorias-plato?localId=${localId}`)
        const activas = res.filter(cat => cat.estado)
        categorias.value = [
            { id: 'recomendados', nombre: 'Recomendados' },
            ...activas.map(cat => ({ id: cat.nombre.toLowerCase(), nombre: cat.nombre }))
        ]
    } catch (error) {
        console.error('Error al obtener categorías:', error)
    }
}
const filtroTexto = ref('')

const mesasFiltradas = computed(() => mesas.value)

const requiereMesa = computed(() => empresaConfig.value.usaMesas !== 'no')
const requiereNombreCliente = computed(() => empresaConfig.value.usaNombreCliente !== 'no')
const siguiente = () => {
    if (requiereMesa.value && (!ubicacionSeleccionada.value || !mesaSeleccionada.value)) {
        mostrarConfirmacion('Debes seleccionar una ubicación y una mesa antes de continuar.')
        return
    }
    if (empresaConfig.value.usaNombreCliente === 'si' && !nombreCliente.value.trim()) {
        mostrarConfirmacion('El nombre del cliente es obligatorio.')
        return
    }
    pasoActual.value = 2
}

const subtotal = computed(() => {
    return platosSeleccionados.value.reduce((total, plato) => total + plato.precioTotal, 0)
})

const anterior = () => pasoActual.value = 1

const volver = () => router.back()

const obtenerNombrePlato = (id) => {
    const plato = platos.value.find(p => p.id === id)
    return plato ? plato.nombre : 'Plato desconocido'
}

const eliminarPlato = (index) => platosSeleccionados.value.splice(index, 1)

const actualizarCantidad = (plato) => {
    if (plato.quantity < 1) {
        plato.quantity = 1
    }
    plato.precioTotal = plato.precioUnitario * plato.quantity
}

const agregarPlato = () => {
    const cantidad = parseInt(cantidadSeleccionada.value)

    if (!platoSeleccionado.value || isNaN(cantidad) || cantidad < 1) {
        mostrarConfirmacion('Selecciona un plato y una cantidad válida')
        return
    }

    const existente = platosSeleccionados.value.find(p => p.menu_item_id === platoSeleccionado.value.id)

    if (existente) {
        existente.quantity += cantidad
        existente.precioTotal = existente.precioUnitario * existente.quantity
    } else {
        platosSeleccionados.value.push({
            menu_item_id: platoSeleccionado.value.id,
            quantity: cantidad,
            nombre: platoSeleccionado.value.nombre,
            precioUnitario: platoSeleccionado.value.precio,
            precioTotal: platoSeleccionado.value.precio * cantidad,
            mostrarCantidad: false
        })
    }

    platoSeleccionado.value = ''
    cantidadSeleccionada.value = ''
}

const agregarPlatoDesdeModal = (plato) => {
    platosSeleccionados.value.push({
        menu_item_id: plato.id,
        quantity: 1,
        nombre: plato.nombre,
        precioUnitario: plato.precio,
        precioTotal: plato.precio,
        mostrarCantidad: false
    })
}

const seleccionTemporal = ref([])

const abrirModalPlatos = () => {
    seleccionTemporal.value = []
    showPlatosModal.value = true
}

const cerrarModalPlatos = () => {
    seleccionTemporal.value = []
    showPlatosModal.value = false
}

const agregarPlatoTemporal = (plato) => {
    const existente = seleccionTemporal.value.find(p => p.menu_item_id === plato.id)
    if (existente) {
        existente.quantity += 1
        existente.precioTotal = existente.precioUnitario * existente.quantity
    } else {
        seleccionTemporal.value.push({
            menu_item_id: plato.id,
            quantity: 1,
            nombre: plato.nombre,
            precioUnitario: plato.precio,
            precioComparacion: plato.precio_comparacion,
            foto: plato.foto,
            recomendacion_chef: plato.recomendacion_chef,
            precioTotal: plato.precio,
            mostrarCantidad: false
        })
    }
}

const quitarPlatoTemporal = (plato) => {
    const idx = seleccionTemporal.value.findIndex(p => p.menu_item_id === plato.menu_item_id)
    if (idx !== -1) seleccionTemporal.value.splice(idx, 1)
}

const agregarSeleccionAlPedido = () => {
    seleccionTemporal.value.forEach(platoTemp => {
        const existente = platosSeleccionados.value.find(p => p.menu_item_id === platoTemp.menu_item_id)
        if (existente) {
            existente.quantity += platoTemp.quantity
            existente.precioTotal = existente.precioUnitario * existente.quantity
        } else {
            platosSeleccionados.value.push({
                ...platoTemp,
                foto: platoTemp.foto,
                recomendacion_chef: platoTemp.recomendacion_chef,
                precioComparacion: platoTemp.precio_comparacion // o platoTemp.precioComparacion
            })
        }
    })
    cerrarModalPlatos()
}

const filtrarPlatosPorCategoria = (categoria) => {
    if (categoria === 'recomendados') {
        return platos.value.filter(plato => plato.recomendacion_chef).slice(0, 3)
    }
    return platos.value.filter(
        plato => plato.categoria && plato.categoria.toLowerCase() === categoria
    )
}

const platosFiltrados = computed(() => {
    let lista = filtrarPlatosPorCategoria(filtroCategoria.value)
    if (filtroTexto.value) {
        lista = lista.filter(p =>
            p.nombre.toLowerCase().includes(filtroTexto.value.toLowerCase())
        )
    }
    return lista
})

const categoriasVisibles = computed(() => {
    return categorias.value.filter(cat => {
        if (cat.id === 'recomendados') {
            // Solo si hay recomendados
            return platos.value.some(plato => plato.recomendacion_chef)
        }
        // Para las demás categorías, verifica si hay platos en esa categoría
        return platos.value.some(plato =>
            plato.categoria &&
            plato.categoria.toLowerCase() === cat.id
        )
    })
})

const guardarPedido = async () => {

    if (requiereMesa.value && (!ubicacionSeleccionada.value || !mesaSeleccionada.value)) {
        mostrarConfirmacion('Faltan datos para crear el pedido')
        return
    }
    if (platosSeleccionados.value.length === 0) {
        mostrarConfirmacion('Debes agregar al menos un plato')
        return
    }

    try {
        const payload = {
            order_type: requiereMesa.value ? 'en mesa' : 'take away',
            customer_count: 2,
            platos: platosSeleccionados.value,
            local_id: local.value?.id
        }
        if (requiereMesa.value && mesaSeleccionada.value) {
            payload.mesa_id = mesaSeleccionada.value
        }
        if (nombreCliente.value.trim()) {
            payload.nombre_cliente = nombreCliente.value.trim()
        }

        const res = await apiService.post('pedidos', payload)
        console.log('Pedido creado exitosamente', res)
        mostrarConfirmacion('Pedido creado con éxito', () => router.push('/garzon'))
    } catch (error) {
        console.error('Error al crear el pedido:', error)
        mostrarConfirmacion('Hubo un error al crear el pedido')
    }
}

const obtenerEmpresaConfig = async () => {
    try {
        const localId = local.value?.id
        if (!localId) return
        const config = await apiService.get(`empresas/por-local/${localId}`)
        if (config) {
            empresaConfig.value = {
                usaMesas: config.usaMesas || 'si',
                usaNombreCliente: config.usaNombreCliente || 'no'
            }
        }
    } catch (error) {
        console.error('Error al obtener configuración de empresa:', error)
    }
}

const obtenerPlatos = async () => {
    try {
        const localStr = localStorage.getItem('local')
        const localObj = localStr ? JSON.parse(localStr) : null
        const localId = localObj?.id
        if (!localId) {
            mostrarConfirmacion('No se encontró el local')
            return
        }
        const data = await apiService.get(`platos/porlocal/${localId}`)
        platos.value = data.map(plato => ({
            ...plato,
            isActive: false
        }))
    } catch (error) {
        console.error('Error al obtener platos:', error)
    } finally {
        isLoading.value = false
    }
}

const obtenerLocal = () => {
    const localStr = localStorage.getItem('local')
    if (localStr) {
        local.value = JSON.parse(localStr)
    }
}

const obtenerZonas = async () => {
    try {
        const response = await apiService.get('zonas')
        zonas.value = response
    } catch (error) {
        console.error('Error al obtener zonas:', error)
    }
}

const ubicaciones = computed(() => zonas.value.map(z => z.nombre))

watch(ubicacionSeleccionada, async (nuevaZona) => {
    mesaSeleccionada.value = ''

    if (!nuevaZona) return

    const zona = zonas.value.find(z => z.nombre === nuevaZona)
    const localId = local.value?.id

    if (!zona || !localId) return

    try {
        const res = await apiService.get(`mesas/local/${localId}/zona/${zona.id}`)
        mesas.value = res
    } catch (error) {
        console.error('Error al obtener mesas por zona:', error)
    }
})

const abrirQrModal = () => {
    showQrModal.value = true
}

const cerrarQrModal = () => {
    showQrModal.value = false
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

const showConfirmModal = ref(false)
const confirmMessage = ref('')
let confirmAction = null

function mostrarConfirmacion(mensaje, accion) {
    confirmMessage.value = mensaje
    confirmAction = accion
    showConfirmModal.value = true
}
function onConfirm() {
    showConfirmModal.value = false
    if (confirmAction) confirmAction()
}
function onCancel() {
    showConfirmModal.value = false
}

onMounted(async () => {
    obtenerLocal()
    await obtenerEmpresaConfig()
    if (!requiereMesa.value && !requiereNombreCliente.value) {
        pasoActual.value = 2
    }
    obtenerZonas()
    await obtenerCategorias()
    obtenerPlatos()
})
</script>