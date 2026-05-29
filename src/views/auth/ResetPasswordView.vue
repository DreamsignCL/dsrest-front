<template>
    <div class="auth-layout__content">

        <AuthHeader
            title="Nueva contraseña"
            description="Ingresa tu nueva contraseña"
        />

        <div class="auth-body">

            <ResetPasswordForm
                :form="form"
                :errors="errors"
                @update:form="Object.assign(form, $event)"
                @submit="handleSubmit"
            />

        </div>

        <BaseLoader v-if="isLoading" text="Actualizando contraseña..." />

        <div class="auth-footer">
            <DsSignature />
        </div>

    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm.vue'
import BaseLoader from '@/components/ui/BaseLoader.vue'
import DsSignature from '@/components/DsSignature.vue'

const router = useRouter()

const isLoading = ref(false)

const form = reactive({
    password: '',
    confirmPassword: '',
})

const errors = reactive({})

const validateForm = () => {

    errors.password = ''
    errors.confirmPassword = ''

    if (!form.password) {
        errors.password = 'Ingrese una contraseña'
    }

    if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden'
    }

    return !errors.password && !errors.confirmPassword
}

const handleSubmit = async () => {

    if (!validateForm()) return

    try {

        isLoading.value = true

        await fakeRequest()

        router.push('/reset-password/success')

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