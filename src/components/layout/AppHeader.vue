<template>
    <header class="panel__header" aria-labelledby="page-title">
        <div class="panel__header-content">
            <div>
                <h1 id="page-title">
                    {{ title }}
                </h1>

                <p v-if="description">
                    {{ description }}
                </p>
            </div>

            <div v-if="showUserMenu && user" class="dropdown dropdown--user-info">
                <BaseButton
                    type="button"
                    :aria-expanded="isOpen"
                    aria-haspopup="menu"
                    aria-controls="user-menu-dropdown"
                    :aria-label="isOpen ? 'Cerrar menú' : 'Abrir menú'" 
                    @click="toggleMenu">
                    <img v-if="local?.foto" :src="local.foto" :alt="local?.nombreFantasia" />
                </BaseButton>

                <transition name="dropdown">
                    <div 
                        v-if="isOpen"
                        id="user-menu-dropdown"
                        class="dropdown__menu"
                        role="menu">
                        <div class="user-card">
                            <div class="user-card__item">
                                <span>Nombre:</span>
                                {{ user.nombre }}
                            </div>
                            <div class="user-card__item">
                                <span>Rol:</span>
                                {{ currentRole }}
                            </div>
                            <div class="user-card__item">
                                <span>Local:</span>
                                {{ local.nombreFantasia }}
                            </div>
                        </div>
                        <nav>
                            <ul>
                                <li>
                                    <RouterLink to="editar-perfil">Editar perfil</RouterLink>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </transition>
            </div>

        </div>

    </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject, computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
    title: {
        type: String,
        default: '',
    },

    description: {
        type: String,
        default: '',
    },

    showUserMenu: {
        type: Boolean,
        default: true,
    },
})

const user = inject('currentUser')
const local = inject('currentLocal')

const currentRole = computed(() => {

    if (!user?.value || !local?.value) {
        return ''
    }

    const role = user.value.usuarioRolesLocales?.find(
        item => item.localId === local.value.id
    )

    return role?.rol?.nombre ?? ''
})

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