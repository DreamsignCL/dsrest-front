<template>
    <AppContentHeader
        title="Mi perfil"
        description="Administra tu información personal y la configuración de tu negocio">

        <template #summary>
            <ProfileSummary
                :user-rut="userRut"
                :user-email="userEmail"
                :business-rut="businessRut"
                :business-name="businessName" 
            />
        </template>

    </AppContentHeader>

    <div class="app-content__body">
        <section class="app-view app-view--form">
            <div class="app-view__toolbar">
                <BaseTabs v-model="activeTab" :tabs="tabs" />
            </div>
            <div class="app-view__content">
                <ProfilePersonalForm v-if="activeTab === 'personal'" :form="form" />
    
                <ProfileBusinessForm v-if="activeTab === 'business'" :form="form" />
            </div>
        </section>
    </div>

    <AppContentFooter>
        <template #actions>
            <RouterLink
                to="/app/dashboard"
                class="btn btn--outline-primary">
                Volver
            </RouterLink>

            <BaseButton
                type="button"
                variant="primary"
                :disabled="isSubmitting"
                @click="handleSave">
                Guardar
            </BaseButton>
        </template>
    </AppContentFooter>

    <BaseLoader v-if="isSubmitting" text="Guardando cambios..." />
</template>

<script setup>
import { ref, reactive, computed,} from 'vue'
import { RouterLink } from 'vue-router'
import AppContentHeader from '@/components/layout/AppContentHeader.vue'
import AppContentFooter from '@/components/layout/AppContentFooter.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProfileSummary from '@/components/profile/ProfileSummary.vue'
import ProfilePersonalForm from '@/components/profile/ProfilePersonalForm.vue'
import ProfileBusinessForm from '@/components/profile/ProfileBusinessForm.vue'
import { apiService } from '@/services/api.service'
import { useFile } from '@/composables/useFile'
import { useToast } from '@/composables/useToast'
import BaseLoader from '@/components/ui/BaseLoader.vue'
import { useCurrentUser } from '@/composables/useCurrentUser'

const {
    user,
    local,
    updateUser,
    updateLocal,
} = useCurrentUser()

const userRut = computed(() =>
    user.value?.rut || ''
)

const userEmail = computed(() =>
    user.value?.correo || ''
)

const businessRut = computed(() =>
    local.value?.rut || ''
)

const businessName = computed(() =>
    local.value?.nombre || ''
)

const form = reactive({

    nombre:
        user.value?.nombre || '',

    telefono:
        user.value?.telefono || '',

    password: '',
    passwordConfirmation: '',

    nombreFantasia:
        local.value?.nombreFantasia || '',

    direccion:
        local.value?.direccion || '',

    tipoNegocio:
        local.value?.tipoNegocio || '',

    usaMesas:
        local.value?.usaMesas || 'no',

    usaNombreCliente:
        local.value?.usaNombreCliente || 'no',

    logo:
    local.value?.foto || null,
})

const activeTab = ref(
    'personal'
)

const tabs = [
    {
        label: 'Datos personales',
        value: 'personal',
    },
    {
        label: 'Datos del negocio',
        value: 'business',
    },
]

const { fileToBase64 } = useFile()

const { showToast } = useToast()

const isSubmitting = ref(false)

const handleSave = async () => {

    if (isSubmitting.value) {
        return
    }

    if (
        form.password &&
        form.password !==
        form.passwordConfirmation
    ) {

        showToast({
            message:
                'Las contraseñas no coinciden',
            variant: 'error',
            showIcon: true,
        })

        return
    }

    isSubmitting.value = true

    try {

        let image = form.logo

        if (
            form.logo &&
            form.logo instanceof File
        ) {
            image = await fileToBase64(
                form.logo
            )
        }

        const userPayload = {

            nombre:
                form.nombre,

            telefono:
                form.telefono,
        }

        if (form.password) {

            userPayload.contrasena =
                form.password
        }

        const localPayload = {

            nombre:
                local.value.nombre,

            nombreFantasia:
                form.nombreFantasia,

            direccion:
                form.direccion,

            tipo:
                form.tipoNegocio,

            foto:
                image,
        }

        const companyPayload = {

            tipoNegocio:
                form.tipoNegocio,

            usaMesas:
                form.usaMesas,

            usaNombreCliente:
                form.usaNombreCliente,
        }

        await apiService.put(
            `usuarios/${user.value.id}`,
            userPayload
        )

        await apiService.put(
            `locales/${local.value.id}`,
            localPayload
        )

        await apiService.put(
            `empresas/${local.value.empresaId}`,
            companyPayload
        )

        const updatedUser = {
            ...user.value,
            nombre: form.nombre,
            telefono: form.telefono,
        }

        const updatedLocal = {
            ...local.value,

            nombreFantasia:
                form.nombreFantasia,

            nombre:
                local.value.nombre,

            direccion:
                form.direccion,

            foto:
                image,

            tipo:
                form.tipoNegocio,

            tipoNegocio:
                form.tipoNegocio,

            usaMesas:
                form.usaMesas,

            usaNombreCliente:
                form.usaNombreCliente,
        }

        updateUser(updatedUser)

        updateLocal(updatedLocal)

        form.password = ''
        form.passwordConfirmation = ''

        showToast({
            message:
                'Perfil actualizado correctamente',
            variant: 'success',
            showIcon: true,
        })

    } catch (error) {

        console.error(
            'Error updating profile:',
            error
        )

        showToast({
            message:
                'No fue posible actualizar el perfil',
            variant: 'error',
            showIcon: true,
        })

    } finally {

        isSubmitting.value = false
    }
}
</script>