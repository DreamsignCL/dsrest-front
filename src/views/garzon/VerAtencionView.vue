<template>
  <div class="page page--backoffice">
    <InnerHeader />
    <main>
      <div class="page-content page-content--backoffice-order-details">
        <div class="page-content__header">
          <div class="user-logo">
            <div class="user-logo__image">
              <img v-if="local?.foto" :src="local.foto" alt="Logo del Local" />
              <img v-else src="../../assets/img/no-logo.png" alt="Sin logo" />
            </div>
          </div>

          <div class="title">
            <h2>Detalle del pedido</h2>
            <div v-if="pedido" class="tag">{{ pedido.estado || '-' }}</div>
          </div>
        </div>

        <div class="page-content__body">
          <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <template v-else-if="pedido">
            <div class="details">
              <div class="details__item">
                <img
                  src="../../assets/img/file-icon.svg"
                  alt="Boleta"
                  class="details__item__icon"
                />
                <div class="details__item__content">
                  <strong>Pedido: #{{ pedido.id }}</strong>
                  <span>Mesa: {{ pedido.mesa?.nombre || 'N/A' }}</span>
                </div>
              </div>
              <div class="details__item">
                <img
                  src="../../assets/img/user-icon-blue.svg"
                  alt="Garzon"
                  class="details__item__icon"
                />
                <div class="details__item__content">
                  <strong>Atendido:</strong>
                  <span>{{ pedido.usuario?.nombre || '-' }}</span>
                </div>
              </div>
              <div class="details__item">
                <img
                  src="../../assets/img/calendar-icon.svg"
                  alt="Fecha"
                  class="details__item__icon"
                />
                <div class="details__item__content">
                  <strong>Fecha hora:</strong>
                  <span>{{ formatearFecha(pedido.createdAt) }}</span>
                </div>
              </div>
            </div>

            <h5>Platos agregados:</h5>
            <div class="element-list">
              <div
                v-for="plato in platosDelPedido"
                :key="plato.menu_item_id"
                class="element-item element-item--added-dishes"
              >
                <div
                  class="element-item__image"
                  :style="{
                    backgroundImage: plato.foto
                      ? 'url(' + plato.foto + ')'
                      : 'url(assets/no-image.png)',
                  }"
                ></div>
                <div class="element-item__text2">
                  <span>Nombre:</span><br />
                  <strong>{{ plato.nombre }}</strong>
                </div>
                <div class="element-item__price">
                  <span>Precio:</span><br />
                  <strong class="current-price"
                    >${{ (Number(plato.precioUnitario) || 0).toLocaleString() }}</strong
                  >
                </div>
                <div class="element-item__text2">
                  <span>Cantidad:</span><br />
                  <strong>x{{ plato.quantity }}</strong>
                </div>
              </div>
            </div>

            <div class="sell-resume">
              <h3>Resumen de venta</h3>
              <div v-if="pago" class="sell-resume__item">
                <span>Total neto:</span>
                <span>${{ Number(pago.totalNeto ?? pago.subtotalPedido).toLocaleString() }}</span>
              </div>
              <div v-if="pago?.iva != null" class="sell-resume__item">
                <span>IVA ({{ pago.tasaIva ?? 19 }}%):</span>
                <span>${{ Number(pago.iva).toLocaleString() }}</span>
              </div>
              <div v-if="pago?.totalAfecto != null" class="sell-resume__item">
                <span>Total afecto:</span>
                <span>${{ Number(pago.totalAfecto).toLocaleString() }}</span>
              </div>
              <div v-if="pago?.propinaPagada > 0" class="sell-resume__item">
                <span
                  >Propina<template v-if="pago.porcentajePropina">
                    ({{ pago.porcentajePropina }}%)</template
                  >:</span
                >
                >
                <span>${{ Number(pago.propinaPagada).toLocaleString() }}</span>
              </div>
              <div class="sell-resume__item">
                <span>TOTAL PAGADO:</span>
                <strong>${{ Number(pago?.totalAPagar ?? 0).toLocaleString() }}</strong>
              </div>
            </div>

            <div v-if="pago" class="payment-info">
              <h3>Informacion de pago</h3>
              <div class="payment-info__items">
                <div class="payment-info__item">
                  <img
                    src="../../assets/img/money-icon.svg"
                    alt="Monto"
                    class="details__item__icon"
                  />
                </div>
                <div class="payment-info__item">
                  <span>Medio de pago:</span>
                  <strong>{{ pago.tipoPago?.nombre || '-' }}</strong>
                </div>
                <div class="payment-info__item">
                  <span>Monto pagado:</span>
                  <strong>${{ Number(pago.montoPagado).toLocaleString() }}</strong>
                </div>
                <div v-if="pago.vuelto != null" class="payment-info__item">
                  <span>Vuelto:</span>
                  <strong>${{ Number(pago.vuelto).toLocaleString() }}</strong>
                </div>
              </div>
            </div>

            <div v-if="pago?.propinaPagada > 0" class="alert alert--primary">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.75 0C4.37402 0 0 4.37402 0 9.75C0 15.126 4.37402 19.5 9.75 19.5C15.126 19.5 19.5 15.126 19.5 9.75C19.5 4.37402 15.126 0 9.75 0ZM9.75 1.5C14.3145 1.5 18 5.18555 18 9.75C18 14.3145 14.3145 18 9.75 18C5.18555 18 1.5 14.3145 1.5 9.75C1.5 5.18555 5.18555 1.5 9.75 1.5ZM9 5.25V6.75H10.5V5.25H9ZM9 8.25V14.25H10.5V8.25H9Z"
                  fill="currentColor"
                />
              </svg>
              <span
                >Incluye propina<template v-if="pago.porcentajePropina">
                  del {{ pago.porcentajePropina }}%</template
                >
                ${{ Number(pago.propinaPagada).toLocaleString() }}</span
              >
            </div>
          </template>

          <div v-else-if="!isLoading" class="text-center py-5 text-muted">
            No se encontro el pedido.
          </div>
        </div>

        <div v-if="!isLoading && pedido" class="form-container">
          <div class="form-container__footer">
            <button class="btn btn-outline-primary rounded-pill w-100" @click="volver">
              Volver
            </button>
            <button class="btn btn-primary rounded-pill w-100" @click="imprimir">Imprimir</button>
          </div>
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

const platosDelPedido = computed(() => {
  if (!pedido.value?.detalles) return []
  return pedido.value.detalles.map((det) => ({
    menu_item_id: det.menu_item_id,
    nombre: det.plato?.nombre || '-',
    precioUnitario: Number(det.unit_price) || 0,
    quantity: det.quantity,
    foto: det.plato?.foto || null,
  }))
})

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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
