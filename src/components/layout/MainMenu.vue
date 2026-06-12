<template>
    <nav class="main-menu" aria-label="Navegación principal">
        <ul>
            <li v-for="item in filteredNavigationItems" :key="item.route">
                <RouterLink
                    :to="item.route"
                    class="main-menu__link"
                    active-class="main-menu__link--active"
                    @click="emit('navigate')">
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
                    @click="emit('logout')">  
                    <LogOut class="main-menu__icon" :size="18" aria-hidden="true" />
                    <span>Cerrar Sesión</span>
                </button>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { computed } from 'vue'
import { usePermissions } from '@/composables/usePermissions'
import { useBusinessRules } from '@/composables/useBusinessRules'
import {
    LayoutDashboard,
    UtensilsCrossed,
    Users,
    Wallet,
    UserCog,
    TableProperties,
    Map,
    Tags,
    LogOut,
} from 'lucide-vue-next'

const {hasRole, hasCategory,} = usePermissions()
const { rules } = useBusinessRules()

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
        roles: ['Administrador'],
    },

    {
        label: 'Atención Clientes',
        route: '/app/orders',
        icon: Users,
        roles: ['Administrador'],
    },

    {
        label: 'Atención Clientes',
        route: '/garzon',
        icon: Users,
        roles: ['Garzon'],
    },

    {
        label: 'Caja',
        route: '/caja',
        icon: Wallet,
        roles: ['Administrador'],
        categories: [
            'Categoria 2',
            'Categoria 3',
            'Categoria 4',
        ],
    },

    {
        label: 'Garzones',
        route: '/usuarios',
        icon: UserCog,
        roles: ['Administrador'],
    },

    {
        label: 'Mesas',
        route: '/mesas',
        icon: TableProperties,
        roles: ['Administrador'],
        requiresTables: true,
    },

    {
        label: 'Zonas',
        route: '/zonas',
        icon: Map,
        roles: ['Administrador'],
        categories: [
            'Categoria 3',
            'Categoria 4',
        ],
        requiresTables: true,
    },

    {
        label: 'Categorías',
        route: '/categorias',
        icon: Tags,
        roles: ['Administrador'],
    },
]

const filteredNavigationItems = computed(() => {
    return navigationItems.filter(item => {
        
        const tablesAllowed =
            !item.requiresTables ||
            rules.value.usesTables
        
        const roleAllowed =
            !item.roles ||
            item.roles.some(role => hasRole(role))

        const categoryAllowed =
            !item.categories ||
            item.categories.some(category => hasCategory(category))

        return (
            roleAllowed &&
            categoryAllowed &&
            tablesAllowed
        )
    })
})

const emit = defineEmits([
    'navigate',
    'logout',
])

</script>