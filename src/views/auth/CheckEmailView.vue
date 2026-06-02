<template>
    <div class="panel__content">
        <AuthHeader
            title="Revisa tu correo"
            description="Te enviamos un enlace de verificación para activar tu cuenta"
        />

        <div class="panel__body" aria-label="Verificación de correo">
            <div class="verify-email-card">
                <div class="verify-email-card__icon">
                    <Mail :size="100" />
                </div>

                <p class="verify-email-card__text">
                    Hemos enviado un correo de verificación a:
                </p>

                <strong class="verify-email-card__email">
                    {{ email }}
                </strong>

                <p class="verify-email-card__helper">
                    Debes verificar tu correo antes de continuar.
                </p>

                <p
                    v-if="message"
                    class="verify-email-card__message"
                    :class="{
                        'is-error': isError,
                        'is-success': !isError,
                    }">
                    {{ message }}
                </p>

            </div>
        </div>

        <footer class="panel__footer">
            <div class="panel__actions">
                <BaseButton
                    variant="secondary"
                    block
                    :disabled="isLoading"
                    @click="handleResendEmail">
                    Reenviar correo
                </BaseButton>

                <RouterLink class="btn btn--link" to="/">
                    <ArrowLeft :size="18" /> Volver al inicio de sesión
                </RouterLink>
            </div>
            <DsSignature />
        </footer>

        <BaseLoader v-if="isLoading" text="Reenviando correo..." />

    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import AuthHeader from '@/components/auth/AuthHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseLoader from '@/components/ui/BaseLoader.vue'
import DsSignature from '@/components/DsSignature.vue'
import {Mail, ArrowLeft} from 'lucide-vue-next'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
*/

const route = useRoute()

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const isLoading = ref(false)

const message = ref('')

const isError = ref(false)

/*
|--------------------------------------------------------------------------
| Data
|--------------------------------------------------------------------------
*/

const email = computed(() => route.query.email || 'correo@empresa.cl')

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

const handleResendEmail = async () => {

    try {

        isLoading.value = true

        message.value = ''

        isError.value = false

        /*
        |--------------------------------------------------------------------------
        | API RESEND EMAIL
        |--------------------------------------------------------------------------
        |
        | await authService.resendVerification(email.value)
        |
        */

        await new Promise(resolve => setTimeout(resolve, 1200))

        message.value = 'Correo reenviado correctamente'

    } catch (error) {

        console.error(error)

        isError.value = true

        message.value = 'No pudimos reenviar el correo'

    } finally {

        isLoading.value = false
    }
}
</script>