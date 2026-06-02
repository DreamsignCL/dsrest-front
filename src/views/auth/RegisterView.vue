<template>
    <div class="panel__content">
        <AuthHeader
            title="Crear cuenta"
            description="Completa tus datos para comenzar"
        />
    
        <div class="panel__body" aria-label="Formulario de registro">
            <RegisterForm
                :form="registerForm"
                :errors="registerErrors"
                :is-loading="isLoading"
                @update:form="Object.assign(registerForm, $event)"
                @submit="handleRegister"
                @open-terms="isTermsModalOpen = true"
            />
        </div>
    
        <footer class="panel__footer">
            <div class="panel__actions">
                <BaseButton type="submit" variant="secondary" form="register-form" block>Crear cuenta</BaseButton>
                <RouterLink class="btn btn--link" to="/">
                    <ArrowLeft :size="18" /> Volver al inicio de sesión
                </RouterLink>
            </div>
            <DsSignature />
        </footer>
    
        <BaseLoader v-if="isLoading" text="Creando cuenta..." />
    
        <TermsAndConditionsModal
            v-model="isTermsModalOpen"
            @accepted="registerForm.acceptTerms = true"
        />
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import TermsAndConditionsModal from '@/components/auth/TermsAndConditionsModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseLoader from '@/components/ui/BaseLoader.vue'
import DsSignature from '@/components/DsSignature.vue'
import { useFormValidation } from '@/composables/useFormValidation'
import {ArrowLeft} from 'lucide-vue-next'

// import { apiService } from '@/services/api.service'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
*/

const router = useRouter()

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const isLoading = ref(false)

const isTermsModalOpen = ref(false)

/*
|--------------------------------------------------------------------------
| Form
|--------------------------------------------------------------------------
*/

const registerForm = reactive({
    nombre: '',
    rut: '',
    correo: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
})

/*
|--------------------------------------------------------------------------
| Errors
|--------------------------------------------------------------------------
*/

const registerErrors = reactive({})

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

const formValidation = useFormValidation()

/*
|--------------------------------------------------------------------------
| Handlers
|--------------------------------------------------------------------------
*/

const handleRegister = async () => {

    const {
        errors,
        isValid,
    } = formValidation.validateRegisterForm(registerForm)

    Object.assign(registerErrors, errors)

    if (!isValid) return

    try {

        isLoading.value = true

        /*
        |--------------------------------------------------------------------------
        | API REGISTER
        |--------------------------------------------------------------------------
        |
        | Aquí luego conectaremos el backend real.
        |
        | Ejemplo:
        |
        | await apiService.post('/auth/register', registerForm)
        |
        */

        await fakeRequest()

        router.push({
            name: 'check-email',
            query: {
                email: registerForm.correo,
            },
        })

    } catch (error) {

        console.error(error)

    } finally {

        isLoading.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Fake Request
|--------------------------------------------------------------------------
|
| Solo temporal mientras conectamos backend.
|
*/

const fakeRequest = () => {

    return new Promise((resolve) => {
        setTimeout(resolve, 2000)
    })
}

</script>