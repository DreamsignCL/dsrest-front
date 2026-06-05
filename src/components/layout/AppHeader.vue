<template>
    <header class="panel__header" aria-labelledby="page-title">
        <div class="panel__header-content">
            <h1 id="page-title">
                <span v-if="beforeText">{{ beforeText }}</span>
                {{ title }}
            </h1>

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
                        v-click-outside="closeMenu"
                        id="user-menu-dropdown"
                        class="dropdown__menu"
                        role="menu">
                        <div class="user-info">
                            <div class="user-info__item">
                                {{ local.nombreFantasia }}
                            </div>
                            <div class="user-info__item">
                                <span>{{ currentRole }}</span>
                                {{ user.nombre }}
                            </div>
                            <div class="user-info__footer">
                                <RouterLink to="editar-perfil">Editar perfil</RouterLink>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

        </div>

    </header>
</template>

<script setup>
import { useDropdown } from '@/composables/useDropdown'
import { inject, computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const {
    isOpen,
    toggleMenu,
    closeMenu
} = useDropdown()

const props = defineProps({
    title: {
        type: String,
        default: '',
    },

    beforeText: {
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

</script>