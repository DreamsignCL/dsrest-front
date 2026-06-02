<template>
    <div class="panel__content">
        <AuthHeader
            title="¡Contraseña actualizada!"
            description="Tu contraseña fue actualizada correctamente."
        />

        <div class="panel__body" aria-label="Contraseña actualizada con éxito">
            <div class="auth-status__icon auth-status__icon--success">
                <CircleCheckBig :size="42" />
            </div>

            <p class="auth-status__description">
                Tu contraseña fue actualizada correctamente.
            </p>

        </div>

        <footer class="panel__footer">
            <div class="panel__actions">
                <RouterLink class="btn btn--secondary btn--block" to="/">
                    Iniciar sesión
                </RouterLink>
            </div>
            <DsSignature />
        </footer>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import {CircleCheckBig} from 'lucide-vue-next'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import DsSignature from '@/components/DsSignature.vue'
</script>