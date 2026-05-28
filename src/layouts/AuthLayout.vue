<template>
  <div class="auth-layout">

    <aside class="auth-layout__hero">
      <img class="auth-layout__logo" :src="Logo" alt="dsRest" />

      <p class="auth-layout__subtitle">
        Tu plataforma de gestión de menú para tu local de comida
      </p>
    </aside>

    <main role="main">
        <RouterView v-slot="{ Component }">
            <transition name="auth-fade" mode="out-in">
                <component :is="Component" />
            </transition>
        </RouterView>
    </main>

    <BackgroundAnimation />

  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import BackgroundAnimation from '@/components/BackgroundAnimation.vue'
import Logo from '@/assets/img/logo.svg'
</script>