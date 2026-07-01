<template>
    <AppContentHeader
        title="Administración de mesas"
        description="Administra las mesas de tu local"
    />

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
                />
            </div>

            <div class="app-view__content">
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
</template>

<script setup>
import {ref,computed,inject,onMounted,} from 'vue'
import AppContentHeader from '@/components/layout/AppContentHeader.vue'
import AppListToolbar from '@/components/layout/AppListToolbar.vue'
import AppListItem from '@/components/layout/AppListItem.vue'
import TableItemContent from '@/features/tables/TableItemContent.vue'
import AppContentFooter from '@/components/layout/AppContentFooter.vue'

import { apiService } from '@/services/api.service'

const search = ref('')

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

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

const filteredTables = computed(() => {

    if (!search.value.trim()) {
        return tables.value
    }

    const term = search.value.toLowerCase()

    return tables.value.filter(table => {

        return (
            table.numero
                ?.toString()
                .includes(term)

            ||

            table.nombre
                ?.toLowerCase()
                .includes(term)
        )
    })
})

/*
|--------------------------------------------------------------------------
| Tables
|--------------------------------------------------------------------------
*/

const loadTables = async () => {

    if (!local?.value?.id) {
        return
    }

    try {

        const response = await apiService.get(
            `mesas/local/${local.value.id}`
        )

        tables.value = response

    } catch (error) {

        console.error(
            'Error loading tables:',
            error
        )

    }

}

const editTable = table => {
    console.log('Editar', table)
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