import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export function useDropdown(options = {}) {
    const {
        closeOnRouteChange = false,
    } = options

    const isOpen = ref(false)
    const route = useRoute()

    const toggleMenu = () => {
        isOpen.value = !isOpen.value
    }

    const closeMenu = () => {
        isOpen.value = false
    }

    if (closeOnRouteChange) {
        watch(
            () => route.fullPath,
            () => {
                closeMenu()
            }
        )
    }

    return {
        isOpen,
        toggleMenu,
        closeMenu
    }
}