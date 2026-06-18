<template>
    <div v-if="show" class="modal animate__animated animate__fadeIn" @click.self="onCancel">
        <div class="modal-content animate__animated animate__fadeInUp modal-pago">
            <div class="modal-header">
                <h5 class="modal-title">Registrar pago</h5>
                <button class="btn-close" type="button" @click="onCancel"></button>
            </div>

            <div class="modal-body">
                <div class="resumen-pago mb-3">
                    <h6 class="resumen-pago__title">Resumen del pedido</h6>
                    <div class="resumen-pago__item resumen-pago__item--muted">
                        <span>Neto (sin IVA)</span>
                        <strong>{{ formatear(totalNeto) }}</strong>
                    </div>
                    <div class="resumen-pago__item resumen-pago__item--muted">
                        <span>IVA (19%)</span>
                        <strong>{{ formatear(ivaCalculado) }}</strong>
                    </div>
                    <div class="resumen-pago__item">
                        <span>Subtotal (con IVA)</span>
                        <strong>{{ formatear(subtotal) }}</strong>
                    </div>
                    <div class="resumen-pago__item">
                        <span>Propina</span>
                        <strong>{{ formatear(propinaPagada) }}</strong>
                    </div>
                    <div class="resumen-pago__item resumen-pago__item--total">
                        <span>Total a pagar</span>
                        <strong>{{ formatear(totalAPagar) }}</strong>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">Propina (opcional)</label>
                    <div class="tip-options">
                        <button type="button" class="tip-option" :class="{ active: modoPropina === 'none' }" @click="seleccionarModo('none')">Sin propina</button>
                        <button type="button" class="tip-option tip-option--amount" :class="{ active: modoPropina === '10' }" @click="seleccionarModo('10')">
                            <span>10%</span>
                            <small>{{ formatear(subtotal * 0.10) }}</small>
                        </button>
                        <button type="button" class="tip-option tip-option--amount" :class="{ active: modoPropina === '15' }" @click="seleccionarModo('15')">
                            <span>15%</span>
                            <small>{{ formatear(subtotal * 0.15) }}</small>
                        </button>
                        <button type="button" class="tip-option tip-option--amount" :class="{ active: modoPropina === '20' }" @click="seleccionarModo('20')">
                            <span>20%</span>
                            <small>{{ formatear(subtotal * 0.20) }}</small>
                        </button>
                        <button type="button" class="tip-option" :class="{ active: modoPropina === 'free' }" @click="seleccionarModo('free')">&#9998; Monto libre</button>
                    </div>
                    <div v-if="modoPropina !== 'none'" class="input-group mt-2">
                        <span class="input-group-text">Monto de la propina</span>
                        <span class="input-group-text">$</span>
                        <input
                            type="number"
                            class="form-control"
                            min="0"
                            :value="modoPropina === 'free' ? propinaLibre : propinaPagada"
                            @input="modoPropina === 'free' ? propinaLibre = Number($event.target.value) : null"
                            :readonly="modoPropina !== 'free'"
                            placeholder="0" />
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">Tipo de pago <span class="text-danger">*</span></label>
                    <select class="form-select" v-model.number="tipoPagoId">
                        <option :value="0" disabled>Selecciona un tipo de pago</option>
                        <option v-for="tipo in tiposPago" :key="tipo.id" :value="tipo.id">{{ tipo.nombre }}</option>
                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label">Monto pagado <span class="text-danger">*</span></label>
                    <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input
                            type="number"
                            class="form-control"
                            v-model.number="montoPagado"
                            :readonly="!esEfectivo && tipoPagoId !== 0"
                            min="0"
                        />
                    </div>
                    <small v-if="montoPagado < totalAPagar" class="text-danger">
                        El monto pagado no puede ser menor al total a pagar.
                    </small>
                </div>

                <div v-if="esEfectivo" class="mb-3">
                    <label class="form-label">Vuelto</label>
                    <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input type="text" class="form-control" :value="formatear(vuelto)" readonly />
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">Número de boleta <span class="text-muted">(opcional)</span></label>
                    <input type="text" class="form-control" v-model="numeroBoleta" placeholder="0" />
                </div>
            </div>

            <div class="modal-footer justify-content-center gap-2">
                <button class="btn btn-outline-primary rounded-pill" type="button" @click="onCancel">Cancelar</button>
                <button class="btn btn-primary rounded-pill" type="button" :disabled="!puedeRegistrar" @click="onConfirm">Registrar</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { apiService } from '@/services/api.service'

const props = defineProps({
    show: { type: Boolean, required: true },
    subtotalPedido: { type: Number, required: true },
})

const emit = defineEmits(['confirm', 'cancel'])

const tiposPago = ref([])
const tipoPagoId = ref(0)
const montoPagado = ref(0)
const numeroBoleta = ref('')
const modoPropina = ref('none')
const propinaLibre = ref(0)

const subtotal = computed(() => Math.round(Number(props.subtotalPedido) || 0))
const totalNeto = computed(() => Math.round(subtotal.value * 100 / 119))
const ivaCalculado = computed(() => subtotal.value - totalNeto.value)


const totalAfecto = computed(() => subtotal.value)

const propinaPagada = computed(() => {
    if (modoPropina.value === 'none') return 0
    if (modoPropina.value === '10') return Math.round(subtotal.value * 0.10)
    if (modoPropina.value === '15') return Math.round(subtotal.value * 0.15)
    if (modoPropina.value === '20') return Math.round(subtotal.value * 0.20)
    return Math.max(0, Math.round(Number(propinaLibre.value) || 0))
})

const porcentajePropina = computed(() => {
    if (modoPropina.value === 'none') return 0
    if (modoPropina.value === '10') return 10
    if (modoPropina.value === '15') return 15
    if (modoPropina.value === '20') return 20
    return null
})

const tipoPropina = computed(() => {
    if (modoPropina.value === 'none') return 'Sin propina'
    if (modoPropina.value === 'free') return 'Libre'
    return 'Sugerida'
})

const totalAPagar = computed(() => subtotal.value + propinaPagada.value)

const tipoSeleccionado = computed(() => tiposPago.value.find((t) => t.id === tipoPagoId.value))
const esEfectivo = computed(() =>
    (tipoSeleccionado.value?.nombre || '').trim().toLowerCase() === 'efectivo'
)

const vuelto = computed(() => {
    if (!esEfectivo.value) return 0
    return Math.max(0, montoPagado.value - totalAPagar.value)
})

const puedeRegistrar = computed(() => {
    if (!tipoPagoId.value) return false
    if (montoPagado.value < totalAPagar.value) return false
    if (!esEfectivo.value && montoPagado.value !== totalAPagar.value) return false
    return true
})

const formatear = (n) => `$${Math.round(Number(n) || 0).toLocaleString('es-CL')}`

const cargarTiposPago = async () => {
    try {
        tiposPago.value = await apiService.get('tipos-pago')
    } catch (error) {
        console.error('Error al cargar tipos de pago:', error)
    }
}

const seleccionarModo = (modo) => {
    modoPropina.value = modo
    if (modo !== 'free') {
        propinaLibre.value = 0
    }
}

watch([tipoPagoId, totalAPagar], () => {
    if (!esEfectivo.value && tipoPagoId.value !== 0) {
        montoPagado.value = totalAPagar.value
    } else if (montoPagado.value < totalAPagar.value) {
        montoPagado.value = totalAPagar.value
    }
})

watch(() => props.show, (visible) => {
    if (!visible) return
    tipoPagoId.value = 0
    numeroBoleta.value = ''
    modoPropina.value = 'none'
    propinaLibre.value = 0
    montoPagado.value = subtotal.value
    cargarTiposPago()
})

onMounted(() => {
    if (props.show) cargarTiposPago()
})

const onConfirm = () => {
    if (!puedeRegistrar.value) return

    emit('confirm', {
        tipoPagoId: tipoPagoId.value,
        numeroBoleta: numeroBoleta.value || null,
        subtotalPedido: subtotal.value,
        //propinaSugerida: Math.round(totalAfecto.value * 0.10),
        propinaSugerida : propinaPagada.value,
        propinaPagada: propinaPagada.value,
        totalAPagar: totalAPagar.value,
        montoPagado: montoPagado.value,
        vuelto: esEfectivo.value ? vuelto.value : null,
        porcentajePropina: porcentajePropina.value,
        tipoPropina: tipoPropina.value,
    })
}

const onCancel = () => emit('cancel')
</script>

<style scoped>
.modal-pago {
    max-width: 500px;
    width: 100%;
}

.resumen-pago {
    background: #f3f6f8;
    border-radius: 10px;
    padding: 12px;
}

.resumen-pago__title {
    margin: 0 0 10px;
    font-size: 14px;
}

.resumen-pago__item {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 6px;
}

.resumen-pago__item--subtotal {
    margin-top: 4px;
    padding-top: 4px;
    border-top: 1px dashed #c8d5e0;
}

.resumen-pago__item--total {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #d1d9df;
    font-weight: 700;
}

.tip-options {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.tip-option {
    border: 1px solid #c8d5e0;
    border-radius: 8px;
    background: #fff;
    color: #3b5368;
    padding: 6px 10px;
    font-size: 12px;
}

.tip-option--amount {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.2;
}

.tip-option--amount small {
    font-size: 11px;
    opacity: 0.8;
}

.tip-option.active {
    border-color: #0b9de0;
    color: #0b9de0;
    background: #eef8ff;
}
</style>
