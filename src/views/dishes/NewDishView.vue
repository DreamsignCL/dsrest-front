<template>
    <div class="panel__content">
        <AppHeader
            title="Nuevo plato"
            description="Completa la información del plato"
        />

        <div class="panel__body">
            <DishForm
                :form="form"
                :categories="categories"
                :errors="errors"
                @update:form="Object.assign(form, $event)"
                @submit="openCreateModal"
            />
        </div>

        <footer class="panel__footer">
            <div class="panel__actions">
                <RouterLink to="/app/dishes" class="btn btn--outline-primary">Volver</RouterLink>

                <BaseButton
                    type="submit"
                    variant="primary"
                    form="dish-form"
                    :disabled="isLoading">
                    Crear plato
                </BaseButton>
            </div>
            <DsSignature />
        </footer>

        <ConfirmModal
            v-model="showCreateModal"
            title="Crear plato"
            :message="`¿Deseas crear el plato <strong>'${form.name}</strong>'?`"
            confirm-text="Crear plato"
            cancel-text="Cancelar"
            confirm-variant="primary"
            @confirm="createDish"
        />

        <BaseLoader v-if="isLoading" text="Guardando plato..." />
    </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, } from 'vue'
import { useRouter } from 'vue-router'
import { useFile } from '@/composables/useFile'
import AppHeader from '@/components/layout/AppHeader.vue'
import DishForm from '@/components/dishes/DishForm.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import BaseLoader from '@/components/ui/BaseLoader.vue'
import DsSignature from '@/components/DsSignature.vue'

import { apiService } from '@/services/api.service'

const router = useRouter()

const showCreateModal = ref(false)

const openCreateModal = () => {
    if (!validateForm()) return

    showCreateModal.value = true
}

const { fileToBase64,} = useFile()

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

const isLoading = ref(false)

const categories = ref([])

const errors = reactive({})

const form = reactive({
    name: '',
    description: '',
    image: null,
    categoryId: '',
    price: '',
    comparePrice: '',
    recommended: false,
})

/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
*/

const loadCategories = async () => {

    if (!local?.value?.id) {
        return
    }

    try {

        const response = await apiService.get(
            `categorias-plato?localId=${local.value.id}`
        )

        categories.value = response

    } catch (error) {

        console.error(
            'Error loading categories:',
            error
        )
    }
}

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

const validateForm = () => {

    Object.keys(errors).forEach(
        key => delete errors[key]
    )

    if (!form.name.trim()) {
        errors.name = 'Debes ingresar un nombre'
    }

    if (!form.categoryId) {
        errors.categoryId = 'Debes seleccionar una categoría'
    }

    if (!form.price || Number(form.price) <= 0) {
        errors.price = 'Debes ingresar un precio válido'
    }

    return Object.keys(errors).length === 0
}

/*
|--------------------------------------------------------------------------
| Create Dish
|--------------------------------------------------------------------------
*/

const createDish = async () => {

    if (!validateForm()) {
        return
    }

    showCreateModal.value = false

    isLoading.value = true

    try {
        let image = null

        if (form.image) {
            image = await fileToBase64(
                form.image
            )
        }

        if (!local?.value?.id) {
            console.error(
                'Local not found'
            )

            return
        }

        const payload = {
            nombre: form.name,
            descripcion: form.description,
            foto: image,
            precio: Number(form.price),
            precio_comparacion: form.comparePrice ? Number(form.comparePrice): null,
            categoriaPlatoId: Number(form.categoryId),
            localId: local.value.id,
            recomendacion_chef: form.recommended,
        }
        
        await apiService.post('platos', payload)

        router.push('/app/dishes')

    } catch (error) {
        console.error(
            'Error creating dish:',
            error
        )
    } finally {
        isLoading.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(() => {
    loadCategories()
})
</script>