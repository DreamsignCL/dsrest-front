<template>
    <div 
        class="card card-item card-item--order"         
        :class="{ active: isOpen, disabled: !order.estado }"
        ref="card"
        :aria-label="`Pedido ${order.numeroPedido}`"
        v-click-outside="closeMenu">

        <!-- Button trigger -->
        <div 
            ref="trigger"
            class="card__trigger"
            :aria-expanded="isOpen"
            aria-haspopup="menu"
            :aria-controls="menuId"
            :aria-label="isOpen ? 'Cerrar menú' : 'Abrir menú'" 
            role="button" 
            tabindex="0"
            @click="toggleMenu">

            <div class="card__data card__data--header">
                <h3 class="order-card__title">
                    Pedido #{{ order.numeroPedido }}
                </h3>

                <span class="badge" :class="statusClass">
                    {{ order.estado }}
                </span>
            </div>
            <div class="card__data card__data--waiter">
                Garzón: {{ order.garzon }}
            </div>
            <div class="card__data card__data--content">
                <div class="card__info">
                    <span>Ubicación:</span>
                    <p> {{ order.ubicacion }} </p>
                </div>

                <div class="card__info">
                    <span>Mesa:</span>
                    <p> {{ order.mesa }}</p>
                </div>

                <div class="card__info">
                    <span>Fecha:</span>
                    <p> {{ order.fecha }}</p>
                </div>

                <div class="card__info card__info--price">
                    <span>Total:</span>
                    <strong> ${{ formattedTotal }}</strong>
                </div>
            </div>

            <div class="card__data card__data--footer">
                <div class="card__info card__info--hour">
                    <Clock3 :size="18" aria-hidden="true" /> {{ order.hora }}
                </div>

                <div class="card__info card__info--actions">
                    <div class="ellipsis"></div>
                </div>
            </div>
        </div>

        <!-- Card options -->
        <div 
            ref="menu"
            :id="menuId"
            class="card__options"
            role="menu">

            <button 
                class="btn-action btn-action--edit"
                role="menuitem"
                aria-label="Editar elemento"
                @click="$emit('edit')">
                <Pencil :size="18" aria-hidden="true" />
            </button>

            <button 
                class="btn-action btn-action--delete"
                role="menuitem"
                aria-label="Eliminar elemento"
                @click="$emit('delete')">
                <Trash2 :size="18" aria-hidden="true" />
            </button>

            <button 
                class="btn-action btn-action--close"
                role="menuitem"
                aria-label="Cerrar menú"
                @click="closeMenu">
                <X :size="18" aria-hidden="true" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDropdown } from '@/composables/useDropdown'
import { Pencil, Trash2, X, Clock3} from 'lucide-vue-next'

const props = defineProps({
    order: {
        type: Object,
        required: true,
    },
})

const menuId = `order-menu-${props.order.id}`

const { isOpen, toggleMenu, closeMenu } = useDropdown({
    closeOnRouteChange: true
})

const formattedTotal = computed(() => {
    return Number(
        props.order.total || 0
    ).toLocaleString(
        'es-CL'
    )
})

const statusClass = computed(() => {

    const status =
        props.order.estado?.toLowerCase()

    switch (status) {

        case 'pendiente':
            return 'badge--warning'

        case 'en preparación':
        case 'preparacion':
            return 'badge--info'

        case 'listo':
            return 'badge--success'

        case 'servido':
            return 'badge--success'

        case 'pagado':
            return 'badge--success'

        case 'cancelado':
            return 'badge--danger'

        default:
            return 'badge--neutral'
    }
})
</script>