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

                    <!-- Contenido principal -->
                    <div class="content">
                        <div class="content-header pt-5 pb-4">
                            <strong>Bienvenido(a)</strong>
                            <h2 class="fw-normal">{{ usuario?.nombre || '[*Nombre de Usuario*]' }}</h2>
                        </div>

                        <!-- Sección Mis atenciones -->
                        <div class="mis-atenciones mt-4">
                            <h5 class="titulo-atenciones text-center mb-3">Mis atenciones</h5>

                            <!-- Lista de atenciones -->
                            <div class="atenciones-list" v-if="atenciones.length > 0">
                                <div v-for="(atencion, index) in atenciones" :key="atencion.id"
                                    class="atencion-item d-flex flex-column border rounded-3 p-3 mb-3">
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
                                        <div class="menu-opciones ms-2">
                                            <img src="../../assets/img/ellipsis-vertical-icon.svg" alt="Opciones"
                                                @click="obtenerDetallePedido(atencion.id)" style="cursor: pointer" />
                                        </div>
                                    </div>

                                    <!-- Detalle del pedido -->
                                    <div v-if="detalleVisible === atencion.id" class="detalle-pedido mt-3">
                                        <table class="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Plato</th>
                                                    <th>Cant.</th>
                                                    <th>Precio</th>
                                                    <th>Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="detalle in detallesPedido[atencion.id]?.detalles"
                                                    :key="detalle.id">
                                                    <td>{{ detalle.plato?.nombre }}</td>
                                                    <td>{{ detalle.quantity }}</td>
                                                    <td>${{ parseFloat(detalle.unit_price).toFixed(0) }}</td>
                                                    <td>${{ parseFloat(detalle.subtotal).toFixed(0) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div class="text-end pe-2">
                                            <strong>Total:</strong> ${{
                                                parseFloat(detallesPedido[atencion.id]?.total_amount || 0).toFixed(0) }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-else class="text-center text-muted">
                                <p>No tienes atenciones registradas.</p>
                            </div>
                        </div>

                        <div class="content-footer">
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary rounded-pill" @click="irANuevaAtencion">
                                    Nueva atención
                                </button>
                            </div>
                            <Signature />
                        </div>
                    </div>

                    <!-- Modal QR -->
                    <QrModal :isOpen="showQrModal" :localNombre="localNombre" @close="cerrarQrModal" />
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api.service'
import InnerHeader from '@/components/InnerHeader.vue'
import QrModal from '@/components/QrModal.vue'
import Signature from '@/components/Signature.vue'

const router = useRouter()
const showQrModal = ref(false)
const usuario = ref(null)
const local = ref(null)
const atenciones = ref([])
const detalleVisible = ref(null)
const detallesPedido = ref({})

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
        const res = await apiService.get('pedidos/mispedidos/3')
        atenciones.value = res
    } catch (error) {
        console.error('Error al obtener atenciones:', error)
    }
}

const obtenerDetallePedido = async (pedidoId) => {
    try {
        if (!detallesPedido.value[pedidoId]) {
            const res = await apiService.get(`pedidos/${pedidoId}`)
            detallesPedido.value[pedidoId] = res
        }
        detalleVisible.value = detalleVisible.value === pedidoId ? null : pedidoId
    } catch (error) {
        console.error('Error al obtener el detalle del pedido:', error)
    }
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

onMounted(() => {
    obtenerLocal()
    obtenerUsuario()
    obtenerAtenciones()
})
</script>

<style scoped>
.page-content {
    padding: 20px 0;
}

.mis-atenciones h5 {
    font-weight: bold;
}

.atenciones-list {
    max-height: 400px;
    overflow-y: auto;
    padding: 10px;
}

.atencion-item {
    background-color: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.numero-mesa {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
}

.titulo-atenciones {
    color: #00aaff;
    font-weight: bold;
}

.detalle-pedido {
    background-color: #f8f9fa;
    border-left: 3px solid #00aaff;
    border-radius: 0 0 8px 8px;
    font-size: 0.9rem;
    padding: 10px;
}
</style>