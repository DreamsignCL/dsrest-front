<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import InnerHeader from '@/components/InnerHeader.vue'
import Signature from '@/components/Signature.vue'
import QrModal from '@/components/QrModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import AperturaCajaModal from '@/components/caja/AperturaCajaModal.vue'
import { apiService } from '@/services/api.service'

const local = ref(null)
const busqueda = ref('')
const cajas = ref([])
const cajaActiva = ref(null)
const isLoading = ref(true)

const showQrModal = ref(false)
const showAperturaModal = ref(false)
const showMsgModal = ref(false)
const showFiltroModal = ref(false)
const msg = ref('')
const aperturaSugerida = ref({ sugerida: false, montoSugerido: 50000 })

const cierreStep = ref(0)
const cierreCajaId = ref(null)
const denominaciones = ref([])
const denominacionSeleccionada = ref('')
const cantidadSeleccionada = ref(0)
const tipoPagoManual = ref('')
const montoPagoManual = ref(0)
const otrosPagos = ref([])
const conteoLineas = ref([])

const resumenCierre = ref(null)
const observacionCierre = ref('')

const detalleCaja = ref(null)
const showDetalleModal = ref(false)

const filtroDesde = ref('')
const filtroHasta = ref('')
const filtroEstado = ref('')
const filtroTipoDiferencia = ref('')
const filtroUsuario = ref('')
const usuariosFiltro = ref([])

const page = ref(1)
const limit = ref(8)
const total = ref(0)

const localId = computed(() => local.value?.id)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))
const hayCajaAbierta = computed(() => cajaActiva.value?.estado === 'Abierta')
const hayCajaEnCierre = computed(() => cajaActiva.value?.estado === 'En cierre')
const accionPrincipalLabel = computed(() => {
  if (hayCajaAbierta.value) return 'Generar cierre de caja'
  if (hayCajaEnCierre.value) return 'Continuar cierre de caja'
  return 'Generar apertura de caja'
})
const opcionesTipoPago = ['Transferencias', 'Tarjeta de cr\u00e9dito', 'Tarjeta de d\u00e9bito']

const totalContadoPaso1 = computed(() => {
  return conteoLineas.value.reduce((acc, item) => acc + (Number(item.denominacion) * Number(item.cantidad || 0)), 0)
})

const totalOtrosPagosPaso1 = computed(() => {
  return otrosPagos.value.reduce((acc, item) => acc + Number(item.monto || 0), 0)
})

const totalGeneralPaso1 = computed(() => totalContadoPaso1.value + totalOtrosPagosPaso1.value)

const subtotalDenominacionSeleccionada = computed(() => {
  const encontrada = denominaciones.value.find((d) => String(d.denominacion) === String(denominacionSeleccionada.value))
  if (!encontrada) return 0
  return Number(encontrada.denominacion) * Number(cantidadSeleccionada.value || 0)
})

const totalVendidoResumen = computed(() => {
  if (!resumenCierre.value) return 0
  return Number(resumenCierre.value.montoEsperadoEfectivo || 0)
})

const totalCajaResumen = computed(() => {
  if (!resumenCierre.value) return 0
  return Number(resumenCierre.value.montoContadoEfectivo || 0)
})

const conteadoTransferencia = computed(() => {
  const otros = resumenCierre.value?.conteadoOtros || []
  const item = otros.find(p => p.tipo === 'Transferencias')
  return Number(item?.monto || 0)
})

const conteadoDebito = computed(() => {
  const otros = resumenCierre.value?.conteadoOtros || []
  const item = otros.find(p => p.tipo === 'Tarjeta de débito')
  return Number(item?.monto || 0)
})

const conteadoCredito = computed(() => {
  const otros = resumenCierre.value?.conteadoOtros || []
  const item = otros.find(p => p.tipo === 'Tarjeta de crédito')
  return Number(item?.monto || 0)
})

const obtenerLocal = () => {
  const localStr = localStorage.getItem('local')
  local.value = localStr ? JSON.parse(localStr) : null
}

const abrirMensaje = (texto) => {
  msg.value = texto
  showMsgModal.value = true
}

const formatear = (n) => `$${Math.round(Number(n) || 0).toLocaleString('es-CL')}`

const formatearFecha = (v) => {
  if (!v) return '-'
  return new Date(v).toLocaleString('es-CL')
}

const formatearFechaCorta = (v) => {
  if (!v) return '-'
  const d = new Date(v)
  const fecha = d.toLocaleDateString('es-CL')
  const hora = d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
  return `${fecha} ${hora}hrs.`
}

const formatearHora = (v) => {
  if (!v) return '-'
  return new Date(v).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
}

const cargarCajaActiva = async () => {
  if (!localId.value) return
  cajaActiva.value = await apiService.get(`cajas/abierta?localId=${localId.value}`)
}

const cargarHistorial = async () => {
  if (!localId.value) return

  const params = new URLSearchParams()
  params.set('localId', localId.value)
  params.set('page', page.value)
  params.set('limit', limit.value)

  if (filtroDesde.value) params.set('desde', filtroDesde.value)
  if (filtroHasta.value) params.set('hasta', filtroHasta.value)
  if (filtroEstado.value) params.set('estado', filtroEstado.value)
  if (filtroTipoDiferencia.value) params.set('tipoDiferencia', filtroTipoDiferencia.value)
  if (filtroUsuario.value) params.set('usuarioId', filtroUsuario.value)

  const resp = await apiService.get(`cajas/historial?${params.toString()}`)
  cajas.value = (resp.data || []).map(c => ({ ...c, isActive: false }))
  total.value = Number(resp.total || 0)
  isLoading.value = false

  const mapUsuarios = new Map()
  for (const c of cajas.value) {
    if (c.usuarioApertura?.id) mapUsuarios.set(c.usuarioApertura.id, c.usuarioApertura.nombre)
    if (c.usuarioCierre?.id) mapUsuarios.set(c.usuarioCierre.id, c.usuarioCierre.nombre)
  }
  usuariosFiltro.value = Array.from(mapUsuarios.entries()).map(([id, nombre]) => ({ id, nombre }))
}

const toggleCajaActive = (caja) => {
  cajas.value.forEach(c => {
    if (c.id !== caja.id) c.isActive = false
  })
  caja.isActive = !caja.isActive
}

const cargarSugerida = async () => {
  if (!localId.value) return
  aperturaSugerida.value = await apiService.get(`cajas/apertura-sugerida?localId=${localId.value}`)
}

const abrirModalApertura = async () => {
  await cargarSugerida()
  showAperturaModal.value = true
}

const confirmarApertura = async (montoInicial) => {
  try {
    await apiService.post('cajas/aperturas', {
      localId: localId.value,
      montoInicial,
      origenApertura: 'Apertura de caja',
    })
    showAperturaModal.value = false
    abrirMensaje('Apertura de caja realizada correctamente')
    await cargarCajaActiva()
    page.value = 1
    await cargarHistorial()
  } catch (error) {
    abrirMensaje(error.message || 'No se pudo abrir la caja')
  }
}

const continuarCierre = async (caja) => {
  try {
    cierreCajaId.value = caja.id
    const den = await apiService.get(`cajas/denominaciones?localId=${localId.value}`)
    denominaciones.value = den.map((d) => ({ id: d.id, denominacion: d.valor, cantidad: 0 }))
    denominacionSeleccionada.value = denominaciones.value.length ? String(denominaciones.value[0].denominacion) : ''
    cantidadSeleccionada.value = 0
    tipoPagoManual.value = ''
    montoPagoManual.value = 0
    otrosPagos.value = []
    conteoLineas.value = []
    observacionCierre.value = ''
    // Try to load existing resumen (conteo may already be done)
    try {
      resumenCierre.value = await apiService.get(`cajas/cierres/resumen?cajaId=${caja.id}`)
      cierreStep.value = 2
    } catch {
      // Conteo not yet registered — go to step 1
      resumenCierre.value = null
      cierreStep.value = 1
    }
    await cargarCajaActiva()
  } catch (error) {
    abrirMensaje(error.message || 'No se pudo retomar el cierre')
  }
}

const iniciarCierre = async () => {
  try {
    const data = await apiService.post('cajas/cierres/iniciar', { localId: localId.value })
    cierreCajaId.value = data.cajaId
    const den = await apiService.get(`cajas/denominaciones?localId=${localId.value}`)
    denominaciones.value = den.map((d) => ({
      id: d.id,
      denominacion: d.valor,
      cantidad: 0,
    }))

    denominacionSeleccionada.value = denominaciones.value.length ? String(denominaciones.value[0].denominacion) : ''
    cantidadSeleccionada.value = 0
    tipoPagoManual.value = ''
    montoPagoManual.value = 0
    otrosPagos.value = []
    conteoLineas.value = []

    resumenCierre.value = null
    observacionCierre.value = ''
    cierreStep.value = 1
    await cargarCajaActiva()
  } catch (error) {
    abrirMensaje(error.message || 'No se pudo iniciar cierre')
  }
}

const ejecutarAccionPrincipal = async () => {
  if (hayCajaAbierta.value) {
    await iniciarCierre()
  } else if (hayCajaEnCierre.value) {
    await continuarCierre(cajaActiva.value)
  } else {
    await abrirModalApertura()
  }
}

const agregarDenominacion = () => {
  if (!denominacionSeleccionada.value) return
  const cantidad = Number(cantidadSeleccionada.value || 0)
  if (cantidad <= 0) return
  conteoLineas.value.push({ denominacion: denominacionSeleccionada.value, cantidad })
  cantidadSeleccionada.value = 0
}

const eliminarLineaConteo = (index) => {
  conteoLineas.value.splice(index, 1)
}

const eliminarOtroPago = (index) => {
  otrosPagos.value.splice(index, 1)
}

const agregarOtroPago = () => {
  const tipo = (tipoPagoManual.value || '').trim()
  const monto = Number(montoPagoManual.value || 0)
  if (!tipo || monto <= 0) return

  const existente = otrosPagos.value.find((p) => p.tipo === tipo)
  if (existente) {
    existente.monto = Number(existente.monto) + monto
  } else {
    otrosPagos.value.push({ tipo, monto })
  }

  tipoPagoManual.value = ''
  montoPagoManual.value = 0
}

const confirmarConteo = async () => {
  try {
    const agg = {}
    for (const line of conteoLineas.value) {
      const den = String(line.denominacion)
      agg[den] = (agg[den] || 0) + Number(line.cantidad)
    }
    const denominacionesPayload = Object.entries(agg).map(([den, cant]) => ({
      denominacion: Number(den),
      cantidad: cant,
    }))
    await apiService.post('cajas/cierres/conteo', {
      cajaId: cierreCajaId.value,
      denominaciones: denominacionesPayload,
      otrosPagos: otrosPagos.value,
    })
    resumenCierre.value = await apiService.get(`cajas/cierres/resumen?cajaId=${cierreCajaId.value}`)
    cierreStep.value = 2
  } catch (error) {
    abrirMensaje(error.message || 'No se pudo registrar el conteo')
  }
}

const confirmarCierre = async () => {
  try {
    await apiService.post('cajas/cierres/confirmar', {
      cajaId: cierreCajaId.value,
      observacion: observacionCierre.value || null,
    })
    cierreStep.value = 0
    cierreCajaId.value = null
    resumenCierre.value = null
    abrirMensaje('Cierre de caja realizado correctamente')
    await cargarCajaActiva()
    page.value = 1
    await cargarHistorial()
  } catch (error) {
    abrirMensaje(error.message || 'No se pudo confirmar el cierre')
  }
}

const cancelarCierre = async () => {
  try {
    if (cierreCajaId.value) {
      await apiService.post('cajas/cierres/cancelar', { cajaId: cierreCajaId.value })
    }
    cierreStep.value = 0
    cierreCajaId.value = null
    resumenCierre.value = null
    abrirMensaje('Cierre cancelado. La caja permanece abierta')
    await cargarCajaActiva()
    page.value = 1
    await cargarHistorial()
  } catch (error) {
    abrirMensaje(error.message || 'No se pudo cancelar el cierre')
  }
}

const verDetalleCaja = async (id) => {
  try {
    detalleCaja.value = await apiService.get(`cajas/${id}`)
    showDetalleModal.value = true
  } catch (error) {
    abrirMensaje(error.message || 'No se pudo obtener el detalle de caja')
  }
}

const resetFiltros = async () => {
  filtroDesde.value = ''
  filtroHasta.value = ''
  filtroEstado.value = ''
  filtroTipoDiferencia.value = ''
  filtroUsuario.value = ''
  busqueda.value = ''
  page.value = 1
  showFiltroModal.value = false
  await cargarHistorial()
}

const aplicarFiltros = () => {
  page.value = 1
  showFiltroModal.value = false
}

const cajasFiltradas = computed(() => {
  const query = busqueda.value.trim().toLowerCase()
  if (!query) return cajas.value
  return cajas.value.filter((c) => {
    const numero = `nÂ° cierre: ${c.id}`.toLowerCase()
    const usuarioA = c.usuarioApertura?.nombre?.toLowerCase() || ''
    const usuarioC = c.usuarioCierre?.nombre?.toLowerCase() || ''
    const estado = c.estado?.toLowerCase() || ''
    return numero.includes(query) || usuarioA.includes(query) || usuarioC.includes(query) || estado.includes(query)
  })
})

const estadoChipClass = (estado) => {
  if (estado === 'Abierta') return 'estado-chip estado-chip--abierta'
  if (estado === 'En cierre') return 'estado-chip estado-chip--encierre'
  return 'estado-chip estado-chip--cerrada'
}

const puedeConfirmarCierre = computed(() => {
  if (!resumenCierre.value) return false
  if (
    resumenCierre.value.requiereObservacionDiferencia
    && resumenCierre.value.diferencia !== 0
    && !observacionCierre.value.trim()
  ) {
    return false
  }
  return true
})

watch([filtroDesde, filtroHasta, filtroEstado, filtroTipoDiferencia, filtroUsuario], async () => {
  page.value = 1
  await cargarHistorial()
})

onMounted(async () => {
  obtenerLocal()
  await cargarCajaActiva()
  await cargarHistorial()
})
</script>

<template>
  <div class="page page--backoffice">
    <InnerHeader @open-qr="showQrModal = true" />

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
            <h2 v-if="cierreStep === 0" class="fw-normal">Gesti&oacute;n de Caja</h2>
            <h2 v-else class="fw-normal">
              <img src="../../assets/img/caja-icon.svg" class="title-icon-img" alt="" />
              Cierre de caja<template v-if="cierreStep === 2"> #{{ cierreCajaId }}</template>
            </h2>
          </div>
        </div>

        <!-- STEP 0: Lista de cajas -->
        <template v-if="cierreStep === 0">
          <div class="page-content__body">
            <div class="list-filters">
              <button class="btn btn-outline-secondary btn-filter" type="button" @click="showFiltroModal = true">
                <img src="../../assets/img/filter-icon.svg" alt="">
              </button>
              <form @submit.prevent>
                <input class="form-control" type="search" placeholder="Buscar..." v-model="busqueda" />
              </form>
            </div>
  
            <div class="element-list">
              <div v-if="isLoading" class="loader"></div>
  
              <div v-else-if="cajasFiltradas.length === 0" class="empty-state">
                <div class="no-image"></div>
                No hay registros de cajas
              </div>
  
              <button
                v-else
                v-for="caja in cajasFiltradas"
                :key="caja.id"
                type="button"
                class="element-item element-item--caja"
                :class="{ active: caja.isActive }"
                @click="toggleCajaActive(caja)"
              >
                <div class="caja-item-body">
                  <div class="caja-item-head">
                    <span class="caja-num">N&deg; Cierre: {{ caja.id }}</span>
                    <span :class="estadoChipClass(caja.estado)">{{ caja.estado }}</span>
                    <span class="caja-fecha">{{ formatearFechaCorta(caja.fechaCierre || caja.fechaApertura) }}</span>
                  </div>
                  <div class="caja-item-labels">
                    <span>Responsable:</span>
                    <span>T. Esperado:</span>
                    <span>T. Ingresado:</span>
                    <span>T. Diferencia:</span>
                    <span>T. Dep&oacute;sito:</span>
                  </div>
                  <div class="caja-item-values">
                    <span>{{ caja.usuarioApertura?.nombre || '-' }}</span>
                    <span>{{ formatear(caja.montoEsperado) }}</span>
                    <span>{{ formatear(caja.montoContado) }}</span>
                    <span>{{ formatear(caja.diferencia) }}</span>
                    <span>{{ formatear(caja.montoContado) }}</span>
                  </div>
                </div>
                <div class="element-item__options-menu">
                  <button v-if="caja.estado === 'Abierta'" class="btn btn-option" @click.stop="iniciarCierre">
                    <img class="option-icon" src="../../assets/img/lock-circle-icon.svg" alt="Iniciar cierre" />
                  </button>
                  <button v-else-if="caja.estado === 'En cierre'" class="btn btn-option" @click.stop="continuarCierre(caja)">
                    <img class="option-icon" src="../../assets/img/lock-circle-icon.svg" alt="Continuar cierre" />
                  </button>
                  <button class="btn btn-option" @click.stop="verDetalleCaja(caja.id)">
                    <img class="option-icon" src="../../assets/img/eye-circle-icon.svg" alt="Ver detalle" />
                  </button>
                  <button class="btn btn-option" @click.stop="toggleCajaActive(caja)">
                    <img class="option-icon" src="../../assets/img/close-circle-icon.svg" alt="Cerrar" />
                  </button>
                </div>
              </button>
            </div>
  
            <div v-if="totalPages > 1" class="d-flex justify-content-between align-items-center mt-3">
              <small class="text-muted">P&aacute;gina {{ page }} de {{ totalPages }}</small>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-secondary btn-sm rounded-pill" :disabled="page <= 1" @click="page -= 1; cargarHistorial()">Anterior</button>
                <button class="btn btn-outline-secondary btn-sm rounded-pill" :disabled="page >= totalPages" @click="page += 1; cargarHistorial()">Siguiente</button>
              </div>
            </div>
          </div>

          <div class="page-content__footer">
            <div class="d-grid gap-2 mb-3">
              <button class="btn btn-primary rounded-pill" @click="ejecutarAccionPrincipal">
                {{ accionPrincipalLabel }}
              </button>
            </div>
            <Signature />
          </div>
        </template>

        <!-- STEP 1: Conteo de denominaciones -->
        <template v-else-if="cierreStep === 1">
          <div class="page-content__body">
            <div class="flow-section">
              <h6>Ingresa el efectivo:</h6>
  
              <!-- Add row -->
              <div class="conteo-row">
                <div class="conteo-row__labels">
                  <span>Denominaci&oacute;n:</span>
                  <span>Cantidad:</span>
                  <span>Total:</span>
                  <span></span>
                </div>
                <div class="conteo-row__inputs">
                  <select v-model="denominacionSeleccionada" class="form-select form-select-sm">
                    <option value="">Selecciona</option>
                    <option v-for="d in denominaciones" :key="d.id" :value="String(d.denominacion)">
                      {{ formatear(d.denominacion) }}
                    </option>
                  </select>
                  <input v-model.number="cantidadSeleccionada" type="number" min="0" class="form-control form-control-sm" />
                  <input :value="formatear(subtotalDenominacionSeleccionada)" disabled class="form-control form-control-sm" />
                  <button type="button" class="plus-btn" @click="agregarDenominacion">+</button>
                </div>
              </div>
  
              <!-- Added denomination lines -->
              <div class="cash-earnings">
  
                <div v-for="(linea, idx) in conteoLineas" :key="idx" class="conteo-row">
                  <div class="conteo-row__labels">
                    <span>Denominaci&oacute;n:</span>
                    <span>Cantidad:</span>
                    <span>Total:</span>
                    <span></span>
                  </div>
                  <div class="conteo-row__inputs">
                    <select v-model="linea.denominacion" class="form-select form-select-sm">
                      <option v-for="d in denominaciones" :key="d.id" :value="String(d.denominacion)">
                        {{ formatear(d.denominacion) }}
                      </option>
                    </select>
                    <input v-model.number="linea.cantidad" type="number" min="0" class="form-control form-control-sm" />
                    <input :value="formatear(Number(linea.denominacion) * Number(linea.cantidad || 0))" disabled class="form-control form-control-sm" />
                    <button type="button" class="remove-btn" @click="eliminarLineaConteo(idx)">
                      <img src="../../assets/img/close-circle-icon.svg" alt="Eliminar" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <hr />
  
            <div class="flow-section">
              <h6>Ingresa otros medios de pago:</h6>
  
              <!-- Add row -->
              <div class="conteo-row conteo-row--pagos">
                <div class="conteo-row__labels">
                  <span>Tipo de pago:</span>
                  <span>Total:</span>
                  <span></span>
                </div>
                <div class="conteo-row__inputs">
                  <select v-model="tipoPagoManual" class="form-select form-select-sm">
                    <option value="">Selecciona</option>
                    <option v-for="tp in opcionesTipoPago" :key="tp" :value="tp">{{ tp }}</option>
                  </select>
                  <input v-model.number="montoPagoManual" type="number" min="0" class="form-control form-control-sm" />
                  <button type="button" class="plus-btn" @click="agregarOtroPago">+</button>
                </div>
              </div>
  
              <!-- Added payment lines -->
              <div class="payment-methods">
                <div v-for="(pago, idx) in otrosPagos" :key="idx" class="conteo-row conteo-row--pagos">
                  <div class="conteo-row__labels">
                    <span>Tipo de pago:</span>
                    <span>Total:</span>
                    <span></span>
                  </div>
                  <div class="conteo-row__inputs">
                    <select v-model="pago.tipo" class="form-select form-select-sm">
                      <option v-for="tp in opcionesTipoPago" :key="tp" :value="tp">{{ tp }}</option>
                    </select>
                    <input v-model.number="pago.monto" type="number" min="0" class="form-control form-control-sm" />
                    <button type="button" class="remove-btn" @click="eliminarOtroPago(idx)">
                      <img src="../../assets/img/close-circle-icon.svg" alt="Eliminar" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <div class="row g-2 mt-3">
              <div class="col-4">
                <div class="total-box">
                  <span>TOTAL EFECTIVO</span>
                  <strong>{{ formatear(totalContadoPaso1) }}</strong>
                </div>
              </div>
              <div class="col-4">
                <div class="total-box">
                  <span>T. OTROS PAGOS</span>
                  <strong>{{ formatear(totalOtrosPagosPaso1) }}</strong>
                </div>
              </div>
              <div class="col-4">
                <div class="total-box">
                  <span>TOTAL</span>
                  <strong>{{ formatear(totalGeneralPaso1) }}</strong>
                </div>
              </div>
            </div>
          </div>

          <div class="page-content__footer">
            <div style="display:flex; gap:.5rem;">
              <button class="btn btn-outline-primary rounded-pill" @click="cancelarCierre" style="width:100%">Cancelar</button>
              <button class="btn btn-primary rounded-pill" @click="confirmarConteo" style="width:100%">Continuar</button>
            </div>
            <Signature />
          </div>
        </template>

        <!-- STEP 2: Resumen de cierre -->
        <template v-else-if="cierreStep === 2">
          <div class="page-content__body">
            <div v-if="resumenCierre" class="close-resume">
              <div class="close-date">{{ formatearFecha(new Date()) }}</div>

              <div class="box text-left">
                  <span>Responsable:</span>
                  {{ local?.nombre || '-' }}
              </div>
            </div>
  
            <div class="row g-2 mt-2">
              <div class="col-6">
                <div class="chip-info">
                  <span>Saldo inicial</span>
                </div>
              </div>
              <div class="col-6">
                <div class="saldo-value">{{ formatear(cajaActiva?.montoInicial || 0) }}</div>
              </div>
            </div>
  
            <div class="table-responsive mt-3" v-if="resumenCierre">
              <table class="table table-sm cierre-table">
                <thead>
                  <tr>
                    <th>Tipo de pago</th>
                    <th>Esperado</th>
                    <th>Ingresado</th>
                    <th>Diferencia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Efectivo</td>
                    <td>{{ formatear(resumenCierre.efectivoEsperado) }}</td>
                    <td>{{ formatear(resumenCierre.cashContado) }}</td>
                    <td :class="{ negativo: (resumenCierre.cashContado - resumenCierre.efectivoEsperado) < 0 }">{{ formatear(resumenCierre.cashContado - resumenCierre.efectivoEsperado) }}</td>
                  </tr>
                  <tr>
                    <td>Transferencia</td>
                    <td>{{ formatear(resumenCierre.ventasTransferencia) }}</td>
                    <td>{{ formatear(conteadoTransferencia) }}</td>
                    <td :class="{ negativo: (conteadoTransferencia - resumenCierre.ventasTransferencia) < 0 }">{{ formatear(conteadoTransferencia - resumenCierre.ventasTransferencia) }}</td>
                  </tr>
                  <tr>
                    <td>Tarj. D&eacute;bito</td>
                    <td>{{ formatear(resumenCierre.ventasDebito) }}</td>
                    <td>{{ formatear(conteadoDebito) }}</td>
                    <td :class="{ negativo: (conteadoDebito - resumenCierre.ventasDebito) < 0 }">{{ formatear(conteadoDebito - resumenCierre.ventasDebito) }}</td>
                  </tr>
                  <tr>
                    <td>Tarj. Cr&eacute;dito</td>
                    <td>{{ formatear(resumenCierre.ventasCredito) }}</td>
                    <td>{{ formatear(conteadoCredito) }}</td>
                    <td :class="{ negativo: (conteadoCredito - resumenCierre.ventasCredito) < 0 }">{{ formatear(conteadoCredito - resumenCierre.ventasCredito) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
  
            <div class="row g-2 mt-3">
              <div class="col-4">
                <div class="total-box">
                  <span>TOTAL CAJA</span>
                  <strong>{{ formatear(totalVendidoResumen) }}</strong>
                </div>
              </div>
              <div class="col-4">
                <div class="total-box">
                  <span>TOTAL INGRESADO</span>
                  <strong>{{ formatear(totalCajaResumen) }}</strong>
                </div>
              </div>
              <div class="col-4">
                <div class="total-box" :class="{ 'total-box--negativo': Number(resumenCierre?.diferencia || 0) < 0 }">
                  <span>DIFERENCIA</span>
                  <strong>{{ formatear(resumenCierre?.diferencia) }}</strong>
                </div>
              </div>
            </div>
  
            <div class="mt-3" v-if="resumenCierre && resumenCierre.diferencia !== 0">
              <label class="form-label">Observaci&oacute;n</label>
              <textarea class="form-control" v-model="observacionCierre" rows="2" placeholder="Ingrese observaci&oacute;n"></textarea>
            </div>
          </div>
          <div class="page-content__footer">
            <div style="display:flex; gap:.5rem;">
              <button class="btn btn-primary rounded-pill" :disabled="!puedeConfirmarCierre" @click="confirmarCierre" style="width:100%">Cerrar caja</button>
              <button class="btn btn-outline-primary rounded-pill" @click="cancelarCierre" style="width:100%">Volver</button>
            </div>
            <Signature />
          </div>
        </template>
      </div>
    </main>

    <AperturaCajaModal
      :show="showAperturaModal"
      :montoSugerido="aperturaSugerida.montoSugerido"
      :sugerida="aperturaSugerida.sugerida"
      @confirm="confirmarApertura"
      @cancel="showAperturaModal = false"
    />

    <ConfirmModal
      :show="showMsgModal"
      :message="msg"
      @confirm="showMsgModal = false"
      @cancel="showMsgModal = false"
    />

    <!-- Modal de filtros -->
    <div v-if="showFiltroModal" class="modal animate__animated animate__fadeIn" @click="showFiltroModal = false">
      <div class="modal-content animate__animated animate__fadeInUp" @click.stop>
        <div class="modal-header">
          <h4 class="modal-title">Filtros</h4>
          <button class="btn-close" type="button" @click="showFiltroModal = false"></button>
        </div>
        <div class="modal-body">
          <div class="row g-3">
            <div class="col-6">
              <label class="form-label">Desde:</label>
              <input class="form-control" type="date" v-model="filtroDesde" />
            </div>
            <div class="col-6">
              <label class="form-label">Hasta:</label>
              <input class="form-control" type="date" v-model="filtroHasta" />
            </div>
            <div class="col-12">
              <label class="form-label">Estado:</label>
              <select class="form-select" v-model="filtroEstado">
                <option value="">Todos los estados</option>
                <option value="Abierta">Abierta</option>
                <option value="En cierre">En cierre</option>
                <option value="Cerrada">Cerrada</option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label">Tipo diferencia:</label>
              <select class="form-select" v-model="filtroTipoDiferencia">
                <option value="">Todos</option>
                <option value="Sin diferencia">Sin diferencia</option>
                <option value="Sobrante">Sobrante</option>
                <option value="Faltante">Faltante</option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label">Usuario:</label>
              <select class="form-select" v-model="filtroUsuario">
                <option value="">Todos los usuarios</option>
                <option v-for="u in usuariosFiltro" :key="u.id" :value="u.id">{{ u.nombre }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer justify-content-center">
          <button class="btn btn-outline-primary rounded-pill" type="button" @click="resetFiltros">Limpiar</button>
          <button class="btn btn-primary rounded-pill" type="button" @click="aplicarFiltros">Filtrar</button>
        </div>
      </div>
    </div>

    <!-- Modal de detalle -->
    <div v-if="showDetalleModal" class="modal animate__animated animate__fadeIn" @click.self="showDetalleModal = false">
      <div class="modal-content animate__animated animate__fadeInUp" @click.stop>
        <div class="modal-header">
          <h4 class="modal-title">
            {{ detalleCaja?.estado === 'Abierta' ? 'Apertura de caja N° ' + detalleCaja?.id : 'Cierre de caja #' + detalleCaja?.id }}
          </h4>
          <button class="btn-close" type="button" @click="showDetalleModal = false"></button>
        </div>

        <div class="modal-body" v-if="detalleCaja">
          <template v-if="detalleCaja.estado === 'Abierta'">
            <div class="row g-2 mb-4">
              <div class="col-6">
                <div class="chip-info">
                  <span>Responsable:</span>
                  <strong>{{ detalleCaja.usuarioApertura?.nombre || '-' }}</strong>
                </div>
              </div>
              <div class="col-6">
                <div class="chip-info">
                  <span>Hora apertura:</span>
                  <strong>{{ formatearHora(detalleCaja.fechaApertura) }}</strong>
                </div>
              </div>
              <div class="col-12">
                <div class="chip-info">
                  <span>Saldo inicial:</span>
                  <strong>{{ formatear(detalleCaja.montoInicial) }}</strong>
                </div>
              </div>
            </div>
            <div class="d-grid">
              <button class="btn btn-outline-primary rounded-pill" @click="showDetalleModal = false">Cerrar</button>
            </div>
          </template>

          <template v-else>
            <div class="row g-2 mb-3">
              <div class="col-6">
                <div class="chip-info">
                  <span>No. cierre:</span>
                  <strong>{{ detalleCaja.id }}</strong>
                </div>
              </div>
              <div class="col-6">
                <div class="chip-info">
                  <span>Fecha:</span>
                  <strong>{{ formatearFecha(detalleCaja.fechaCierre) }}</strong>
                </div>
              </div>
              <div class="col-6">
                <div class="chip-info">
                  <span>Responsable:</span>
                  <strong>{{ detalleCaja.usuarioCierre?.nombre || detalleCaja.usuarioApertura?.nombre || '-' }}</strong>
                </div>
              </div>
              <div class="col-6">
                <div class="chip-info">
                  <span>Hora:</span>
                  <strong>{{ formatearHora(detalleCaja.fechaCierre) }}</strong>
                </div>
              </div>
            </div>

            <div class="row g-2 mb-3">
              <div class="col-6">
                <div class="chip-info">
                  <span>Saldo inicial</span>
                </div>
              </div>
              <div class="col-6">
                <div class="saldo-value">{{ formatear(detalleCaja.montoInicial) }}</div>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-sm cierre-table">
                <thead>
                  <tr>
                    <th>Tipo de pago</th>
                    <th>Esperado</th>
                    <th>Ingresado</th>
                    <th>Diferencia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Efectivo</td>
                    <td>{{ formatear(detalleCaja.montoEsperado) }}</td>
                    <td>{{ formatear(detalleCaja.montoContado) }}</td>
                    <td :class="{ negativo: Number(detalleCaja.diferencia || 0) < 0 }">{{ formatear(detalleCaja.diferencia) }}</td>
                  </tr>
                  <tr>
                    <td>Transferencia</td>
                    <td>{{ formatear(detalleCaja.ventasTransferencia) }}</td>
                    <td>{{ formatear(detalleCaja.ventasTransferencia) }}</td>
                    <td>$0</td>
                  </tr>
                  <tr>
                    <td>Tarj. D&eacute;bito</td>
                    <td>{{ formatear(detalleCaja.ventasTarjeta) }}</td>
                    <td>{{ formatear(detalleCaja.ventasTarjeta) }}</td>
                    <td>$0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="d-grid gap-2 mt-3">
              <button class="btn btn-primary rounded-pill" @click="showDetalleModal = false">Continuar</button>
              <button class="btn btn-outline-primary rounded-pill" @click="showDetalleModal = false">Cancelar</button>
            </div>
          </template>
        </div>
      </div>
    </div>

    <QrModal :isOpen="showQrModal" :localNombre="local?.nombre || 'Mi Restaurante'" @close="showQrModal = false" />
  </div>
</template>

<style scoped>
.plus-btn {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: none;
  color: #fff;
  background: #009EE3;
  font-size: 22px;
  line-height: 1;
  padding: 0;
  flex-shrink: 0;
}

.remove-btn {
  padding: 0;
  background: none;
  border: none;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn img {
  width: 30px;
  height: 30px;
  display: block;
}

.conteo-row {
  margin-bottom: 6px;
}

.conteo-row__labels {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.5fr 30px;
  gap: 4px;
  margin-bottom: 2px;
}

.conteo-row--pagos .conteo-row__labels {
  grid-template-columns: 1fr 1.2fr 30px;
}

.conteo-row--pagos .conteo-row__inputs {
  grid-template-columns: 1fr 1.2fr 30px;
}

.conteo-row__labels span {
  font-size: 11px;
  color: #646c74;
}

.conteo-row__inputs {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.5fr 30px;
  gap: 4px;
  align-items: center;
}

.title-icon-img {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-right: 4px;
  margin-bottom: 3px;
}

.flow-section h6 {
  font-weight: 700;
  margin-bottom: 8px;
}

.chip-info {
  background: #e8f1f7;
  border-radius: 7px;
  padding: 8px;
  height: 100%;
}

.chip-info span {
  display: block;
  font-size: 12px;
  color: #0e96dc;
  font-weight: 700;
}

.chip-info strong {
  display: block;
  margin-top: 2px;
  font-size: 14px;
}

.saldo-value {
  background: #efefef;
  border-radius: 7px;
  padding: 8px;
  font-size: 15px;
  display: flex;
  align-items: center;
  height: 100%;
}

.cierre-table thead th {
  background: #e8f1f7;
  color: #0e96dc;
  border: 0;
  font-size: 12px;
}

.cierre-table tbody td {
  background: #efefef;
  border: 0;
  font-size: 13px;
}

.cierre-table .negativo {
  color: #c30000;
  font-weight: 700;
}

.total-box {
  border: 1px solid #0e96dc;
  border-radius: 10px;
  padding: 8px;
  text-align: center;
}

.total-box span {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: #0e96dc;
  text-transform: uppercase;
}

.total-box strong {
  display: block;
  font-size: 14px;
}

.total-box--negativo strong {
  color: #c30000;
}

.estado-chip {
  border-radius: 999px;
  padding: 1px 9px;
  font-size: 11px;
  line-height: 1.4;
  font-weight: normal;
}

.estado-chip--abierta {
  background: #f2dfe0;
  color: #8f4f4f;
}

.estado-chip--encierre {
  background: #faefbf;
  color: #7a5d00;
}

.estado-chip--cerrada {
  background: #d9e9c7;
  color: #41621e;
}

.option-icon {
  width: 28px;
  height: 28px;
  display: block;
}

/* Expand options menu wider to fit up to 3 circle icons */
.element-item--caja.active .element-item__options-menu {
  width: 108px;
}

.element-item--caja {
  align-items: flex-start;
  padding-top: .75rem;
  padding-bottom: .75rem;
}

.caja-item-body {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.caja-item-head {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.caja-num {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1d;
}

.caja-fecha {
  font-size: 11px;
  color: #646c74;
  margin-left: auto;
}

.caja-item-labels,
.caja-item-values {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1.5fr 1.5fr;
  gap: 0 2px;
}

.caja-item-labels span {
  font-size: 10px;
  color: #0e96dc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.caja-item-values span {
  font-size: 11px;
  color: #1e1e1e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
