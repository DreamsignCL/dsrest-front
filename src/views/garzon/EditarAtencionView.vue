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
                        <h2>Editar pedido</h2>
                    </div>
                </div>
                <div class="page-content__body">
                    <div class="form-container form-container">
                        <div class="form-container__header">
                            <div class="d-grid gap-2">
                                <button class="btn btn-add-dishes" type="button" @click="abrirModalPlatos">
                                    <span class="text">Agregar plato al pedido</span>
                                    <span class="icon">
                                        <img src="../../assets/img/plus-icon.svg" alt="">
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div class="form-container__body pt-3">
                            <!-- Lista de platos agregados -->
                            <h5>Platos agregados:</h5>
                            <div class="element-list pt-3">
                                <div v-for="(plato, index) in platosSeleccionados" :key="plato.menu_item_id" class="element-item element-item--add-dishes">
                                    <!-- Imagen -->
                                    <div class="element-item__image" v-bind:style="{ backgroundImage: plato.foto ? 'url(' + plato.foto + ')' : 'url(assets/no-image.png)' }"></div>
                                    <!-- Titulo y Precios -->
                                    <div class="element-item__text">
                                        <strong>{{ plato.nombre }}</strong><br>
                                        <div class="prices">
                                            <span>${{ (Number(plato.precioUnitario) || 0).toLocaleString() }}</span>
                                            <span v-if="plato.precioComparacion">
                                                ${{ (Number(plato.precioComparacion) || 0).toLocaleString() }}
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
                                    <strong>SUBTOTAL</strong><br>
                                    ${{ Math.round(subtotal).toLocaleString() }}
                                </div>
                                <div class="totals__item">
                                    <strong>PROPINA 10%</strong><br>
                                    ${{ Math.round(propina).toLocaleString() }}
                                </div>
                                <div class="totals__item">
                                    <strong>TOTAL</strong><br>
                                    ${{ Math.round(total).toLocaleString() }}
                                </div>
                            </div>

                            <div class="buttons">
                                <button class="btn btn-outline-primary rounded-pill" @click="volver">Volver</button>
                                <button class="btn btn-primary rounded-pill" @click="guardarPedido" :disabled="platosSeleccionados.length === 0">
                                    Guardar
                                </button>
                                <button
                                    class="btn rounded-pill"
                                    :class="proximaTransicion ? 'btn-warning' : 'btn-outline-secondary'"
                                    @click="finalizarPedido"
                                    :disabled="platosSeleccionados.length === 0">
                                    {{ textoBotonAvance }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <QrModal :isOpen="showQrModal" :localNombre="localNombre" @close="cerrarQrModal" />
        </main>
    </div>

    <!-- Modal de confirmación -->
    <ConfirmModal :show="showConfirmModal" :message="confirmMessage" @confirm="onConfirm" @cancel="onCancel" />

    <!-- Modal de pago -->
    <RegistrarPagoModal
        :show="showPagoModal"
        :subtotalPedido="subtotal"
        @confirm="onPagoConfirmado"
        @cancel="onPagoCancelado"
    />

    <!-- Modal de platos -->
    <div v-if="showPlatosModal" class="modal modal--add-dishes animate__animated animate__fadeIn">
        <div class="modal-content animate__animated animate__fadeInUp">
            <div class="modal-header">
                <h4 class="modal-title">Agregar plato al pedido</h4 class="title">
                <button class="btn-close" type="button" @click="cerrarModalPlatos"></button>
            </div>
            <div class="modal-body text-start">
                <span class="d-block mb-1">Desliza para ver más opciones</span>
                <div class="select-dishes mb-3">
                    <button
                        v-for="cat in categoriasVisibles"
                        :key="cat.id"
                        class="btn btn-outline-primary btn-sm rounded-pill"
                        :class="{ active: filtroCategoria === cat.id }"
                        @click="filtroCategoria = cat.id">
                        <!--<span class="icon">{{ cat.icon }}</span>-->
                        {{ cat.nombre }}
                    </button>
                </div>

                <input class="form-control mb-2" type="search" placeholder="Buscar..." v-model="filtroTexto" />

                <hr aria-hidden="true">
                <div class="element-list">
                    <div v-for="plato in platosFiltrados" :key="plato.id" class="element-item element-item--add-dishes">
                        <div class="element-item__image" v-bind:style="{ backgroundImage: plato.foto ? 'url(' + plato.foto + ')' : 'url(assets/no-image.png)' }"></div>
                        <div class="element-item__text">
                            <strong>{{ plato.nombre }}</strong><br>
                            <div class="prices">
                                <span>${{ (Number(plato.precio) || 0).toLocaleString() }}</span>
                                <span v-if="plato.precioComparacion">
                                    ${{ (Number(plato.precioComparacion) || 0).toLocaleString() }}
                                </span>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-sm" type="button" @click="agregarPlatoTemporal(plato)">+</button>
                    </div>
                </div>

                <hr aria-hidden="true">

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
                <button class="btn btn-primary rounded-pill" :disabled="!seleccionTemporal.length" type="button"  @click="agregarSeleccionAlPedido">Agregar</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiService } from '@/services/api.service'
import InnerHeader from '@/components/InnerHeader.vue'
import QrModal from '@/components/QrModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import RegistrarPagoModal from '@/components/common/RegistrarPagoModal.vue'

const router = useRouter()
const route = useRoute()
const showQrModal = ref(false)
const local = ref(null)
const isLoading = ref(true)
const platos = ref([])
const proximaTransicion = ref(null)
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

const precioTotal = computed(() => {
    return platosSeleccionados.value.reduce((total, plato) => total + plato.precioTotal, 0)
})

const subtotal = computed(() => {
    return Math.round(platosSeleccionados.value.reduce((total, plato) => {
        const precio = Math.round(Number(plato.precioUnitario)) || 0
        const cantidad = Number(plato.quantity) || 0
        return total + (precio * cantidad)
    }, 0))
})

const propina = computed(() => {
    return Math.round(Number(subtotal.value * 0.1))
})

const total = computed(() => {
    return Math.round(subtotal.value + propina.value)
})

const textoBotonAvance = computed(() => {
    if (!proximaTransicion.value) {
        return 'Estado final'
    }

    return proximaTransicion.value.accionLabel || proximaTransicion.value.descripcion || `Marcar como ${proximaTransicion.value.nombre}`
})

const showPagoModal = ref(false)

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
    plato.precioTotal = Number(plato.precioUnitario) * Number(plato.quantity)
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
        existente.precioTotal = Number(existente.precioUnitario) * existente.quantity
    } else {
        seleccionTemporal.value.push({
            menu_item_id: plato.id,
            quantity: 1,
            nombre: plato.nombre,
            precioUnitario: Number(plato.precio) || 0,
            precioComparacion: Number(plato.precio_comparacion) || null,
            foto: plato.foto,
            recomendacion_chef: plato.recomendacion_chef,
            precioTotal: Number(plato.precio) || 0,
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

const guardarPedido = async () => {
    if (platosSeleccionados.value.length === 0) {
        mostrarConfirmacion('Debes agregar al menos un plato')
        return
    }
    try {
        const res = await apiService.get(`pedidos/${route.params.id}`)
        const payload = {
            mesa_id: res.mesa_id,
            order_type: res.order_type || 'mesa',
            customer_count: res.customer_count || 2,
            platos: platosSeleccionados.value.map(p => ({
                menu_item_id: p.menu_item_id,
                quantity: p.quantity
            }))
        }
        await apiService.put(`pedidos/${route.params.id}`, payload)
        mostrarConfirmacion('Pedido guardado con éxito', () => router.push('/garzon'))
    } catch (error) {
        console.error('Error al guardar el pedido:', error)
        mostrarConfirmacion('Hubo un error al guardar el pedido')
    }
}

const obtenerProximaTransicion = async () => {
    try {
        const transiciones = await apiService.get(`workflow-pedidos/${route.params.id}/transiciones`)
        proximaTransicion.value = Array.isArray(transiciones) && transiciones.length > 0 ? transiciones[0] : null
    } catch (error) {
        console.error('Error al obtener la próxima transición:', error)
        proximaTransicion.value = null
    }
}

const finalizarPedido = async () => {
    if (platosSeleccionados.value.length === 0) {
        mostrarConfirmacion('Debes agregar al menos un plato')
        return
    }

    if (!proximaTransicion.value) {
        mostrarConfirmacion('El pedido ya se encuentra en el estado final.')
        return
    }

    // Intercept: if next state is "pagado", show payment modal first
    const esPagado = proximaTransicion.value.nombre?.trim().toLowerCase() === 'pagado'
    if (esPagado) {
        showPagoModal.value = true
        return
    }

    await ejecutarAvanceEstado(null)
}

const onPagoConfirmado = async (datosPago) => {
    showPagoModal.value = false
    await ejecutarAvanceEstado(datosPago)
}

const onPagoCancelado = () => {
    showPagoModal.value = false
}

const ejecutarAvanceEstado = async (datosPago) => {
    try {
        const res = await apiService.get(`pedidos/${route.params.id}`)
        const payload = {
            mesa_id: res.mesa_id,
            order_type: res.order_type || 'mesa',
            customer_count: res.customer_count || 2,
            platos: platosSeleccionados.value.map(p => ({
                menu_item_id: p.menu_item_id,
                quantity: p.quantity
            }))
        }
        await apiService.put(`pedidos/${route.params.id}`, payload)

        const statusPayload = datosPago ? { datosPago } : {}
        await apiService.patch(`pedidos/${route.params.id}/status`, statusPayload)

        mostrarConfirmacion(`Pedido actualizado a ${proximaTransicion.value.nombre}`, () => router.push('/garzon'))
    } catch (error) {
        console.error('Error al finalizar el pedido:', error)
        mostrarConfirmacion(error?.message || 'Hubo un error al avanzar el pedido')
    }
}

const obtenerPlatos = async () => {
    try {
        const data = await apiService.get('platos/usuario')
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

const abrirQrModal = () => {
    showQrModal.value = true
}

const cerrarQrModal = () => {
    showQrModal.value = false
}

const localNombre = computed(() => {
    return local.value?.nombre || 'Mi Restaurante'
})

onMounted(async () => {
    obtenerLocal()
    await obtenerCategorias()
    await obtenerPlatos()
    const id = route.params.id
    await obtenerProximaTransicion()

    // Si ya está en estado final, redirigir a detalle
    if (proximaTransicion.value === null) {
        router.replace(`/garzon/veratencion/${id}`)
        return
    }

    if (id) {
        apiService.get(`pedidos/${id}`).then(res => {
            platosSeleccionados.value = res.detalles.map(det => {
                const platoInfo = platos.value.find(p => p.id === det.menu_item_id)
                return {
                    menu_item_id: det.menu_item_id,
                    nombre: det.plato?.nombre || (platoInfo ? platoInfo.nombre : ''),
                    quantity: det.quantity,
                    precioUnitario: det.unit_price,
                    precioComparacion: platoInfo ? platoInfo.precio_comparacion : null,
                    foto: platoInfo ? platoInfo.foto : '',
                    recomendacion_chef: platoInfo ? platoInfo.recomendacion_chef : false,
                    precioTotal: det.subtotal
                }
            })
        }).catch(err => {
            console.error('Error al obtener el pedido:', err)
        })
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
</script>
