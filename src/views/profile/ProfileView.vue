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
                @click="handleSave">
                Guardar
            </BaseButton>
        </template>
    </AppContentFooter>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { RouterLink } from 'vue-router'

import AppContentHeader from '@/components/layout/AppContentHeader.vue'
import AppContentFooter from '@/components/layout/AppContentFooter.vue'

import BaseTabs from '@/components/ui/BaseTabs.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

import ProfileSummary from '@/components/profile/ProfileSummary.vue'
import ProfilePersonalForm from '@/components/profile/ProfilePersonalForm.vue'
import ProfileBusinessForm from '@/components/profile/ProfileBusinessForm.vue'

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

const form = reactive({
    nombre: '',
    telefono: '',
    password: '',
    passwordConfirmation: '',

    nombreFantasia: '',
    logo: null,
    direccion: '',
    tipoNegocio: '',

    usaMesas: 'no',
    usaNombreCliente: 'si',
})

const handleSave = () => {

    console.log(
        'Guardar perfil',
        form
    )
}
</script>