<template>
    <div class="panel__content">
        <AppHeader
            :title="`Hola ${user?.nombre || ''}`"
            description="Este es el resumen de tu negocio"
        />

        <div class="panel__body" aria-label=""></div>

        <footer class="panel__footer">
            <div class="panel__actions">
                <RouterLink class="btn btn--link" to="/register">
                    Crear cuenta
                </RouterLink>
        
                <RouterLink class="btn btn--link" to="/forgot-password">
                    ¿Olvidaste tu contraseña?
                </RouterLink>
            </div>
            <DsSignature />
        </footer>
    </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import DsSignature from '@/components/DsSignature.vue'
import { inject } from 'vue'

const user = inject('currentUser')

</script>