<template>
    <AppContentHeader
        title="Nuevo plato"
        description="Completa la información del plato"
    />
    
    <div class="app-content__body" aria-label="Crear nuevo plato">
        <section class="app-view app-view--form">
            <DishForm
                :form="form"
                :categories="categories"
                :errors="errors"
                @update:form="Object.assign(form, $event)"
                @image-error="handleImageError"
                @submit="openConfirmModal"
            />
        </section>
    </div>

    <AppContentFooter>
        <template #actions>
            <RouterLink to="/app/dishes" class="btn btn--outline-primary">Volver</RouterLink>

            <BaseButton
                type="submit"
                variant="primary"
                form="dish-form"
                :disabled="isLoading">
                Crear plato
            </BaseButton>
        </template>
    </AppContentFooter>
    
    <ConfirmModal
        v-model="showConfirmModal"
        title="Crear plato"
        :message="`¿Deseas crear el plato <strong>'${form.name}</strong>'?`"
        confirm-text="Crear plato"
        cancel-text="Cancelar"
        confirm-variant="primary"
        @confirm="createDish"
    />

    <BaseLoader v-if="isLoading" text="Guardando plato..." />
</template>

<script setup>
import { ref, reactive, inject, onMounted, } from 'vue'
import { useRouter } from 'vue-router'
import { useFile } from '@/composables/useFile'
import { useToast } from '@/composables/useToast'
import AppContentHeader from '@/components/layout/AppContentHeader.vue'
import DishForm from '@/components/dishes/DishForm.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AppContentFooter from '@/components/layout/AppContentFooter.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import BaseLoader from '@/components/ui/BaseLoader.vue'

import { apiService } from '@/services/api.service'

const { showToast } = useToast()

const router = useRouter()

const showConfirmModal = ref(false)

const openConfirmModal = () => {
    if (!validateForm()) return

    showConfirmModal.value = true
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

const handleImageError = message => {

    if (!message) {
        delete errors.image

        return
    }

    errors.image = message

    showToast({
        message,
        variant: 'error',
        showIcon: true,
    })
}

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

    console.log('VALIDANDO FORM')

    Object.keys(errors).forEach(
        key => delete errors[key]
    )

    if (!form.name?.trim()) {
        errors.name = 'Debes ingresar un nombre'
    }

    if (!form.categoryId) {
        errors.categoryId = 'Debes seleccionar una categoría'
    }

    if (
        !form.price ||
        Number(form.price) <= 0
    ) {
        errors.price = 'Debes ingresar un precio válido'
    }

    if (
        Object.keys(errors).length
    ) {

        console.log('ERRORS', errors)

        showToast({
            message: Object.values(errors)[0],
            variant: 'error',
            showIcon: true,
        })

        return false
    }

    return true
}

/*
|--------------------------------------------------------------------------
| Create Dish
|--------------------------------------------------------------------------
*/

const createDish = async () => {

    console.log(
        'CREATE DISH START'
    )

    if (!validateForm()) {
        return
    }

    showConfirmModal.value = false

    isLoading.value = true

    try {
        let image = null

        if (form.image) {
            image = await fileToBase64(
                form.image
            )

            console.log(
                'BASE64 LENGTH',
                image.length
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
            precio_comparacion: form.comparePrice
                ? Number(form.comparePrice)
                : null,
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