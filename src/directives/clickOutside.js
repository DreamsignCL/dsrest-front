export const vClickOutside = {
    mounted(el, binding) {
        el.__clickOutside__ = (event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event)
            }
        }

        document.addEventListener('pointerdown', el.__clickOutside__)
    },

    unmounted(el) {
        document.removeEventListener('pointerdown', el.__clickOutside__)
        delete el.__clickOutside__
    }
}