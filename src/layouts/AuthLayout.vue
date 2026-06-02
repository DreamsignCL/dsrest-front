<template>
    <main class="layout-auth" :class="{ 'layout-auth--login': route.name === 'login' || route.name === 'forgot-password' }" role="main">
        <aside class="branding" aria-labelledby="branding-title">
            <div class="branding__content">
                <img class="branding__logo" :src="Logo" alt="dsRest" />

                <h2 id="branding-title" class="visually-hidden">
                    Con dsRest crea o modifica tu menú a solo un click de distancia
                </h2>
        
                <p class="branding__description">
                    Agiliza las decisiones de tus clientes al ordenar
                </p>
            </div>
        </aside>

        <div class="panel" aria-label="Panel de autenticación">
            <RouterView v-slot="{ Component }">
                <transition name="auth-fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </RouterView>
        </div>

        <BackgroundAnimation />

    </main>
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router'
import BackgroundAnimation from '@/components/BackgroundAnimation.vue'
import Logo from '@/assets/img/logo.svg'

const route = useRoute()
</script>