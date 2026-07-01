<template>
    <AppContentHeader
        title="Nueva mesa"
        description="Completa la información de la mesa"
    />

    <div class="app-content__body" aria-label="Crear nueva mesa">
        <section class="app-view app-view--form">
            <TableForm
                :form="form"
                :zones="zones"
                :errors="errors"
                @update:form="Object.assign(form, $event)"
                @submit="openCreateModal"
            />
        </section>
    </div>

    <AppContentFooter>
        <template #actions>
            <RouterLink to="/app/tables" class="btn btn--outline-primary">Volver</RouterLink>

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
        v-model="showCreateModal"
        title="Crear mesa"
        :message="`¿Deseas crear la mesa <strong>${form.number}</strong>?`"
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
import { ref, reactive, onMounted,} from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import AppContentHeader from '@/components/layout/AppContentHeader.vue'
import AppContentFooter from '@/components/layout/AppContentFooter.vue'
import TableForm from '@/components/tables/TableForm.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseLoader from '@/components/ui/BaseLoader.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'

import { apiService } from '@/services/api.service'

const { showToast } = useToast()

const router = useRouter()

const local = inject('currentLocal')

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const showCreateModal = ref(false)

const isLoading = ref(false)

const zones = ref([])

const errors = reactive({})

const form = reactive({
    number: '',
    name: '',
    capacity: '',
    zoneId: '',
})

/*
|--------------------------------------------------------------------------
| Zones
|--------------------------------------------------------------------------
*/

const loadZones = async () => {

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

    if (!form.number) {
        errors.number =
            'Debes ingresar un número'
    }

    if (
        !form.capacity ||
        Number(form.capacity) <= 0
    ) {
        errors.capacity =
            'Debes ingresar una capacidad válida'
    }

    if (!form.zoneId) {
        errors.zoneId =
            'Debes seleccionar una zona'
    }

    if (Object.keys(errors).length) {

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
| Create Table
|--------------------------------------------------------------------------
*/

const openCreateModal = () => {

    if (!validateForm()) {
        return
    }

    showCreateModal.value = true

}

const createTable = async () => {

    showCreateModal.value = false

    isLoading.value = true

    try {

        if (!local?.value?.id) {

            console.error(
                'Local not found'
            )

            return

        }

        const payload = {

            nombre:
                form.name.trim() || null,

            numero:
                Number(form.number),

            capacidad:
                Number(form.capacity),

            zona_id:
                Number(form.zoneId),

            activo: true,

            estado: 'disponible',

            local_id:
                local.value.id,

        }

        await apiService.post(
            'mesas',
            payload
        )

        router.push('/app/tables')

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