<template>
    <div class="auth-layout__content">
        <AuthHeader
            title="Revisa tu correo"
            description="Te enviamos un enlace para recuperar tu cuenta"
        />

        <div class="auth-body">
            <div class="verify-email-card">
                <div class="verify-email-card__icon">
                    <Mail :size="100" />
                </div>

                <p class="verify-email-card__text">
                    Enviamos un enlace de recuperación a:
                </p>

                <strong class="verify-email-card__email">
                    {{ email }}
                </strong>

                <p class="verify-email-card__helper">
                    Sigue las instrucciones del correo para restablecer tu contraseña.
                </p>
            </div>

            <div class="auth-actions">
                <RouterLink class="btn btn--link" to="/">
                    <ArrowLeft :size="18" /> Volver al inicio
                </RouterLink>
            </div>
        </div>

        <div class="auth-footer">
            <DsSignature />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import DsSignature from '@/components/DsSignature.vue'
import {Mail, ArrowLeft} from 'lucide-vue-next'

const route = useRoute()

const email = computed(() => route.query.email || '')
</script>