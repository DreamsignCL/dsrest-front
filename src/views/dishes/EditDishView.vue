<template>
    <div class="panel__content">
        <AppHeader
            title="Editar plato"
            description="Actualiza la información del plato"
        />

        <div class="panel__body">

            <SkeletonViewFormImage v-if="isLoadingDish" />

            <DishForm
                v-else
                :form="form"
                :categories="categories"
                :errors="errors"
                @update:form="Object.assign(form, $event)"
                @submit="openUpdateModal"
            />

        </div>

        <footer class="panel__footer">

            <div class="panel__actions">

                <RouterLink
                    to="/app/dishes"
                    class="btn btn--outline-primary">
                    Volver
                </RouterLink>

                <BaseButton
                    type="submit"
                    variant="primary"
                    form="dish-form"
                    :disabled="isSubmitting">
                    Guardar cambios
                </BaseButton>
            </div>

            <DsSignature />

        </footer>

        <ConfirmModal
            v-model="showUpdateModal"
            title="Actualizar plato"
            :message="`¿Deseas actualizar el plato '${form.name}'?`"
            confirm-text="Guardar cambios"
            cancel-text="Cancelar"
            confirm-variant="primary"
            @confirm="updateDish"
        />

        <BaseLoader
            v-if="isSubmitting"
            text="Actualizando plato..."
        />
    </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, } from 'vue'
import { useRoute, useRouter, } from 'vue-router'
import { useFile } from '@/composables/useFile'
import AppHeader from '@/components/layout/AppHeader.vue'
import SkeletonViewFormImage from '@/components/skeletons/SkeletonViewFormImage.vue'
import DishForm from '@/components/dishes/DishForm.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseLoader from '@/components/ui/BaseLoader.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import DsSignature from '@/components/DsSignature.vue'

import { apiService } from '@/services/api.service'

const route = useRoute()
const router = useRouter()

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

const isLoadingDish = ref(true)

const isSubmitting = ref(false)

const showUpdateModal = ref(false)

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

    return (
        Object.keys(errors).length === 0
    )
}

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
        const response = await apiService.get(`categorias-plato?localId=${local.value.id}`)

        categories.value = response

    } catch (error) {
        console.error('Error loading categories:', error)
    }
}

/*
|--------------------------------------------------------------------------
| Dish
|--------------------------------------------------------------------------
*/

const loadDish = async () => {

    try {

        const dish = await apiService.get(`platos/${route.params.id}`)

        form.name = dish.nombre || ''

        form.description = dish.descripcion || ''

        form.image = dish.foto || null

        form.categoryId = dish.categoriaPlatoId || ''

        form.price = dish.precio || ''

        form.comparePrice = dish.precio_comparacion || ''

        form.recommended = dish.recomendacion_chef || false

    } catch (error) {

        console.error('Error loading dish:', error)

    } finally {
        isLoadingDish.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Update Dish
|--------------------------------------------------------------------------
*/

const openUpdateModal = () => {

    if (!validateForm()) {
        return
    }

    showUpdateModal.value = true
}

const updateDish = async () => {

    if (isSubmitting.value) {
        return
    }

    if (!validateForm()) {
        return
    }

    showUpdateModal.value = false

    isSubmitting.value = true

    try {

        let image = form.image

        if (form.image && form.image instanceof File) {
            image = await fileToBase64(
                form.image
            )
        }

        const payload = {
            nombre: form.name,
            descripcion: form.description,

            foto: image,

            precio: Number(
                form.price
            ),

            precio_comparacion:
                form.comparePrice
                    ? Number(
                        form.comparePrice
                    )
                    : null,

            categoriaPlatoId:
                Number(
                    form.categoryId
                ),

            localId:
                local.value.id,

            recomendacion_chef:
                form.recommended,
        }

        await apiService.put(
            `platos/${route.params.id}`,
            payload
        )

        router.push(
            '/app/dishes'
        )

    } catch (error) {

        console.error(
            'Error updating dish:',
            error
        )

    } finally {

        isSubmitting.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(async () => {

    await Promise.all([
        loadCategories(),
        loadDish(),
    ])
})
</script>