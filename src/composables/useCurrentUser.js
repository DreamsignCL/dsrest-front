import { computed } from 'vue'

export function useCurrentUser() {

    const user = computed(() => {
        const stored = localStorage.getItem('user')

        return stored
            ? JSON.parse(stored)
            : null
    })

    const local = computed(() => {
        const stored = localStorage.getItem('local')

        return stored
            ? JSON.parse(stored)
            : null
    })

    const token = computed(() => {
        return localStorage.getItem('token')
    })

    return {
        user,
        local,
        token,
    }
}