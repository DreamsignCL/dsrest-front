<template>
    <main class="layout-app" role="main">
        <AppSidebar />

        <div class="content" aria-label="Contenido">
            <RouterView v-slot="{ Component }">
                <transition name="auth-fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </RouterView>
        </div>
    </main>
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const route = useRoute()
</script>