<template>
    <div class="panel__content panel__content--items-content">
        <AppHeader
            title="Atención a clientes"
            description="Administra los pedidos de tu local">

            <template #summary>
                <OrdersSummary :orders="filteredOrders" />
            </template>

        </AppHeader>

        <div class="panel__body">
            <OrderFilters
                v-model:search="filters.search"
                @open-filters="openFiltersModal"
            />

            <OrderFiltersModal
                v-model="showFiltersModal"
                :filters="filters"
                :zones="zones"
                :supports-zones="supportsZones"
                @apply="handleApplyFilters"
            />

            <BaseResultsCounter
                :count="filteredOrders.length"
                label="pedidos"
            />

           <OrderList
                :orders="filteredOrders"
                :loading="isLoading"
            />

        </div>

        <footer class="panel__footer">
            <div class="panel__actions">
                <RouterLink
                    class="btn btn--primary btn--block"
                    to="/app/orders/new">
                    Nuevo pedido
                </RouterLink>
            </div>
            <DsSignature />
        </footer>
    </div>
</template>

<script setup>
import { ref, reactive, computed, inject, onMounted, } from 'vue'
import { useBusinessRules } from '@/composables/useBusinessRules'
import AppHeader from '@/components/layout/AppHeader.vue'
import OrdersSummary from '@/components/orders/OrdersSummary.vue'
import DsSignature from '@/components/DsSignature.vue'
import OrderFilters from '@/components/orders/OrderFilters.vue'
import OrderFiltersModal from '@/components/orders/OrderFiltersModal.vue'
import BaseResultsCounter from '@/components/ui/BaseResultsCounter.vue'
import OrderList from '@/components/orders/OrderList.vue'

import { apiService } from '@/services/api.service'

const { rules } = useBusinessRules()

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

    return rules.value.usesZones
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

    if (rules.value.usesZones) {
        loadZones()
    }
})
</script>