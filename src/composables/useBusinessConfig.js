import { computed, inject } from 'vue'

export function useBusinessConfig() {

    const local = inject('currentLocal')

    const config = computed(() => ({
        tablesMode:
            local.value?.usaMesas ?? 'no',

        customerNameMode:
            local.value?.usaNombreCliente ?? 'no',
    }))

    return {
        config,
    }
}