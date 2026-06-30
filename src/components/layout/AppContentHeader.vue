<template>
    <header class="app-content__header" aria-labelledby="page-title">
        <div class="app-content__top">
            <div class="app-content__heading">
                <h1 class="app-content__title">
                    <span v-if="beforeText">
                        {{ beforeText }}
                    </span>
                    {{ title }}
                </h1>

                <p v-if="description" class="app-content__description">
                    {{ description }}
                </p>
            </div>
            
            <div class="app-content__user-menu">
                <div
                    v-if="showUserMenu && user"
                    class="dropdown dropdown--user-info"
                    v-click-outside="closeMenu">

                    <BaseButton
                        type="button"
                        :aria-expanded="isOpen"
                        aria-haspopup="menu"
                        aria-controls="user-menu-dropdown"
                        :aria-label="
                            isOpen
                                ? 'Cerrar menú'
                                : 'Abrir menú'
                        "
                        @click="toggleMenu">

                        <img v-if="local?.foto" :src="local.foto" :alt="local?.nombreFantasia" />

                        <img v-else :src="NoLogo" :alt="local?.nombreFantasia" />

                    </BaseButton>

                    <transition name="dropdown">
                        <div
                            v-if="isOpen"
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
                                    <RouterLink to="profile">
                                        Editar perfil
                                    </RouterLink>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
        <div v-if="$slots.summary" class="app-content__summary">
            <slot name="summary" />
        </div>
    </header>
</template>

<script setup>
import { useDropdown } from '@/composables/useDropdown'
import { inject, computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import NoLogo from '@/assets/img/no-logo.png'

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

</script>