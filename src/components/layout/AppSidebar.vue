<template>
    <aside class="app-sidebar" aria-label="Navegación principal">
        <div class="app-sidebar__header">
            <BaseButton
                type="button"
                variant="primary"
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

            <div class="dropdown dropdown--main-menu" v-click-outside="closeMenu">
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
                @click="showLogoutModal = true">  
                Cerrar Sesión
            </BaseButton>
        </div>

        <ConfirmModal
            v-model="showLogoutModal"
            title="Cerrar sesión"
            message="¿Estás seguro que deseas cerrar sesión?"
            confirm-text="Si, cerrar"
            confirm-variant="primary"
            size="sm"
            @confirm="handleLogout"
        />
    </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, inject } from 'vue'
import Logo from '@/assets/img/logo.svg'
import { useDropdown } from '@/composables/useDropdown'
import MainMenu from '@/components/layout/MainMenu.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import { QrCode, Menu, X } from 'lucide-vue-next'

const router = useRouter()

const local = inject('currentLocal')

const { isOpen, toggleMenu, closeMenu } = useDropdown({
    closeOnRouteChange: true
})

const showLogoutModal = ref(false)

/*
------ LogOut Button Funcions--------------
*/

const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('local')

    router.push('/')
}

</script>