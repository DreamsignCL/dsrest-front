<template>
    <AppContentHeader
        title="Mesas"
        description="Administra las mesas de tu local">
        <template #summary>

            <TableSummary
                :available="summary.available"
                :occupied="summary.occupied"
                :reserved="summary.reserved"
                :out-of-service="summary.outOfService"
            />

        </template>
    </AppContentHeader>

    <div class="app-content__body" aria-label="Listado de mesas">
        <section class="app-view app-view--list">
            <div class="app-view__toolbar">
                <AppListToolbar
                    v-model:search="search"
                    search-id="table-search"
                    search-placeholder="Buscar mesas..."
                    search-label="Buscar mesas"
                    :total="filteredTables.length"
                    total-label="mesas"
                    action-label="Crear mesa"
                    action-link="/app/tables/new"
                    @open-filters="openFiltersModal"
                />
            </div>

            <div class="app-view__content">
                <template v-if="isLoading">
                    <SkeletonCardListItem2 v-for="index in 6" :key="index" />
                </template>

                <div v-else-if="!filteredTables.length" class="app-view__empty">
                    No hay mesas registradas.
                </div>

                <AppListItem
                    v-for="table in filteredTables"
                    :key="table.id"
                    :show-switch="false"
                    class="list-item--table"
                    @edit="editTable(table)"
                    @delete="openDeleteModal(table)"
                    @toggle-status="toggleTableStatus(table)">

                    <template #content>
                        <TableItemContent :table="table" />
                    </template>
                </AppListItem>
            </div>
        </section>
    </div>

    <AppContentFooter>
        <template #actions>
            <RouterLink
                class="btn btn--primary btn--block"
                to="/app/tables/new">
                Crear mesa
            </RouterLink>
        </template>
    </AppContentFooter>

    <TableFiltersModal
        v-model="showFiltersModal"
        :filters="filters"
        :states="availableStates"
        :zones="availableZones"
        @apply="handleApplyFilters"
    />
</template>

<script setup>
import {ref, reactive, computed, inject,onMounted,} from 'vue'
import {useRouter,} from 'vue-router'
import AppContentHeader from '@/components/layout/AppContentHeader.vue'
import AppListToolbar from '@/components/layout/AppListToolbar.vue'
import AppListItem from '@/components/layout/AppListItem.vue'
import TableItemContent from '@/features/tables/TableItemContent.vue'
import AppContentFooter from '@/components/layout/AppContentFooter.vue'
import TableSummary from '@/components/tables/TableSummary.vue'
import TableFiltersModal from '@/features/tables/TableFiltersModal.vue'
import SkeletonCardListItem2 from '@/components/skeletons/SkeletonCardListItem2.vue'

import { apiService } from '@/services/api.service'

const router = useRouter()

const showFiltersModal = ref(false)

const search = ref('')

const filters = reactive({

    states: [],

    zones: [],

})

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

const tables = ref([])

const isLoading = ref(true)

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

const filteredTables = computed(() => {

    const term =
        search.value
            .trim()
            .toLowerCase()

    return tables.value.filter(table => {

        const matchesSearch =

            !term ||

            table.numero
                ?.toString()
                .includes(term)

            ||

            table.nombre
                ?.toLowerCase()
                .includes(term)

        const matchesState =

            !filters.states.length ||

            filters.states.includes(
                table.estado
            )

        const matchesZone =

            !filters.zones.length ||

            filters.zones.includes(
                table.zona_id
            )

        return (
            matchesSearch &&
            matchesState &&
            matchesZone
        )
    })
})

const summary = computed(() => {

    const result = {
        available: 0,
        occupied: 0,
        reserved: 0,
        outOfService: 0,
    }

    tables.value.forEach(table => {

        switch (
            table.estado?.toLowerCase()
        ) {

            case 'disponible':
                result.available++
                break

            case 'ocupada':
                result.occupied++
                break

            case 'reservada':
                result.reserved++
                break

            case 'fuera de servicio':
            case 'fuera_servicio':
                result.outOfService++
                break

        }

    })

    return result

})

const availableStates = [

    'disponible',

    'ocupada',

    'reservada',

    'fuera de servicio',

]

const availableZones = computed(() => {

    const zones = new Map()

    tables.value.forEach(table => {
        if (table.zona) {
            zones.set(
                table.zona.id,
                table.zona.nombre
            )
        }
    })

    return Array.from(
        zones,
        ([id, nombre]) => ({
            id,
            nombre,
        })
    )
})

/*
|--------------------------------------------------------------------------
| Tables
|--------------------------------------------------------------------------
*/

const loadTables = async () => {

    if (!local?.value?.id) {
        isLoading.value = false
        return
    }

    try {
        const response = await apiService.get(`mesas/local/${local.value.id}`)

        tables.value = response

    } catch (error) {
        console.error('Error loading tables:', error)

    } finally {
        isLoading.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Methods
|--------------------------------------------------------------------------
*/

const openFiltersModal = () => {
    showFiltersModal.value = true
}

const handleApplyFilters = filtersData => {
    Object.assign(
        filters,
        filtersData
    )

}

const editTable = table => {
    router.push(
        `/app/tables/edit/${table.id}`
    )

}

const openDeleteModal = table => {
    console.log('Eliminar', table)
}

const toggleTableStatus = table => {
    console.log('Estado', table)
}

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(() => {

    loadTables()

})
</script>