<template>
    <AppContentHeader
        title="Editar mesa"
        description="Modifica la información de la mesa">

        <template #summary>
            <div class="summary summary--edit-table">
                <div class="summary__item">
                    <span
                        class="badge"
                        :class="statusClass">
                        {{ statusLabel }}
                    </span>
                </div>
            </div>
        </template>
    </AppContentHeader>

    <div class="app-content__body" aria-label="Editar mesa">
        <section class="app-view app-view--form">

            <TableForm
                :form="form"
                :zones="zones"
                :errors="errors"
                :show-status="true"
                @update:form="Object.assign(form, $event)"
                @submit="openConfirmModal"
            />
        </section>
    </div>

    <AppContentFooter>
        <template #actions>
            <RouterLink class="btn btn--outline-primary" to="/app/tables">Volver</RouterLink>

            <BaseButton
                type="submit"
                variant="primary"
                form="table-form"
                :disabled="isLoading">
                Guardar
            </BaseButton>
        </template>
    </AppContentFooter>

    <ConfirmModal
        v-model="showConfirmModal"
        title="Actualizar mesa"
        :message="`¿Deseas guardar los cambios en la mesa <strong>#${form.numero}</strong>?`"
        confirm-text="Si, guardar"
        cancel-text="Cancelar"
        confirm-variant="primary"
        @confirm="updateTable"
    />

    <BaseLoader v-if="isLoading" text="Actualizando mesa..." />
</template>

<script setup>
import {ref, computed, reactive, inject, onMounted,} from 'vue'
import {useRoute, useRouter,} from 'vue-router'
import { useToast } from '@/composables/useToast'
import AppContentHeader from '@/components/layout/AppContentHeader.vue'
import AppContentFooter from '@/components/layout/AppContentFooter.vue'
import TableForm from '@/components/tables/TableForm.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseLoader from '@/components/ui/BaseLoader.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'

import { apiService } from '@/services/api.service'

const router = useRouter()

const route = useRoute()

const { showToast } = useToast()

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

const showConfirmModal = ref(false)

const zones = ref([])

const errors = reactive({})

const form = reactive({
    numero: '',
    nombre: '',
    capacidad: '',
    zona_id: '',
    estado: 'disponible',
})

/*
|--------------------------------------------------------------------------
| Zones
|--------------------------------------------------------------------------
*/

const loadZones = async () => {
    try {
        const response =
            await apiService.get(
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
| Table
|--------------------------------------------------------------------------
*/

const loadTable = async () => {

    isLoading.value = true

    try {
        const response =
            await apiService.get(
                `mesas/${route.params.id}`
            )

        Object.assign(
            form,
            {

                numero:
                    response.numero,

                nombre:
                    response.nombre,

                capacidad:
                    response.capacidad,

                zona_id:
                    response.zona_id,

                estado:
                    response.estado,

            }
        )

    } catch (error) {

        console.error(
            'Error loading table:',
            error
        )

        showToast({

            message: 'No fue posible cargar la mesa.',

            variant: 'error',

            showIcon: true,

        })

        router.push('/app/tables')

    } finally {
        isLoading.value = false
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

        errors.numero = 'Debes ingresar un número de mesa'

    }

    if (
        !form.capacidad ||
        Number(form.capacidad) <= 0
    ) {

        errors.capacidad = 'Debes ingresar una capacidad válida'

    }

    if (!form.zona_id) {

        errors.zona_id =  'Debes seleccionar una zona'

    }

    if (!form.estado) {

        errors.estado =  'Debes seleccionar un estado'

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
| Update Table
|--------------------------------------------------------------------------
*/

const openConfirmModal = () => {

    if (!validateForm()) {
        return
    }

    showConfirmModal.value = true

}

const updateTable = async () => {

    if (!validateForm()) {
        return
    }

    showConfirmModal.value = false

    isLoading.value = true

    try {

        const payload = {

            local_id:
                local.value.id,

            zona_id:
                Number(form.zona_id),

            nombre:
                form.nombre || null,

            numero:
                Number(form.numero),

            capacidad:
                Number(form.capacidad),

            estado:
                form.estado,

            activo: true,

        }

        await apiService.put(

            `mesas/${route.params.id}`,

            payload

        )

        showToast({

            message: 'Mesa actualizada correctamente.',

            variant: 'success',

            showIcon: true,

        })

        router.push('/app/tables')

    } catch (error) {

        console.error(
            'Error updating table:',
            error
        )

        showToast({

            message: 'No fue posible actualizar la mesa.',

            variant: 'error',

            showIcon: true,

        })

    } finally {

        isLoading.value = false

    }

}

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

const statusClass = computed(() => {

    switch (form.estado?.toLowerCase()) {

        case 'disponible':
            return 'badge--success'

        case 'ocupada':
            return 'badge--warning'

        case 'reservada':
            return 'badge--info'

        case 'fuera_servicio':
            return 'badge--danger'

        default:
            return 'badge--neutral'

    }

})

const statusLabel = computed(() => {

    switch (form.estado?.toLowerCase()) {

        case 'disponible':
            return 'Disponible'

        case 'ocupada':
            return 'Ocupada'

        case 'reservada':
            return 'Reservada'

        case 'fuera_servicio':
            return 'Fuera de servicio'

        default:
            return form.estado

    }

})

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(async () => {

    await loadZones()

    await loadTable()

})

</script>