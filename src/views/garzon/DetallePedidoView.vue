<template>
    <div class="page page--backoffice">
        <InnerHeader />
        <main>
            <div class="page-content page-content--backoffice-form">
                <!-- Header -->
                <div class="page-content__header">
                    <div class="user-logo">
                        <div class="user-logo__image">
                            <img v-if="local?.foto" :src="local.foto" alt="Logo del Local" />
                            <img v-else src="../../assets/img/no-logo.png" alt="Sin logo" />
                        </div>
                    </div>
                    <div class="title">
                        <h2>Detalle del pedido</h2>
                    </div>
                </div>

                <div class="page-content__body">
                    <div v-if="isLoading" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status"></div>
                    </div>

                    <div v-else-if="pedido" class="detalle-pedido detalle-pedido--scroll">
                        <!-- Badge estado -->
                        <div class="detalle-pedido__badge-row">
                            <span class="estado-badge estado-badge--pagado">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                PAGADO
                            </span>
                        </div>

                        <!-- Chips de info -->
                        <div class="row g-2 mb-3">
                            <div class="col-6">
                                <div class="chip-info">
                                    <span>Pedido</span>
                                    <strong>#{{ pedido.id }}</strong>
                                    <small>{{ pedido.mesa?.nombre || '-' }}</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="chip-info">
                                    <span>Atendido por</span>
                                    <strong>{{ pedido.usuario?.nombre || '-' }}</strong>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="chip-info">
                                    <span>Fecha y hora</span>
                                    <strong>{{ formatearFechaHora(pedido.createdAt) }}</strong>
                                </div>
                            </div>
                        </div>

                        <!-- Platos -->
                        <section class="detalle-seccion">
                            <h5 class="detalle-seccion__title">Platos</h5>
                            <div class="table-responsive">
                                <table class="table table-sm detalle-table">
                                    <thead>
                                        <tr>
                                            <th>Plato</th>
                                            <th class="text-center">Cantidad</th>
                                            <th class="text-end">Precio</th>
                                            <th class="text-end">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="det in pedido.detalles" :key="det.id">
                                            <td>
                                                <div class="plato-cell">
                                                    <div class="plato-cell__img" :style="det.plato?.foto ? `background-image:url(${det.plato.foto})` : ''"></div>
                                                    <span>{{ det.plato?.nombre || '-' }}</span>
                                                </div>
                                            </td>
                                            <td class="text-center">x{{ det.quantity }}</td>
                                            <td class="text-end">${{ Number(det.unit_price).toLocaleString() }}</td>
                                            <td class="text-end">${{ Math.round(Number(det.subtotal)).toLocaleString() }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <!-- Resumen de la venta -->
                        <section class="detalle-seccion" v-if="pago">
                            <h5 class="detalle-seccion__title">Resumen de la venta</h5>
                            <div class="resumen-venta">
                                <div class="resumen-venta__row">
                                    <span>Total neto</span>
                                    <span>${{ Number(pago.totalNeto ?? pago.subtotalPedido).toLocaleString() }}</span>
                                </div>
                                <div class="resumen-venta__row" v-if="pago.iva != null">
                                    <span>IVA ({{ pago.tasaIva ?? 19 }}%)</span>
                                    <span>${{ Number(pago.iva).toLocaleString() }}</span>
                                </div>
                                <div class="resumen-venta__row resumen-venta__row--subtotal" v-if="pago.totalAfecto != null">
                                    <span>Total afecto</span>
                                    <span>${{ Number(pago.totalAfecto).toLocaleString() }}</span>
                                </div>
                                <div class="resumen-venta__row" v-if="pago.propinaPagada > 0">
                                    <span>Propina<template v-if="pago.porcentajePropina"> ({{ pago.porcentajePropina }}%)</template></span>
                                    <span>${{ Number(pago.propinaPagada).toLocaleString() }}</span>
                                </div>
                                <div class="resumen-venta__row resumen-venta__row--total">
                                    <strong>TOTAL GENERAL PAGADO</strong>
                                    <strong class="text-primary">${{ Number(pago.totalAPagar).toLocaleString() }}</strong>
                                </div>
                            </div>
                        </section>

                        <!-- Información de pago -->
                        <section class="detalle-seccion" v-if="pago">
                            <h5 class="detalle-seccion__title">Información de pago</h5>
                            <div class="info-pago-grid">
                                <div class="chip-info">
                                    <div class="chip-info__icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#009EE3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                                    </div>
                                    <div>
                                        <span>Medio de pago:</span>
                                        <strong>{{ pago.tipoPago?.nombre || '-' }}</strong>
                                    </div>
                                    <div>
                                        <span>Monto pagado:</span>
                                        <strong>${{ Number(pago.montoPagado).toLocaleString() }}</strong>
                                    </div>
                                    <div v-if="pago.vuelto != null">
                                        <span>Vuelto:</span>
                                        <strong class="text-success">${{ Number(pago.vuelto).toLocaleString() }}</strong>
                                    </div>
                                </div>
                            </div>

                            <!-- Nota propina -->
                            <div class="propina-nota" v-if="pago.propinaPagada > 0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                Incluye propina
                                <template v-if="pago.porcentajePropina">del {{ pago.porcentajePropina }}% </template>
                                (${{ Number(pago.propinaPagada).toLocaleString() }})
                            </div>
                        </section>

                    </div>

                    <div v-else class="text-center py-5 text-muted">
                        No se encontró el pedido.
                    </div>
                </div>

                <!-- Botones: fuera del área scrollable, siempre visibles -->
                <div v-if="!isLoading && pedido" class="detalle-pedido__footer">
                    <button class="btn btn-outline-primary rounded-pill" @click="imprimir">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                        Imprimir comprobante
                    </button>
                    <button class="btn btn-primary rounded-pill" @click="volver">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        Volver
                    </button>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiService } from '@/services/api.service'
import InnerHeader from '@/components/InnerHeader.vue'

const router = useRouter()
const route = useRoute()

const isLoading = ref(true)
const pedido = ref(null)
const local = ref(null)

const pago = computed(() => pedido.value?.registroPago ?? null)

const formatearFechaHora = (isoStr) => {
    if (!isoStr) return '-'
    const d = new Date(isoStr)
    const dia = String(d.getDate()).padStart(2, '0')
    const mes = String(d.getMonth() + 1).padStart(2, '0')
    const anio = d.getFullYear()
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${dia}/${mes}/${anio}  ${hh}:${mm}`
}

const volver = () => router.back()

const imprimir = () => window.print()

onMounted(async () => {
    const localStr = localStorage.getItem('local')
    if (localStr) local.value = JSON.parse(localStr)

    try {
        pedido.value = await apiService.get(`pedidos/${route.params.id}`)
    } catch (e) {
        console.error('Error al cargar detalle del pedido:', e)
    } finally {
        isLoading.value = false
    }
})
</script>

<style scoped>
.detalle-pedido__badge-row {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
}

.estado-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 18px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.5px;
}

.estado-badge--pagado {
    background: #e6f9f0;
    color: #1db954;
    border: 1.5px solid #1db954;
}

.chip-info {
    background: #e8f1f7;
    border-radius: 7px;
    padding: 8px 10px;
    height: 100%;
}

.chip-info span {
    display: block;
    font-size: 12px;
    color: #0e96dc;
    font-weight: 700;
}

.chip-info small {
    display: block;
    font-size: 12px;
    color: #555;
    margin-top: 1px;
}

.chip-info strong {
    display: block;
    margin-top: 2px;
    font-size: 14px;
}

.chip-info__icon {
    margin-bottom: 4px;
}

.detalle-seccion {
    margin-bottom: 20px;
}

.detalle-seccion__title {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 10px;
    padding-bottom: 4px;
    border-bottom: 1.5px solid #e0e8f0;
}

.detalle-table th {
    font-weight: 600;
    font-size: 13px;
    color: #009EE3;
}

.plato-cell {
    display: flex;
    align-items: center;
    gap: 8px;
}

.plato-cell__img {
    width: 38px;
    height: 38px;
    border-radius: 6px;
    background: #d0dde8 center/cover no-repeat;
    flex-shrink: 0;
}

.resumen-venta {
    background: #fff;
    border-radius: 8px;
    border: 1px solid #e0e8f0;
    overflow: hidden;
}

.resumen-venta__row {
    display: flex;
    justify-content: space-between;
    padding: 9px 14px;
    font-size: 14px;
    border-bottom: 1px solid #f0f4f8;
}

.resumen-venta__row:last-child {
    border-bottom: none;
}

.resumen-venta__row--subtotal {
    border-bottom: 1.5px dashed #c8d5e0;
}

.resumen-venta__row--total {
    background: #f4f8fc;
    padding: 11px 14px;
}

.info-pago-grid .chip-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
}

.info-pago-grid .chip-info > div span {
    font-size: 12px;
    color: #0e96dc;
    font-weight: 700;
    display: block;
}

.info-pago-grid .chip-info > div strong {
    font-size: 14px;
    display: block;
}

.propina-nota {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #e8f4fd;
    border-radius: 7px;
    padding: 8px 12px;
    font-size: 13px;
    color: #0e96dc;
    margin-top: 10px;
}

/* Layout override: make page-content a flex column so footer stays pinned */
:deep(main) {
    align-items: stretch;
}

:deep(.page-content--backoffice-form) {
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
    overflow: hidden !important;
}

:deep(.page-content--backoffice-form .page-content__header) {
    flex-shrink: 0;
    height: auto !important;
    min-height: 16%;
}

:deep(.page-content--backoffice-form .page-content__body) {
    flex: 1 !important;
    height: auto !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 4px;
}

.detalle-pedido--scroll {
    /* Content inside body just flows normally; body itself scrolls */
}

.detalle-pedido__footer {
    flex-shrink: 0;
    display: flex;
    gap: 12px;
    padding: 12px 0 10px;
    background: #fff;
    border-top: 1.5px solid #e0e8f0;
}

.detalle-pedido__footer .btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}
</style>
