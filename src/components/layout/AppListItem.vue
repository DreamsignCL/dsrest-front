<template>
    <div
        class="list-item"
        :class="{ 'list-item--active': isOpen, 'list-item--disabled': !enabled,}"
        v-click-outside="closeMenu">

        <!-- Switch -->

        <div v-if="showSwitch" class="list-item__switch">
            <label class="switch switch--vertical">
                <input
                    type="checkbox"
                    :checked="props.enabled"
                    @change="$emit('toggle-status')" />
                <span class="slider round"></span>
            </label>
        </div>

        <!-- Content -->

        <div
            class="list-item__main"
            :aria-expanded="isOpen"
            aria-haspopup="menu"
            :aria-controls="menuId"
            :aria-label=" isOpen ? 'Cerrar menú' : 'Abrir menú'"
            role="button"
            tabindex="0"
            @click="toggleMenu">
            <slot name="content" />
        </div>

        <!-- Actions -->

        <div
            :id="menuId"
            class="list-item__actions"
            role="menu">

            <button
                class="btn-action btn-action--edit"
                role="menuitem"
                aria-label="Editar elemento"
                @click="$emit('edit')">
                <Pencil :size="18" />
            </button>

            <button
                class="btn-action btn-action--delete"
                role="menuitem"
                aria-label="Eliminar elemento"
                @click="$emit('delete')">
                <Trash2 :size="18" />
            </button>

            <button
                class="btn-action btn-action--close"
                role="menuitem"
                aria-label="Cerrar menú"
                @click="closeMenu">
                <X :size="18" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { useId } from 'vue'
import { useDropdown } from '@/composables/useDropdown'
import { Pencil, Trash2, X,} from 'lucide-vue-next'

const props = defineProps({
    enabled: {
        type: Boolean,
        default: true,
    },

    showSwitch: {
        type: Boolean,
        default: true,
    },
})

const menuId = useId()

defineEmits([
    'edit',
    'delete',
    'toggle-status',
])

const {isOpen, toggleMenu, closeMenu,} = useDropdown({
    closeOnRouteChange: true,
})
</script>