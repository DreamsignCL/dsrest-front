<template>
    <div 
        class="card card-item card-item--dish"         
        :class="{ active: isOpen, disabled: !dish.estado }"
        ref="card" 
        v-click-outside="closeMenu">

        <div class="card__switch">
            <label class="switch switch--vertical">
                <input 
                    type="checkbox"
                    :checked="dish.estado"
                    @change="$emit('toggle-status')" />
                <span class="slider round"></span>
            </label>
        </div>

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

            <div class="card__image">
                <img v-if="dish.foto" :src="dish.foto" :alt="dish.nombre">
    
                <div v-else class="card__placeholder">
                    Sin imagen
                </div>

                <ChefHat v-if="dish.recomendacion_chef" :size="18" class="card__featured" />
            </div>

            <div class="card__info">
                <h3 class="title hide-long-text">{{ dish.nombre }}</h3>
                <p class="description hide-long-text"> {{ dish.descripcion }}</p>
            </div>

            <div class="card__info card__info--price">
                <span class="current-price">
                    ${{ formatPrice(dish.precio) }}
                </span>

                <span v-if="dish.precio_comparacion" class="old-price">
                    ${{ formatPrice(dish.precio_comparacion) }}
                </span>
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
import { useDropdown } from '@/composables/useDropdown'
import { Pencil, Trash2, ChefHat, X,} from 'lucide-vue-next'

const props = defineProps({
    dish: {
        type: Object,
        required: true,
    },
})

const { isOpen, toggleMenu, closeMenu } = useDropdown({
    closeOnRouteChange: true
})

const menuId = `dish-menu-${props.dish.id}`

defineEmits([
    'edit',
    'delete',
    'toggle-status',
])

const formatPrice = (value) => {

    if (!value) return '0'

    return new Intl.NumberFormat(
        'es-CL'
    ).format(value)
}
</script>