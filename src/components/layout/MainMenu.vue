<template>
    <nav class="main-menu" aria-label="Navegación principal">
        <ul>
            <li v-for="item in navigationItems" :key="item.route">
                <RouterLink
                    :to="item.route"
                    class="main-menu__link"
                    active-class="main-menu__link--active">
                    <component
                        :is="item.icon"
                        class="main-menu__icon"
                        :size="18"
                        aria-hidden="true"
                    />
        
                    <span>
                        {{ item.label }}
                    </span>
                </RouterLink>
            </li>
            <li>
                <button
                    class="main-menu__link"
                    type="button"
                    @click="handleLogout">  
                    <LogOut class="main-menu__icon" :size="18" aria-hidden="true" />
                    <span>Cerrar Sesión</span>
                </button>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import {
    LayoutDashboard,
    UtensilsCrossed,
    LogOut
} from 'lucide-vue-next'

const navigationItems = [
    {
        label: 'Dashboard',
        route: '/app/dashboard',
        icon: LayoutDashboard,
    },
    {
        label: 'Platos',
        route: '/app/dishes',
        icon: UtensilsCrossed,
    },
]

const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('local')

    window.location.href = '/'
}
</script>