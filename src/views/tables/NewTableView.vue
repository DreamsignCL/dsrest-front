<template>
    <AppContentHeader
        title="Nueva mesa"
        description="Completa la información de la mesa"
    />

    <div
        class="app-content__body"
        aria-label="Crear nueva mesa">

        <section class="app-view app-view--form">

            <TableForm
                :form="form"
                :zones="zones"
                :errors="errors"
                @update:form="
                    Object.assign(
                        form,
                        $event
                    )
                "
                @submit="openConfirmModal"
            />

        </section>

    </div>

    <AppContentFooter>

        <template #actions>

            <RouterLink
                to="/app/tables"
                class="btn btn--outline-primary">

                Volver

            </RouterLink>

            <BaseButton
                type="submit"
                variant="primary"
                form="table-form"
                :disabled="isLoading">

                Crear mesa

            </BaseButton>

        </template>

    </AppContentFooter>

    <ConfirmModal
        v-model="showConfirmModal"
        title="Crear mesa"
        :message="`¿Deseas crear la mesa <strong>#${form.numero}</strong>?`"
        confirm-text="Crear mesa"
        cancel-text="Cancelar"
        confirm-variant="primary"
        @confirm="createTable"
    />

    <BaseLoader
        v-if="isLoading"
        text="Guardando mesa..."
    />
</template>

<script setup>
import {
    ref,
    reactive,
    inject,
    onMounted,
} from 'vue'

import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

import AppContentHeader from '@/components/layout/AppContentHeader.vue'
import AppContentFooter from '@/components/layout/AppContentFooter.vue'

import TableForm from '@/components/tables/TableForm.vue'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseLoader from '@/components/ui/BaseLoader.vue'

import ConfirmModal from '@/components/modals/ConfirmModal.vue'

import { apiService } from '@/services/api.service'

const router = useRouter()

const { showToast } = useToast()

/*
|--------------------------------------------------------------------------
| Current Local
|--------------------------------------------------------------------------
*/

const local = inject(
    'currentLocal'
)

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const isLoading = ref(false)

const showConfirmModal = ref(false)

const zones = ref([])

const errors = reactive({})

const form = reactive({

    numero: '',

    nombre: '',

    capacidad: '',

    zona_id: '',

})

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

        const response = await apiService.get(
            'zonas'
        )

        zones.value = response

    } catch (error) {

        console.error(
            'Error loading zones:',
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

    if (!form.numero) {
        errors.numero =
            'Debes ingresar un número de mesa'
    }

    if (
        !form.capacidad ||
        Number(form.capacidad) <= 0
    ) {

        errors.capacidad =
            'Debes ingresar una capacidad válida'

    }

    if (!form.zona_id) {

        errors.zona_id =
            'Debes seleccionar una zona'

    }

    if (
        Object.keys(errors).length
    ) {

        showToast({

            message:
                Object.values(errors)[0],

            variant: 'error',

            showIcon: true,

        })

        return false

    }

    return true

}

/*
|--------------------------------------------------------------------------
| Create Table
|--------------------------------------------------------------------------
*/

const openConfirmModal = () => {

    if (!validateForm()) {
        return
    }

    showConfirmModal.value = true

}

const createTable = async () => {

    if (!validateForm()) {
        return
    }

    showConfirmModal.value = false

    isLoading.value = true

    try {

        const payload = {

            numero:
                Number(form.numero),

            nombre:
                form.nombre || null,

            capacidad:
                Number(form.capacidad),

            estado:
                'disponible',

            activo:
                true,

            zona_id:
                Number(form.zona_id),

            local_id:
                local.value.id,

        }

        await apiService.post(
            'mesas',
            payload
        )

        router.push(
            '/app/tables'
        )

    } catch (error) {

        console.error(
            'Error creating table:',
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

    loadZones()

})
</script>