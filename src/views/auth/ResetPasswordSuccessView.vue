<template>
    <div class="auth-layout__content">

        <div class="auth-body">

            <div class="auth-status">

                <div class="auth-status__icon auth-status__icon--success">
                    ✅
                </div>

                <h1 class="auth-layout__title">
                    Contraseña actualizada
                </h1>

                <p class="auth-status__description">
                    Tu contraseña fue actualizada correctamente.
                </p>

                <RouterLink
                    class="btn btn--secondary btn--block"
                    to="/"
                >
                    Iniciar sesión
                </RouterLink>

            </div>

        </div>

        <div class="auth-footer">
            <DsSignature />
        </div>

    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import DsSignature from '@/components/DsSignature.vue'
</script>