<template>
    <div class="panel__content">
        <AuthHeader
            title="Recuperar contraseña"
            description="Ingresa tu correo electrónico para continuar"
        />

        <div class="panel__body" aria-label="Formulario de recuperación de contraseña">
            <ForgotPasswordForm
                :form="form"
                :errors="errors"
                @update:form="Object.assign(form, $event)"
                @submit="handleSubmit"
            />
        </div>

         <footer class="panel__footer">
            <div class="panel__actions">
                <RouterLink class="btn btn--link" to="/">
                    <ArrowLeft :size="18" /> Volver al inicio de sesión
                </RouterLink>
            </div>
            <DsSignature />
        </footer>

        <BaseLoader v-if="isLoading" text="Enviando correo..." />

    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue'
import BaseLoader from '@/components/ui/BaseLoader.vue'
import DsSignature from '@/components/DsSignature.vue'
import {ArrowLeft} from 'lucide-vue-next'

const router = useRouter()

const isLoading = ref(false)

const form = reactive({
    email: '',
})

const errors = reactive({})

const validateForm = () => {

    errors.email = ''

    if (!form.email) {
        errors.email = 'Ingrese su correo electrónico'
        return false
    }

    return true
}

const handleSubmit = async () => {

    if (!validateForm()) return

    try {

        isLoading.value = true

        await fakeRequest()

        router.push({
            path: '/forgot-password/check-email',
            query: {
                email: form.email,
            },
        })

    } catch (error) {

        console.error(error)

    } finally {

        isLoading.value = false
    }
}

const fakeRequest = () => {

    return new Promise((resolve) => {
        setTimeout(resolve, 2000)
    })
}
</script>