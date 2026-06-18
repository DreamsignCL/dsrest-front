<template>
    <AppContentHeader
        title="Platos"
        description="Administra la carta de tu local"
    />

    <div class="app-content__body" aria-label="Listado de platos">
        <section class="app-view app-view--list">
            <div class="app-view__toolbar">
                <AppListToolbar
                    v-model:search="filters.search"
                    search-id="dish-search"
                    search-placeholder="Buscar platos..."
                    search-label="Buscar platos"
                    :total="filteredDishes.length"
                    total-label="platos"
                    action-label="Crear plato"
                    action-link="/app/dishes/new"
                    @open-filters="openFiltersModal">

                    <template #table-header>
                        <div class="table-header">
                            <span>Estado</span>
                            <span>Imagen</span>
                            <span>Nombre</span>
                            <span>Precio</span>
                            <span>Acciones</span>
                        </div>
                    </template>

                </AppListToolbar>
            </div>

            <div class="app-view__content">
                <template v-if="isLoading">
                    <SkeletonCardListItem  v-for="index in 6" :key="index" />
                </template>

                <div v-else-if="!filteredDishes.length" class="app-view__empty">
                    No hay platos registrados.
                </div>

                <div class="app-view__list">
                    <AppListItem
                        v-for="dish in filteredDishes"
                        :key="dish.id"
                        :enabled="dish.estado"
                        @edit="editDish(dish)"
                        @delete="openDeleteModal(dish)"
                        @toggle-status="toggleDishStatus(dish)">

                        <template #content>
                            <DishItemContent :dish="dish" />
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
                to="/app/dishes/new">
                Crear plato
            </RouterLink>
        </template>
    </AppContentFooter>

    <DishFiltersModal
        v-model="showFiltersModal"
        :filters="filters"
        :categories="categories"
        @apply="handleApplyFilters"
    />

    <ConfirmModal
        v-model="showDeleteModal"
        title="Eliminar plato"
        :message="`
            La siguiente acción no se puede deshacer.
            ¿Deseas eliminar ${dishToDelete?.nombre || 'este plato'}?
        `"
        confirm-text="Eliminar"
        cancel-text="Cancelar"
        confirm-variant="danger"
        @confirm="deleteDish"
    />
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import AppContentHeader from '@/components/layout/AppContentHeader.vue'
import AppListToolbar from '@/components/layout/AppListToolbar.vue'
import SkeletonCardListItem from '@/components/skeletons/SkeletonCardListItem.vue'
import AppListItem from '@/components/layout/AppListItem.vue'
import DishItemContent from '@/features/dishes/DishItemContent.vue'
import AppContentFooter from '@/components/layout/AppContentFooter.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import DishFiltersModal from '@/features/dishes/DishFiltersModal.vue'

import { apiService } from '@/services/api.service'

const router = useRouter()

const showFiltersModal = ref(false)

const openFiltersModal = () => {
    showFiltersModal.value = true
}

const handleApplyFilters = newFilters => {
    Object.assign(
        filters,
        newFilters
    )
}

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

const dishes = ref([])

const categories = ref([])

const showDeleteModal = ref(false)

const dishToDelete = ref(null)

/*
|--------------------------------------------------------------------------
| Filters
|--------------------------------------------------------------------------
*/

const filters = reactive({
    search: '',
    categories: [],
    recommended: false,
    sortBy: '',
    sortDirection: 'asc',
})

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

const filteredDishes = computed(() => {

    let result = [...dishes.value]

    result.sort(
        (a, b) => b.id - a.id
    )

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if (filters.search.trim()) {

        const query =
            filters.search.toLowerCase()

        result = result.filter(
            dish =>
                dish.nombre
                    ?.toLowerCase()
                    .includes(query) ||

                dish.descripcion
                    ?.toLowerCase()
                    .includes(query)
        )
    }

    /*
    |--------------------------------------------------------------------------
    | Categories
    |--------------------------------------------------------------------------
    */

    if (filters.categories.length) {
        result = result.filter(
            dish =>
                filters.categories.includes(
                    dish.categoriaPlatoId
                )
        )
    }

    /*
    |--------------------------------------------------------------------------
    | Sorting
    |--------------------------------------------------------------------------
    */

    if (filters.sortBy) {

        result.sort((a, b) => {

            let comparison = 0

            switch (filters.sortBy) {

                case 'name':
                    comparison = (a.nombre || '') .localeCompare( b.nombre || '')
                    break

                case 'price':
                    comparison = (a.precio || 0) - (b.precio || 0)
                    break

                case 'date':
                    comparison = new Date( a.createdAt ) - new Date( b.createdAt)
                    break
            }

            return filters.sortDirection === 'desc'
                ? comparison * -1
                : comparison
        })
    }

    /*
    |--------------------------------------------------------------------------
    | Recommended
    |--------------------------------------------------------------------------
    */

    if (filters.recommended) {
        result = result.filter(
            dish => dish.recomendacion_chef
        )
    }

    return result
})

/*
|--------------------------------------------------------------------------
| Load Dishes
|--------------------------------------------------------------------------
*/

const loadDishes = async () => {
    if (!local?.value?.id) {
        isLoading.value = false
        return
    }

    try {
        const response = await apiService.get(
            `platos/porlocal/${local.value.id}`
        )

        dishes.value = response

    } catch (error) {

        console.error('Error loading dishes:', error)

    } finally {
        isLoading.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Load Categories
|--------------------------------------------------------------------------
*/

const loadCategories = async () => {

    if (!local?.value?.id) return

    try {

        const response = await apiService.get(`categorias-plato?localId=${local.value.id}`)

        categories.value = response

    } catch (error) {
        console.error('Error loading categories:',error)
    }
}

/*
|--------------------------------------------------------------------------
| Navigation
|--------------------------------------------------------------------------
*/

const editDish = (dish) => {
    router.push(`/app/dishes/edit/${dish.id}`)
}

/*
|--------------------------------------------------------------------------
| Delete Dish
|--------------------------------------------------------------------------
*/

const openDeleteModal = (dish) => {
    dishToDelete.value = dish
    showDeleteModal.value = true
}

const deleteDish = async () => {
    if (!dishToDelete.value) return

    try {

        await apiService.delete(`platos/${dishToDelete.value.id}`)

        dishes.value = dishes.value.filter(
            item => item.id !== dishToDelete.value.id
        )

    } catch (error) {
        console.error('Error deleting dish:', error)

    } finally {
        showDeleteModal.value = false
        dishToDelete.value = null
    }
}

/*
|--------------------------------------------------------------------------
| Toggle Status
|--------------------------------------------------------------------------
*/

const toggleDishStatus = async (dish) => {

    const newStatus = !dish.estado

    try {

        await apiService.put(`platos/${dish.id}`,{ estado: newStatus,})

        dish.estado = newStatus

    } catch (error) {
        console.error('Error updating dish status:',error)
    }
}

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(() => {
    loadDishes()
    loadCategories()
})
</script>