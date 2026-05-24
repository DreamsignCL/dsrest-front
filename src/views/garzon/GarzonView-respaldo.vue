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
                        <strong class="text-primary">Bienvenido(a)</strong><br>
                        <h2 class="fw-normal">{{ usuario?.nombre || '[*Nombre de Usuario*]' }}</h2>
                    </div>
                </div>

                <div v-if="!esAdmin" class="quick-status-tabs" role="tablist" aria-label="Filtros rápidos por estado">
                    <button
                        v-for="tab in pestanasEstadoRapido"
                        :key="tab.key"
                        type="button"
                        class="quick-status-tabs__tab"
                        :class="{ 'is-active': pestanaEstadoRapido === tab.key }"
                        @click="seleccionarPestanaEstado(tab.key)"
                    >
                        {{ tab.label }}
                    </button>
                </div>

                <div class="page-content__body">
                    <div class="list-filters">
                        <button class="btn btn-outline-secondary btn-filter" type="button" @click="abrirModalFiltros">
                            <img src="../../assets/img/filter-icon.svg" alt="">
                        </button>
                        <form v-if="esAdmin" class="admin-list-filters-form">
                            <div class="admin-date-input">
                                <input id="date-filter" class="form-control" type="date" v-model="fechaFiltro" aria-label="Filtrar por fecha">
                                <span class="admin-date-input__label">Fecha</span>
                            </div>
                            <input id="search" class="form-control" type="search" placeholder="Buscar..." v-model="filtroBusqueda">
                        </form>
                        <form v-else class="garzon-list-filters-form">
                            <input id="search" class="form-control" type="search" placeholder="Buscar..." v-model="filtroBusqueda">
                        </form>
                    </div>

                    <div v-if="esAdmin" class="admin-financial-summary">
                        <div class="admin-financial-summary__card">
                            <span class="admin-financial-summary__label">SUBTOTAL</span>
                            <strong class="admin-financial-summary__value">{{ formatearMoneda(resumenFinanciero.subtotal) }}</strong>
                        </div>
                        <div class="admin-financial-summary__card">
                            <span class="admin-financial-summary__label">PROPINA 10%</span>
                            <strong class="admin-financial-summary__value">{{ formatearMoneda(resumenFinanciero.propina) }}</strong>
                        </div>
                        <div class="admin-financial-summary__card">
                            <span class="admin-financial-summary__label">TOTAL</span>
                            <strong class="admin-financial-summary__value">{{ formatearMoneda(resumenFinanciero.total) }}</strong>
                        </div>
                    </div>

                    <!-- Lista de atenciones -->
                    <div class="element-list" v-if="atencionesFiltradas.length > 0">
                        <div v-for="(atencion, index) in atencionesFiltradas" :key="atencion.id">
                            <button
                                class="element-item element-item--atention"
                                type="button"
                                :key="atencion.id" 
                                :class="{ active: atencion.isActive }" 
                                @click="toggleAtentionActive(atencion)">
                                <template v-if="esAdmin">
                                    <div class="admin-order-row">
                                        <div class="admin-order-row__header">
                                            <strong>Nº Pedido: {{ atencion.numeroPedido || atencion.id }}</strong>
                                            <span>{{ atencion.fecha }} {{ formatearHoraAMPM(atencion.hora) }}</span>
                                        </div>

                                        <div class="admin-order-row__columns">
                                            <div class="admin-order-row__col">
                                                <span>Garzón:</span>
                                                <strong>{{ atencion.garzon || '-' }}</strong>
                                            </div>
                                            <div class="admin-order-row__col">
                                                <span>Ubicación:</span>
                                                <strong>{{ atencion.ubicacion }}</strong>
                                            </div>
                                            <div class="admin-order-row__col">
                                                <span>Mesa:</span>
                                                <strong>{{ atencion.mesa || atencion.numero }}</strong>
                                            </div>
                                            <div class="admin-order-row__col">
                                                <span>Estado:</span>
                                                <strong>{{ atencion.estado }}</strong>
                                            </div>
                                            <div class="admin-order-row__col">
                                                <span>Total:</span>
                                                <strong>{{ formatearMoneda(atencion.total) }}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="admin-order-row garzon-order-row">
                                        <div class="admin-order-row__header">
                                            <strong>Nº Pedido: {{ atencion.numeroPedido || atencion.id }}</strong>
                                            <span>{{ atencion.fecha }} {{ formatearHoraAMPM(atencion.hora) }}</span>
                                        </div>

                                        <div class="admin-order-row__columns">
                                            <div class="admin-order-row__col">
                                                <span>Garzón:</span>
                                                <strong>{{ atencion.garzon || usuario?.nombre || '-' }}</strong>
                                            </div>
                                            <div class="admin-order-row__col">
                                                <span>Ubicación:</span>
                                                <strong>{{ atencion.ubicacion }}</strong>
                                            </div>
                                            <div class="admin-order-row__col">
                                                <span>Mesa:</span>
                                                <strong>{{ atencion.mesa || atencion.numero }}</strong>
                                            </div>
                                            <div class="admin-order-row__col">
                                                <span>Estado:</span>
                                                <strong>{{ atencion.estado }}</strong>
                                            </div>
                                            <div class="admin-order-row__col">
                                                <span>Total:</span>
                                                <strong>{{ formatearMoneda(atencion.total) }}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <div class="element-item__options-menu">
                                    <button v-if="atencion.estado === 'pagado'" class="btn btn-option" @click="verAtencion(atencion)">
                                        <img src="../../assets/img/eye-icon.svg" alt="Ver" />
                                    </button>
                                    <button v-else class="btn btn-option" @click="editarAtencion(atencion)">
                                        <img src="../../assets/img/edit-icon.svg" alt="Editar" />
                                    </button>
                                    <button class="btn btn-option" @click="confirmarEliminarAtencion(atencion)">
                                        <img src="../../assets/img/delete-icon.svg" alt="Eliminar" />
                                    </button>
                                    <button class="btn btn-option">
                                        <img src="../../assets/img/close-skyblue-icon.svg" alt="Cerrar" />
                                    </button>
                                </div>
                            </button>

                            <!--
                                <div class="d-flex align-items-center justify-content-between">
                                    <div
                                        class="numero-mesa bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                                        {{ atencion.numero }}
                                    </div>
                                    <div
                                        class="info-atencion flex-grow-1 d-flex justify-content-between text-center">
                                        <div class="col">
                                            <div><strong>Ubicación</strong></div>
                                            <div>{{ atencion.ubicacion }}</div>
                                        </div>
                                        <div class="col">
                                            <div><strong>Estado</strong></div>
                                            <div>{{ atencion.estado }}</div>
                                        </div>
                                        <div class="col">
                                            <div><strong>Fecha</strong></div>
                                            <div>{{ atencion.fecha }}</div>
                                        </div>
                                        <div class="col">
                                            <div><strong>Hora</strong></div>
                                            <div>{{ atencion.hora }}</div>
                                        </div>
                                    </div>
                                    <div class="menu-opciones ms-2 position-relative">
                                        <img src="../../assets/img/ellipsis-vertical-icon.svg" alt="Opciones"
                                            @click="toggleMenu(atencion.id)"
                                            style="cursor: pointer; width: 24px;" />
                                        <div v-if="menuAbierto === atencion.id" class="options-menu">
                                            <button class="menu-item" @click="editarAtencion(atencion)">
                                                <img src="../../assets/img/edit-icon.svg" alt="Editar"
                                                    style="width: 18px; margin-right: 6px;" />
                                                Editar
                                            </button>
                                            <button class="menu-item text-danger"
                                                @click="confirmarEliminarAtencion(atencion)">
                                                <img src="../../assets/img/delete-icon.svg" alt="Eliminar"
                                                    style="width: 18px; margin-right: 6px;" />
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            -->


                            <!-- Detalle del pedido -->
                            <div v-if="detalleVisible === atencion.id" class="px-2 mt-3">
                                <h6>Editar pedido:</h6>
                                <ul class="list-group">
                                    <!-- Agregar más platos -->
                                    <div class="mt-3">
                                        <SelectorPlatos :platosDisponibles="platosDisponibles"
                                            @plato-seleccionado="agregarPlatoAAtencion(atencion.id, $event)" />
                                    </div>
                                    <li v-for="(detalle, i) in detallesPedido[atencion.id]?.detalles"
                                        :key="detalle.id"
                                        class="list-group-item d-flex justify-content-between align-items-center rounded shadow-sm plato-item-small mb-2">
                                        <div class="d-flex align-items-center justify-content-between w-100">
                                            <div class="d-flex align-items-start gap-4 flex-wrap">
                                                <div>
                                                    <div v-if="detalle.editando"
                                                        class="d-flex align-items-center gap-2">
                                                        <input type="number" min="1"
                                                            v-model.number="detalle.quantity"
                                                            @input="actualizarPrecio(detalle)"
                                                            class="form-control form-control-sm"
                                                            style="width: 70px;" />
                                                        <strong>{{ detalle.plato?.nombre }}</strong>
                                                    </div>
                                                    <div v-else>
                                                        <strong>x{{ detalle.quantity }}</strong> <strong>{{
                                                            detalle.plato?.nombre }}</strong>
                                                    </div>
                                                </div>

                                                <div class="d-flex flex-column">
                                                    <strong>Precio ud.</strong>
                                                    <span>${{ parseFloat(detalle.unit_price).toLocaleString()}}</span>
                                                </div>

                                                <div class="d-flex flex-column">
                                                    <strong>Total</strong>
                                                    <span>${{ (detalle.quantity * detalle.unit_price).toLocaleString() }}</span>
                                                </div>
                                            </div>

                                            <div class="d-flex align-items-center gap-2">
                                                <button class="btn btn-sm btn-primary rounded-circle"
                                                    title="Editar cantidad"
                                                    @click.prevent="editarCantidad(atencion.id, i)">
                                                    <img src="../../assets/img/edit-icon.svg" alt="Editar"
                                                        style="width: 15px; height: 15px; filter: brightness(0) invert(1);" />
                                                </button>
                                                <button class="btn btn-sm btn-danger rounded-circle"
                                                    @click="eliminarPlato(atencion.id, i)" title="Eliminar">
                                                    <img src="../../assets/img/close-skyblue-icon.svg" alt="Eliminar"
                                                        style="width: 15px; height: 15px; filter: brightness(0) invert(1);" />
                                                </button>
                                                <button v-if="detalle.editando"
                                                    class="btn btn-sm btn-outline-primary"
                                                    @click="cancelarEdicion(atencion.id, i)">
                                                    Cancelar
                                                </button>
                                            </div>

                                        </div>
                                    </li>
                                </ul>

                                <div class="text-end pe-2 mt-2">
                                    <strong>Total:</strong> ${{ calcularTotal(atencion.id).toLocaleString() }}
                                </div>

                                <div class="text-end pe-2 mt-2">
                                    <!-- Mostrar botón Guardar cambios solo si hay cambios -->
                                    <button v-if="hayCambios(atencion.id)"
                                        class="btn btn-outline-primary btn-sm"
                                        @click="confirmarAccion('guardar', atencion.id)">
                                        Guardar cambios
                                    </button>

                                    <!-- Si no hay cambios, mostrar botón para cambiar estado -->
                                    <button v-else class="btn btn-primary btn-sm ms-2"
                                        :class="{ 'btn-outline-secondary': !tieneSiguienteTransicion(atencion.id) }"
                                        @click="manejarAccionEstado(atencion)">
                                        {{ obtenerTextoBotonEstado(atencion.id) }}
                                    </button>

                                    <!-- Botón para cancelar los cambios -->
                                    <button class="btn btn-outline-danger btn-sm ms-2"
                                        @click="cancelarEdicionPedido(atencion.id)">
                                        Cancelar
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div v-else class="text-center text-muted">
                        <p>No tienes atenciones registradas.</p>
                    </div>
                </div>

                <div class="page-content__footer">
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary rounded-pill" @click="irANuevaAtencion">
                            Nuevo pedido
                        </button>
                    </div>
                    <Signature />
                </div>

                <!-- Modal QR -->
                <QrModal :isOpen="showQrModal" :localNombre="localNombre" @close="cerrarQrModal" />

                <!-- Modal de filtros -->
                <div v-if="showModalFiltros" class="modal animate__animated animate__fadeIn" @click.self="cerrarModalFiltros">
                    <div class="modal-content animate__animated animate__fadeInUp" @click.stop>
                        <div class="modal-header">
                            <h4 class="modal-title">Orden y filtros</h4>
                            <button class="btn-close" type="button" @click="cerrarModalFiltros"></button>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label" for="list-order">Ordenar por:</label>
                            <select id="list-order" class="form-select form-select-sm" aria-label="Orden de la lista" v-model="ordenarPor">
                                <option value="">Selecciona</option>
                                <option value="fecha">Por Fecha</option>
                                <option value="monto">Por Monto</option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                          <label class="form-label" for="zones">Zona:</label>
                          <select id="zones" class="form-select form-select-sm" v-model="zonaSeleccionada">
                            <option value="">Todas</option>
                            <option v-for="zona in zonas" :key="zona.id" :value="zona.nombre">
                              {{ zona.nombre }}
                            </option>
                          </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label" for="modal-date">Fecha:</label>
                            <input
                                id="modal-date"
                                class="form-control form-control-sm"
                                type="date"
                                v-model="fechaFiltro"
                            />
                        </div>

                        <div class="d-flex justify-content-start gap-3 mb-3">
                            <div class="form-check">
                                <input id="proprity-order1" class="form-check-input" type="radio" v-model="ascendente" :value="true" />
                                <label class="form-check-label" for="proprity-order1">Ascendente</label>
                            </div>
                            <div class="form-check">
                                <input id="proprity-order2" class="form-check-input" type="radio" v-model="ascendente" :value="false" />
                                <label class="form-check-label" for="proprity-order2">Descendente</label>
                            </div>
                        </div>

                        <div class="modal-footer justify-content-center">
                            <button class="btn btn-outline-primary rounded-pill" type="button" @click="cerrarModalFiltros">
                                Cancelar
                            </button>
                            <button class="btn btn-primary rounded-pill" type="button" @click="aplicarFiltros">
                                Filtrar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Modal de Confirmación -->
                <ConfirmModal :show="showConfirmModal" :message="confirmMessage" @confirm="onConfirm" @cancel="onCancel" />
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
import Signature from '@/components/Signature.vue'
import SelectorPlatos from '@/components/garzon/SelectorPlatos.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const router = useRouter()
const showQrModal = ref(false)
const usuario = ref(null)
const local = ref(null)
const atenciones = ref([])
const transicionesPorPedido = ref({})
const detalleVisible = ref(null)
const detallesPedido = ref({})
const detallesOriginales = ref({})
const platosDisponibles = ref([])
const mostrarModal = ref(false)
const accionModal = ref(null)
const pedidoIdModal = ref(null)
const menuAbierto = ref(null)
const filtroBusqueda = ref('')
const fechaFiltro = ref('')
const showConfirmModal = ref(false)
const confirmMessage = ref('')
let confirmAction = null
const QUICK_TAB_STORAGE_KEY = 'garzon-atencion-tab'
const pestanaEstadoRapido = ref('todos')

const showModalFiltros = ref('')
const ordenarPor = ref('')
const ascendente = ref(true)
const filtroPendientes = ref(true)
const filtroTerminados = ref(false)

const zonas = ref([])
const zonaSeleccionada = ref('')
const estadosPedido = ref([])
const estadosSeleccionados = ref([])

const esAdmin = computed(() => usuario.value?.usuarioRolesLocales?.[0]?.rolId === 1)

const resumenFinanciero = computed(() => {
    if (!esAdmin.value) {
        return { subtotal: 0, propina: 0, total: 0 }
    }

    const subtotal = atenciones.value
        .filter((pedido) => normalizarEstado(pedido.estado) === 'pagado')
        .reduce((acum, pedido) => acum + parseMonto(pedido.total), 0)

    const propina = subtotal * 0.1

    return {
        subtotal,
        propina,
        total: subtotal + propina,
    }
})

const pestanasEstadoRapido = computed(() => {
    const tabs = [{ key: 'todos', label: 'Todos', estadoNombre: '' }]
    const usados = new Set(['todos'])

    const estadosOrdenados = [...estadosPedido.value]
        .filter((estado) => estado?.activo !== false)
        .sort((a, b) => {
            const ordenA = Number.isFinite(Number(a?.orden)) ? Number(a.orden) : Number.MAX_SAFE_INTEGER
            const ordenB = Number.isFinite(Number(b?.orden)) ? Number(b.orden) : Number.MAX_SAFE_INTEGER
            if (ordenA !== ordenB) return ordenA - ordenB
            return String(a?.nombre || '').localeCompare(String(b?.nombre || ''))
        })

    for (const estado of estadosOrdenados) {
        const nombre = (estado?.nombre || '').trim()
        if (!nombre) continue

        const key = normalizarEstado(nombre)
        if (!key || usados.has(key)) continue

        usados.add(key)
        tabs.push({ key, label: nombre.charAt(0).toUpperCase() + nombre.slice(1), estadoNombre: nombre })
    }

    return tabs
})

const confirmarAccion = (accion, pedidoId) => {
    accionModal.value = accion
    pedidoIdModal.value = pedidoId
    mostrarModal.value = true
}

const ejecutarAccion = async () => {
    mostrarModal.value = false
    const id = pedidoIdModal.value
    if (accionModal.value === 'guardar') {
        await guardarCambiosPedido(id)
    } else if (accionModal.value === 'estado') {
        await cambiarEstadoPedido(id)
    }
}

const obtenerLocal = () => {
    const localStr = localStorage.getItem('local')
    if (localStr) {
        local.value = JSON.parse(localStr)
    }
}

const obtenerUsuario = () => {
    const userStr = localStorage.getItem('user')
    const localStr = localStorage.getItem('local')

    if (userStr) {
        usuario.value = JSON.parse(userStr)
    }

    if (localStr) {
        local.value = JSON.parse(localStr)
    }
}


const obtenerAtenciones = async () => {
    try {
        const localId = local.value?.id
        if (!localId) {
            console.error('No se encontró el localId')
            return
        }
        let res
        if (usuario.value?.usuarioRolesLocales?.[0]?.rolId === 1) {
            // Administrador: obtiene todos los pedidos del local
            res = await apiService.get(`pedidos/porlocal/${localId}`)
        } else {
            // Garzón: solo sus pedidos
            res = await apiService.get(`pedidos/mispedidos/local/${localId}`)
        }
        atenciones.value = res
        
        console.log('ATENCIONES:', res)

        if (res.length > 0) {
            console.log('PRIMER PEDIDO:', res[0])
        }
        
        // Se limpian para evitar datos stale y cargar transiciones solo bajo demanda.
        transicionesPorPedido.value = {}
    } catch (error) {
        console.error('Error al obtener atenciones:', error)
    }
}

const obtenerTransicionPedido = async (pedidoId) => {
    try {
        const transiciones = await apiService.get(`workflow-pedidos/${pedidoId}/transiciones`)
        return Array.isArray(transiciones) && transiciones.length > 0 ? transiciones[0] : null
    } catch (error) {
        console.error(`Error al obtener transiciones del pedido ${pedidoId}:`, error)
        return undefined
    }
}

const asegurarTransicionPedido = async (pedidoId) => {
    if (Object.prototype.hasOwnProperty.call(transicionesPorPedido.value, pedidoId)) {
        return transicionesPorPedido.value[pedidoId]
    }

    const transicion = await obtenerTransicionPedido(pedidoId)
    if (transicion !== undefined) {
        transicionesPorPedido.value = {
            ...transicionesPorPedido.value,
            [pedidoId]: transicion,
        }
    }

    return transicion
}

const obtenerSiguienteTransicion = (pedidoId) => {
    if (!Object.prototype.hasOwnProperty.call(transicionesPorPedido.value, pedidoId)) {
        return undefined
    }
    return transicionesPorPedido.value[pedidoId]
}

const tieneSiguienteTransicion = (pedidoId) => obtenerSiguienteTransicion(pedidoId) !== null

const obtenerTextoBotonEstado = (pedidoId) => {
    const transicion = obtenerSiguienteTransicion(pedidoId)
    if (transicion === undefined) {
        return 'Avanzar estado'
    }
    if (transicion === null) {
        return 'Estado final'
    }
    return transicion.accionLabel || transicion.descripcion || `Marcar como ${transicion.nombre}`
}

const manejarAccionEstado = async (atencion) => {
    const transicion = await asegurarTransicionPedido(atencion.id)

    if (transicion === undefined) {
        mostrarConfirmacion('No se pudo consultar la transición del pedido. Intenta nuevamente en unos segundos.')
        return
    }

    if (!tieneSiguienteTransicion(atencion.id)) {
        mostrarConfirmacion(`El pedido ya se encuentra en el estado final: ${atencion.estado}.`)
        return
    }

    confirmarAccion('estado', atencion.id)
}

const obtenerZonas = async () => {
  try {
    const res = await apiService.get('zonas')
    zonas.value = res
  } catch (error) {
    console.error('Error al obtener zonas:', error)
  }
}

const obtenerEstadosPedido = async () => {
  try {
    const res = await apiService.get('estados-pedido-empresa')
    estadosPedido.value = res
  } catch (error) {
    console.error('Error al obtener estados de pedido:', error)
  }
}

const seleccionarPestanaEstado = (tab) => {
        pestanaEstadoRapido.value = tab
}

const coincideConPestanaEstado = (estado, pestana) => {
    if (pestana === 'todos') return true

    const tabSeleccionada = pestanasEstadoRapido.value.find((tab) => tab.key === pestana)
    if (!tabSeleccionada?.estadoNombre) return true

    return normalizarEstado(estado) === normalizarEstado(tabSeleccionada.estadoNombre)
}

const atencionesFiltradas = computed(() => {
  let lista = [...atenciones.value]

        if (!esAdmin.value && pestanaEstadoRapido.value !== 'todos') {
                lista = lista.filter((a) => coincideConPestanaEstado(a.estado, pestanaEstadoRapido.value))
        }

    // Filtro por fecha seleccionada (yyyy-mm-dd) contra fecha mostrada (dd-mm-yyyy / dd/mm/yyyy)
    if (fechaFiltro.value) {
        lista = lista.filter(a => normalizarFechaAISO(a.fecha) === fechaFiltro.value)
    }

  // Filtro por zona
  if (zonaSeleccionada.value) {
    lista = lista.filter(a =>
      (a.zona && a.zona === zonaSeleccionada.value) ||
      (a.ubicacion && a.ubicacion === zonaSeleccionada.value)
    )
  }



  // Filtro por búsqueda
  if (filtroBusqueda.value) {
    const texto = filtroBusqueda.value.toLowerCase()
    lista = lista.filter(a =>
            (a.id && a.id.toString().includes(texto)) ||
            (a.garzon && a.garzon.toLowerCase().includes(texto)) ||
      (a.ubicacion && a.ubicacion.toLowerCase().includes(texto)) ||
      (a.estado && a.estado.toLowerCase().includes(texto)) ||
      (a.fecha && a.fecha.toLowerCase().includes(texto)) ||
      (a.hora && a.hora.toLowerCase().includes(texto)) ||
      (a.numero && a.numero.toString().includes(texto)) ||
            (a.total && a.total.toString().includes(texto)) ||
      (a.mesa && a.mesa.toString().includes(texto))
    )
  }

  // Ordenar
  if (ordenarPor.value === 'fecha') {
    lista.sort((a, b) => {
      const fa = new Date(a.fecha_creacion || a.fecha)
      const fb = new Date(b.fecha_creacion || b.fecha)
      return ascendente.value ? fa - fb : fb - fa
    })
  } else if (ordenarPor.value === 'monto') {
    lista.sort((a, b) => {
      const ma = parseMonto(a.total)
      const mb = parseMonto(b.total)
      return ascendente.value ? ma - mb : mb - ma
    })
  }

  // Filtro por estado
  if (estadosSeleccionados.value.length > 0) {
    lista = lista.filter(a =>
      estadosSeleccionados.value.includes(a.estado?.toLowerCase())
    )
  }
  // Si no hay ninguno seleccionado, muestra todos los pedidos

  return lista
})

const normalizarFechaAISO = (fechaTexto) => {
    if (!fechaTexto || typeof fechaTexto !== 'string') return ''
    const parts = fechaTexto.split(/[\/-]/)
    if (parts.length !== 3) return ''

    const [dd, mm, yyyy] = parts
    if (!dd || !mm || !yyyy) return ''

    const d = dd.padStart(2, '0')
    const m = mm.padStart(2, '0')
    return `${yyyy}-${m}-${d}`
}

const normalizarEstado = (estado) => {
    if (!estado || typeof estado !== 'string') return ''
    return estado
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
}

const parseMonto = (valor) => {
    if (typeof valor === 'number') {
        return Number.isFinite(valor) ? Math.round(valor) : 0
    }

    if (typeof valor !== 'string') return 0

    const limpio = valor.trim().replace(/[^0-9,.-]/g, '')
    if (!limpio) return 0

    const tienePunto = limpio.includes('.')
    const tieneComa = limpio.includes(',')

    // Caso simple: solo dígitos y un separador decimal (10011.00 / 10011,00)
    if (/^-?\d+[.,]\d+$/.test(limpio)) {
        const numeroSimple = Number(limpio.replace(',', '.'))
        return Number.isFinite(numeroSimple) ? Math.round(numeroSimple) : 0
    }

    let normalizado = limpio

    if (tienePunto && tieneComa) {
        // Si existen ambos, el último separador suele ser decimal.
        const ultimoPunto = limpio.lastIndexOf('.')
        const ultimaComa = limpio.lastIndexOf(',')
        const separadorDecimal = ultimoPunto > ultimaComa ? '.' : ','
        const separadorMiles = separadorDecimal === '.' ? ',' : '.'

        normalizado = limpio.split(separadorMiles).join('')
        if (separadorDecimal === ',') {
            normalizado = normalizado.replace(',', '.')
        }
    } else if (tieneComa) {
        const partes = limpio.split(',')
        if (partes.length > 2) {
            // 1,234,567 -> miles
            normalizado = partes.join('')
        } else if (partes[1]?.length === 3) {
            // 10,011 -> miles
            normalizado = partes.join('')
        } else {
            // 10011,00 -> decimal
            normalizado = limpio.replace(',', '.')
        }
    } else if (tienePunto) {
        const partes = limpio.split('.')
        if (partes.length > 2) {
            // 4.004.400 -> miles
            normalizado = partes.join('')
        } else if (partes[1]?.length === 3) {
            // 10.011 -> miles
            normalizado = partes.join('')
        } else {
            // 10011.00 -> decimal
            normalizado = limpio
        }
    }

    const numero = Number(normalizado)
    return Number.isFinite(numero) ? Math.round(numero) : 0
}

const formatearHoraAMPM = (hora) => {
    if (!hora || typeof hora !== 'string') return ''

    return hora
        .replace(/\s*a\.?\s*m\.?/i, ' am')
        .replace(/\s*p\.?\s*m\.?/i, ' pm')
        .replace(/\s+/g, ' ')
        .trim()
}

const formatearMoneda = (valor) => {
    const numero = parseMonto(valor)
    if (Number.isNaN(numero)) return '$0'
    return `$${Math.round(numero).toLocaleString('es-CL')}`
}

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

const irANuevaAtencion = () => {
    router.push('/garzon/nuevaatencion')
}

const eliminarPlato = (pedidoId, index) => {
    detallesPedido.value[pedidoId].detalles.splice(index, 1)
}

const calcularTotal = (pedidoId) => {
    const detalles = detallesPedido.value[pedidoId]?.detalles || []
    return detalles.reduce((sum, d) => sum + (d.quantity * d.unit_price), 0)
}

const guardarCambiosPedido = async (pedidoId) => {
    try {
        const pedido = detallesPedido.value[pedidoId];

        const payload = {
            mesa_id: pedido.mesa_id || pedido.mesa?.id,
            order_type: pedido.order_type || "en mesa",
            customer_count: pedido.customer_count || 1,
            platos: pedido.detalles.map(d => ({
                menu_item_id: d.plato.id,
                quantity: d.quantity
            }))
        };

        await apiService.put(`pedidos/${pedidoId}`, payload);

        pedido.detalles.forEach(d => {
            d.editando = false;
        });

        pedido.total_amount = calcularTotal(pedidoId);

        detallesOriginales.value[pedidoId] = JSON.parse(JSON.stringify(pedido));

        detalleVisible.value = null

        mostrarConfirmacion('Pedido actualizado con éxito.');

    } catch (error) {
        console.error('Error al guardar cambios:', error)
        mostrarConfirmacion('Ocurrió un error al guardar los cambios.');
    }
};



const editarCantidad = (pedidoId, index) => {
    const detalle = detallesPedido.value[pedidoId].detalles[index];

    if (!detallesOriginales.value[pedidoId]) detallesOriginales.value[pedidoId] = {};
    detallesOriginales.value[pedidoId][detalle.id] = JSON.parse(JSON.stringify(detalle));

    detallesPedido.value[pedidoId].detalles.forEach((d, i) => {
        d.editando = i === index ? !d.editando : false;
    });
}

const cancelarEdicion = (pedidoId, index) => {
    const detalle = detallesPedido.value[pedidoId].detalles[index];
    const original = detallesOriginales.value[pedidoId]?.[detalle.id];

    if (original) {
        detalle.quantity = original.quantity;
        detalle.unit_price = original.unit_price;
        detalle.editando = false;
    }

    detalleVisible.value = null;
}


const actualizarPrecio = (detalle) => {
    if (detalle && detalle.quantity && detalle.unit_price) {
        detalle.total = detalle.quantity * detalle.unit_price
    }
}

const agregarPlatoAAtencion = (pedidoId, { plato, cantidad }) => {
    const nuevoDetalle = {
        plato,
        quantity: cantidad,
        unit_price: plato.precio
    };

    const detallesExistentes = detallesPedido.value[pedidoId]?.detalles || [];

    const platoExistente = detallesExistentes.find(detalle => detalle.plato.id === plato.id);

    if (platoExistente) {
        platoExistente.quantity += cantidad;
    } else {
        detallesPedido.value = {
            ...detallesPedido.value,
            [pedidoId]: {
                ...detallesPedido.value[pedidoId],
                detalles: [...detallesExistentes, nuevoDetalle]
            }
        };
    }
};

const cancelarEdicionPedido = (pedidoId) => {
    const original = detallesOriginales.value[pedidoId]
    if (original) {
        detallesPedido.value[pedidoId] = JSON.parse(JSON.stringify(original))
    }

    detalleVisible.value = null
}

const hayCambios = (pedidoId) => {
    const original = detallesOriginales.value[pedidoId]
    const actual = detallesPedido.value[pedidoId]

    if (!original || !actual) return false

    if (original.detalles.length !== actual.detalles.length) return true

    for (const detalleActual of actual.detalles) {
        const detalleOriginal = original.detalles.find(d => d.id === detalleActual.id)
        if (!detalleOriginal) return true
        if (detalleActual.quantity !== detalleOriginal.quantity) return true
    }
    return false
}

const cambiarEstadoPedido = async (pedidoId) => {
    try {
        const transicion = await asegurarTransicionPedido(pedidoId)
        if (transicion === undefined) {
            mostrarConfirmacion('No se pudo consultar la transición del pedido. Intenta nuevamente en unos segundos.')
            return
        }

        if (!transicion) {
            const pedido = atenciones.value.find(item => item.id === pedidoId)
            mostrarConfirmacion(`El pedido ya se encuentra en el estado final: ${pedido?.estado || 'actual'}.`)
            return
        }

        await apiService.patch(`pedidos/${pedidoId}/status`, {})

        await obtenerAtenciones();

        if (detalleVisible.value === pedidoId) {
            detalleVisible.value = null;
        }

        transicionesPorPedido.value = {
            ...transicionesPorPedido.value,
            [pedidoId]: undefined,
        }

        mostrarConfirmacion(`Pedido actualizado a ${transicion.nombre}.`);
    } catch (error) {
        console.error('Error al cambiar el estado del pedido:', error);
        mostrarConfirmacion(error?.message || 'Ocurrió un error al cambiar el estado.');
    }
}

const toggleMenu = (pedidoId) => {
    menuAbierto.value = menuAbierto.value === pedidoId ? null : pedidoId
}

// Método para alternar la visibilidad de las opciones
const toggleAtentionActive = (atencion) => {
  // Cerrar todos los demás menús primero
  atenciones.value.forEach(a => {
    if (a.id !== atencion.id) {
      a.isActive = false
    }
  })
  // Alternar el estado de la atencion actual
  atencion.isActive = !atencion.isActive
}

const verAtencion = (atencion) => {
    router.push(`/garzon/veratencion/${atencion.id}`)
}

const editarAtencion = (atencion) => {
    router.push(`/garzon/editaratencion/${atencion.id}`)
}

const confirmarEliminarAtencion = async (atencion) => {
    mostrarConfirmacion('¿Estás seguro de que deseas eliminar este pedido?', async () => {
        try {
            await apiService.delete(`pedidos/${atencion.id}`)
            await obtenerAtenciones()
            mostrarConfirmacion('Pedido eliminado correctamente.')
        } catch (error) {
            mostrarConfirmacion('No se pudo eliminar el pedido.')
            console.error(error)
        }
    })
}

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

function abrirModalFiltros() {
  showModalFiltros.value = true
}
function cerrarModalFiltros() {
  showModalFiltros.value = false
}
function aplicarFiltros() {
  showModalFiltros.value = false
  // El filtrado real se hace en el computed atencionesFiltradas
}

watch(pestanaEstadoRapido, (valor) => {
    localStorage.setItem(QUICK_TAB_STORAGE_KEY, valor)
})

watch(pestanasEstadoRapido, (tabs) => {
    const existe = tabs.some((tab) => tab.key === pestanaEstadoRapido.value)
    if (!existe) {
        pestanaEstadoRapido.value = 'todos'
    }
})

onMounted(() => {
    const tabGuardada = localStorage.getItem(QUICK_TAB_STORAGE_KEY)
    if (tabGuardada) {
        pestanaEstadoRapido.value = tabGuardada
    }

    obtenerLocal()
    obtenerUsuario()
    obtenerAtenciones()
    obtenerZonas()
    obtenerEstadosPedido()
})
</script>

<style scoped>
.page-content--backoffice .page-content__body {
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.page-content--backoffice .page-content__body .element-list {
    height: auto;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-bottom: 8px;
}

.page-content--backoffice .page-content__footer {
    position: sticky;
    bottom: 0;
    background: #fff;
    z-index: 5;
    padding-top: 8px;
}

.admin-list-filters-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.garzon-list-filters-form {
    width: 100%;
}

.quick-status-tabs {
    display: flex;
    gap: 0;
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 0;
    margin: 8px 0 0;
    scrollbar-width: thin;
    scrollbar-color: #9db8cf #eef5fb;
}

.quick-status-tabs__tab {
    flex: 0 0 auto;
    border: none;
    border-bottom: 3px solid transparent;
    background: transparent;
    color: #98a2ad;
    font-size: 16px;
    font-weight: 400;
    line-height: 1;
    padding: 12px 16px;
    border-radius: 0;
}

.quick-status-tabs__tab.is-active {
    color: #08a0eb;
    font-weight: 600;
    border-bottom-color: #08a0eb;
}

.quick-status-tabs::-webkit-scrollbar {
    height: 5px;
}

.quick-status-tabs::-webkit-scrollbar-track {
    background: #eef5fb;
    border-radius: 999px;
}

.quick-status-tabs::-webkit-scrollbar-thumb {
    background: #9db8cf;
    border-radius: 999px;
}

.garzon-order-row .admin-order-row__col strong {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
}

.admin-date-input {
    position: relative;
}

.admin-date-input__label {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: #9aa7b5;
    pointer-events: none;
}

.admin-date-input input[type='date'] {
    padding-left: 70px;
    color: #0f253f;
}

.admin-date-input input[type='date']:valid + .admin-date-input__label,
.admin-date-input input[type='date']:focus + .admin-date-input__label {
    display: none;
}

.admin-date-input input[type='date']::-webkit-calendar-picker-indicator {
    cursor: pointer;
}

.admin-financial-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 12px;
}

.admin-financial-summary__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 74px;
    border: 1px solid #08a0eb;
    border-radius: 10px;
    background: #f0f9ff;
}

.admin-financial-summary__label {
    font-size: 11px;
    font-weight: 700;
    color: #0288d1;
}

.admin-financial-summary__value {
    font-size: clamp(1.5rem, 4vw, 2rem);
    line-height: 1;
    color: #0288d1;
    letter-spacing: -0.2px;
    white-space: nowrap;
}

.admin-order-row {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.admin-order-row__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-size: 13px;
}

.admin-order-row__columns {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 8px;
}

.admin-order-row__col {
    display: flex;
    flex-direction: column;
    text-align: left;
    min-width: 0;
}

.admin-order-row__col span {
    font-size: 11px;
    color: #08a0eb;
    line-height: 1.1;
}

.admin-order-row__col strong {
    font-size: 12px;
    color: #243447;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

@media (max-width: 900px) {
    .quick-status-tabs__tab {
        font-size: 14px;
        padding: 11px 12px;
    }

    .admin-financial-summary {
        gap: 8px;
    }

    .admin-financial-summary__card {
        min-height: 66px;
    }

    .admin-financial-summary__label {
        font-size: 10px;
    }

    .admin-financial-summary__value {
        font-size: clamp(1.1rem, 5.5vw, 1.7rem);
    }

    .admin-order-row__columns {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}
</style>
