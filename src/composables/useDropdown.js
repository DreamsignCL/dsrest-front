import { ref } from 'vue'

export function useDropdown() {
    const isOpen = ref(false)

    const toggleMenu = () => (isOpen.value = !isOpen.value)
    const closeMenu = () => (isOpen.value = false)

    return { isOpen, toggleMenu, closeMenu }
}