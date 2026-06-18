<template>
    <AppContentHeader
        title="Atención a clientes"
        description="Administra los pedidos de tu local">

        <template #summary>
            <OrdersSummary :orders="filteredOrders" />
        </template>
    </AppContentHeader>

    <div class="app-content__body" aria-label="Listado de pedidos">
        <section class="app-view app-view--list">
            <div class="app-view__toolbar">
                <AppListToolbar
                    v-model:search="filters.search"
                    search-id="order-search"
                    search-placeholder="Buscar pedidos..."
                    search-label="Buscar pedidos"
                    :total="filteredOrders.length"
                    total-label="pedidos"
                    action-label="Crear pedido"
                    action-link="/app/orders/new"
                    @open-filters="openFiltersModal">

                    <template #table-header>
                        <div class="table-header">
                            <span>N°</span>
                            <span>Cliente</span>
                            <span>Mesa</span>
                            <span>Garzón</span>
                            <span>Total</span>
                            <span>Estado</span>
                        </div>
                    </template>

                </AppListToolbar>
            </div>

            <div class="app-view__content">
                <template v-if="isLoading">
                    <SkeletonCardListItem2 v-for="index in 6" :key="index" />
                </template>

                <div v-else-if="!filteredOrders.length" class="app-view__empty">
                    No hay pedidos registrados.
                </div>

                <div class="app-view__list">
                    <AppListItem
                        v-for="order in filteredOrders"
                        :key="order.id"
                        :show-switch="false"
                        class="list-item--order"
                        @edit="editOrder(order)"
                        @delete="openDeleteModal(order)"
                        @toggle-status="toggleOrderStatus(order)">

                        <template #content>
                            <OrderItemContent :order="order" />
                        </template>
                    </AppListItem>
                </div>
            </div>
        </section>
    </div>

    <AppContentFooter>
        <template #actions>
            <RouterLink
                class="btn btn--primary btn--block"
                to="/app/orders/new">
                Crear pedido
            </RouterLink>
        </template>
    </AppContentFooter>

    <OrderFiltersModal
        v-model="showFiltersModal"
        :filters="filters"
        :zones="zones"
        :supports-zones="supportsZones"
        @apply="handleApplyFilters"
    />
</template>

<script setup>
import { ref, reactive, computed, inject, onMounted, } from 'vue'
import { useBusinessConfig } from '@/composables/useBusinessConfig'
import AppContentHeader from '@/components/layout/AppContentHeader.vue'
import OrdersSummary from '@/components/orders/OrdersSummary.vue'
import AppListToolbar from '@/components/layout/AppListToolbar.vue'
import SkeletonCardListItem2 from '@/components/skeletons/SkeletonCardListItem2.vue'
import AppListItem from '@/components/layout/AppListItem.vue'
import AppContentFooter from '@/components/layout/AppContentFooter.vue'
import OrderFiltersModal from '@/features/orders/OrderFiltersModal.vue'
import OrderItemContent from '@/features/orders/OrderItemContent.vue'

import { apiService } from '@/services/api.service'

const { config } = useBusinessConfig()

/*
|--------------------------------------------------------------------------
| Current Local
|--------------------------------------------------------------------------
*/

const local = inject('currentLocal')

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const isLoading = ref(true)

const orders = ref([])

const zones = ref([])

const showFiltersModal = ref(false)

/*
|--------------------------------------------------------------------------
| Filters
|--------------------------------------------------------------------------
*/

const filters = reactive({
    search: '',
    statuses: [],
    zoneId: '',
    sortBy: 'date',
    sortDirection: 'desc',
    dateFrom: '',
    dateTo: '',
})

/*
|--------------------------------------------------------------------------
| Local Type
|--------------------------------------------------------------------------
*/

const supportsZones = computed(() => {
    return config.value.usesZones
})

/*
|--------------------------------------------------------------------------
| Filters Modal
|--------------------------------------------------------------------------
*/

const openFiltersModal = () => {
    showFiltersModal.value = true
}

const handleApplyFilters = newFilters => {
    Object.assign(filters,newFilters)
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const parseOrderDate = dateString => {

    if (!dateString) {
        return null
    }

    const [
        day,
        month,
        year,
    ] = dateString.split('-')

    return new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    )
}

const parseInputDate = dateString => {

    if (!dateString) {
        return null
    }

    const [
        year,
        month,
        day,
    ] = dateString.split('-')

    return new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    )
}

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

const filteredOrders = computed(() => {

    let result = [...orders.value]

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if (filters.search.trim()) {

        const query =
            filters.search.toLowerCase()

        result = result.filter(
            order =>

                String(
                    order.numeroPedido || ''
                        )
                        .toLowerCase()
                        .includes(query)

                        ||

                        String(
                            order.nombreCliente || ''
                        )
                        .toLowerCase()
                        .includes(query)

                        ||

                        String(
                            order.garzon || ''
                        )
                        .toLowerCase()
                        .includes(query)

                        ||

                        String(
                            order.mesa || ''
                        )
                        .toLowerCase()
                        .includes(query)
                )
            }

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    if (filters.statuses.length) {

        result = result.filter(
            order =>
                filters.statuses.includes(
                    order.estado?.toLowerCase()
                )
        )
    }

    /*
    |--------------------------------------------------------------------------
    | Zone
    |--------------------------------------------------------------------------
    */

    if (filters.zoneId) {

        result = result.filter(
            order =>
                order.zonaId ===
                filters.zoneId
        )
    }

    /*
    |--------------------------------------------------------------------------
    | Date Range
    |--------------------------------------------------------------------------
    */

    if (filters.dateFrom) {

        const fromDate =
            parseInputDate(
                filters.dateFrom
            )

        fromDate.setHours(
            0,
            0,
            0,
            0
        )

        result = result.filter(order => {

            const orderDate =
                parseOrderDate(
                    order.fecha
                )

            return (
                orderDate &&
                orderDate >= fromDate
            )
        })
    }

    if (filters.dateTo) {

        const toDate =
            parseInputDate(
                filters.dateTo
            )

        toDate.setHours(
            23,
            59,
            59,
            999
        )

        result = result.filter(order => {

            const orderDate =
                parseOrderDate(
                    order.fecha
                )

            return (
                orderDate &&
                orderDate <= toDate
            )
        })
    }

    /*
    |--------------------------------------------------------------------------
    | Sorting
    |--------------------------------------------------------------------------
    */

    result.sort((a, b) => {

        let comparison = 0

        switch (filters.sortBy) {

            case 'total':

                comparison =
                    Number(a.total || 0)
                    -
                    Number(b.total || 0)

                break

            case 'date':

            default:

                comparison =
                    Number(a.id)
                    -
                    Number(b.id)

                break
        }

        return filters.sortDirection === 'desc'
            ? comparison * -1
            : comparison
    })

    return result
})

/*
|--------------------------------------------------------------------------
| Orders
|--------------------------------------------------------------------------
*/

const loadOrders = async () => {
    if (!local?.value?.id) {
        isLoading.value = false
        return
    }

    try {
        const response = await apiService.get(`pedidos/porlocal/${local.value.id}`)

        orders.value = response

    } catch (error) {
        console.error('Error loading orders:', error)

    } finally {
        isLoading.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Zones
|--------------------------------------------------------------------------
*/

const loadZones = async () => {
    if (!local?.value?.id) {
        return
    }

    try {
        const response = await apiService.get(`zonas?localId=${local.value.id}`)

        zones.value = response

    } catch (error) {
        console.error('Error loading zones:', error)
    }
}

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(() => {

    loadOrders()

    if (config.value.usesZones) {
        loadZones()
    }
})
</script>