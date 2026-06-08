<template>
    <div class="panel__content panel__content--items-content">
        <AppHeader
            title="Platos"
            description="Administra la carta de tu local"
        />

        <div class="panel__body" aria-label="Listado de platos">
            <DishFilters
                v-model:search="filters.search"
                @open-filters="showFilterModal = true"
            />

            <div class="table table--dishes">
                <div class="table-header">
                    <span>Estado</span>
                    <span>Imagen</span>
                    <span>Nombre</span>
                    <span>Precio</span>
                    <span>Acciones</span>
                </div>
            </div>

            <DishList
                :dishes="filteredDishes"
                :loading="isLoading"
                @edit="editDish"
                @delete="openDeleteModal"
                @toggle-status="toggleDishStatus"
            />
        </div>

        <footer class="panel__footer">
            <div class="panel__actions">
                <RouterLink
                    class="btn btn--primary btn--block"
                    to="/app/dishes/new">
                    Crear plato
                </RouterLink>
            </div>
            <DsSignature />
        </footer>

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
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/components/layout/AppHeader.vue'
import DsSignature from '@/components/DsSignature.vue'

import DishFilters from '@/components/dishes/DishFilters.vue'
import DishList from '@/components/dishes/DishList.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'

import { apiService } from '@/services/api.service'

const router = useRouter()

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

const showDeleteModal = ref(false)

const showFilterModal = ref(false)

const dishToDelete = ref(null)

/*
|--------------------------------------------------------------------------
| Filters
|--------------------------------------------------------------------------
*/

const filters = reactive({
    search: '',
    categories: [],
    recommended: true,
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

    /*
    |--------------------------------------------------------------------------
    | Search Filter
    |--------------------------------------------------------------------------
    */

    if (filters.search.trim()) {

        const query = filters.search.toLowerCase()

        result = result.filter(dish =>
            dish.nombre?.toLowerCase().includes(query) ||
            dish.descripcion?.toLowerCase().includes(query)
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
| Navigation
|--------------------------------------------------------------------------
*/

const editDish = (dish) => {

    router.push(
        `/app/dishes/edit/${dish.id}`
    )
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

        await apiService.delete(
            `platos/${dishToDelete.value.id}`
        )

        dishes.value = dishes.value.filter(
            item => item.id !== dishToDelete.value.id
        )

    } catch (error) {

        console.error(
            'Error deleting dish:',
            error
        )

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

        await apiService.put(
            `platos/${dish.id}`,
            {
                estado: newStatus,
            }
        )

        dish.estado = newStatus

    } catch (error) {

        console.error(
            'Error updating dish status:',
            error
        )
    }
}

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(() => {

    loadDishes()
})
</script>