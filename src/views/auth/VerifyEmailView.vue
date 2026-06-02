<template>
    <div class="panel__content">
        <!-- Loading -->
        <template v-if="isLoading">
            <BaseLoader text="Verificando tu cuenta..." />
        </template>
        
        <!-- Success -->
        <template v-else-if="isSuccess">
            <AuthHeader
                title="¡Cuenta verificada!"
                description="Tu correo fue validado correctamente."
            />

            <div class="panel__body" aria-label="Correo verificado con éxito">
                <div class="auth-status__icon auth-status__icon--success">
                    <CircleCheckBig :size="42" />
                </div>

                <p class="auth-status__description">
                    Serás redirigido automáticamente...
                </p>     
            </div>
        </template>

        <!-- Error -->
        <template v-else>
            <AuthHeader
                title="¡Lo sentinmos!"
                description="No pudimos verificar tu cuenta."
            />

            <div class="panel__body" aria-label="Correo no verificado">
                <div class="auth-status__icon auth-status__icon--error">
                    <CircleX :size="42" />
                </div>

                <p class="auth-status__description">
                    {{ errorMessage }}
                </p>

                <div class="auth-status__actions">
                    <RouterLink  class="btn btn--secondary btn--block" to="/register/check-email">
                        Reenviar correo
                    </RouterLink>

                    <RouterLink  class="btn btn--link" to="/">
                        Volver al inicio
                    </RouterLink>
                </div>
            </div>
        </template>

        <footer class="panel__footer">
            <div class="panel__actions">
                <RouterLink  class="btn btn--secondary btn--block" to="/register/check-email">
                    Reenviar correo
                </RouterLink>

                <RouterLink  class="btn btn--link" to="/">
                    <ArrowLeft :size="18" /> Volver al inicio
                </RouterLink>
            </div>
            <DsSignature />
        </footer>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import BaseLoader from '@/components/ui/BaseLoader.vue'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import DsSignature from '@/components/DsSignature.vue'
import {CircleCheckBig,CircleX, ArrowLeft} from 'lucide-vue-next'

// import { apiService } from '@/services/api.service'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
*/

const route = useRoute()

const router = useRouter()

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const isLoading = ref(true)

const isSuccess = ref(false)

const errorMessage = ref('')

/*
|--------------------------------------------------------------------------
| Token
|--------------------------------------------------------------------------
*/

const token = String(route.params.token || '')

/*
|--------------------------------------------------------------------------
| Verify Email
|--------------------------------------------------------------------------
*/

const verifyEmail = async () => {

    try {

        /*
        |--------------------------------------------------------------------------
        | API VERIFY EMAIL
        |--------------------------------------------------------------------------
        |
        | Luego conectaremos backend real:
        |
        | const response = await apiService.post('/auth/verify-email', {
        |     token,
        | })
        |
        */

        await fakeRequest()

        /*
        |--------------------------------------------------------------------------
        | Simulación login automático
        |--------------------------------------------------------------------------
        */

        localStorage.setItem('token', 'fake-jwt-token')

        localStorage.setItem(
            'user',
            JSON.stringify({
                nombre: 'Usuario Demo',
            })
        )

        isSuccess.value = true

        /*
        |--------------------------------------------------------------------------
        | Redirect onboarding
        |--------------------------------------------------------------------------
        */

        setTimeout(() => {

            router.push({
                name: 'onboarding-local',
            })

        }, 2500)

    } catch (error) {

        console.error(error)

        errorMessage.value =
            'El enlace expiró o ya fue utilizado.'

    } finally {

        isLoading.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Fake Request
|--------------------------------------------------------------------------
*/

const fakeRequest = () => {

    return new Promise((resolve) => {
        setTimeout(resolve, 2500)
    })
}

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(() => {

    if (!token) {

        isLoading.value = false

        errorMessage.value = 'Token inválido.'

        return
    }

    verifyEmail()
})
</script>