<template>
    <aside class="app-sidebar" aria-label="Navegación principal">
        <div class="app-sidebar__header">
            <BaseButton
                type="button"
                variant="primary"
                @click="toggleMenu"
                aria-label="Abrir modal QR">  
                <QrCode :size="24" aria-hidden="true" />
            </BaseButton>

            <div class="logo">
                <div class="logo__image logo__image--dsrest">
                    <img :src="Logo" alt="dsRest" />
                </div>
                <div class="logo__image logo__image--client">
                    <img v-if="local?.foto" :src="local.foto" :alt="local?.nombreFantasia" />
                </div>
            </div>

            <div class="dropdown dropdown--main-menu">
                <BaseButton
                    type="button"
                    variant="primary"
                    :aria-expanded="isOpen"
                    aria-haspopup="menu"
                    aria-controls="main-menu-dropdown"
                    :aria-label="isOpen ? 'Cerrar menú' : 'Abrir menú'" 
                    @click="toggleMenu">
                    <component
                        :is="isOpen ? X : Menu"
                        :size="24"
                        aria-hidden="true"
                    />
                </BaseButton>

                <transition name="dropdown">
                    <div 
                        v-if="isOpen"
                        id="main-menu-dropdown"
                        class="dropdown__menu"
                        role="menu">
                        <MainMenu @navigate="closeMenu" />
                    </div>
                </transition>
            </div>
        </div>

        <div class="app-sidebar__body">
            <MainMenu />
        </div>

        <div class="app-sidebar__footer">
            <BaseButton
                type="button"
                variant="outline-white"
                block
                @click="handleLogout">  
                Cerrar Sesión
            </BaseButton>
        </div>
    </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted, inject } from 'vue'
import Logo from '@/assets/img/logo.svg'
import MainMenu from '@/components/layout/MainMenu.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { QrCode, Menu, X } from 'lucide-vue-next'

const router = useRouter()

const local = inject('currentLocal')

/*
------ LogOut Button Funcions--------------
*/

const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('local')

    router.push('/')
}

/*
------ Dropdown Funcions--------------
*/

const isOpen = ref(false)

const toggleMenu = () => {
    isOpen.value = !isOpen.value
}

const closeMenu = () => {
    isOpen.value = false
}

const handleEscape = (event) => {
    if (event.key === 'Escape') {
        closeMenu()
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
})

</script>