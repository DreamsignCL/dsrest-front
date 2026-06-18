<template>
    <main class="layout-app" role="main">
        <AppSidebar />

        <div class="app-content" aria-label="Contenido">
            <RouterView v-slot="{ Component }">
                <component :is="Component" />
            </RouterView>
        </div>
    </main>
</template>

<script setup>
import { provide } from 'vue'
import { RouterView } from 'vue-router'
import { useCurrentUser } from '@/composables/useCurrentUser'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const {
    user,
    local,
    token,
} = useCurrentUser()

provide('currentUser', user)
provide('currentLocal', local)
provide('currentToken', token)
</script>