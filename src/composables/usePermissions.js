import { computed } from 'vue'

export function usePermissions() {

    const user = computed(() => {
        return JSON.parse(localStorage.getItem('user'))
    })

    const local = computed(() => {
        return JSON.parse(localStorage.getItem('local'))
    })

    const sessionLocalId = computed(() => {
        return local.value?.id ?? null
    })

    const hasRole = (roleName) => {

        return user.value?.usuarioRolesLocales?.some(
            role =>
                role.localId === sessionLocalId.value &&
                role.rol?.nombre === roleName
        )
    }

    const hasCategory = (categoryName) => {

        return user.value?.localUsuarioCategorias?.some(
            category =>
                category.localId === sessionLocalId.value &&
                category.categoria?.nombre === categoryName
        )
    }

    return {
        hasRole,
        hasCategory,
    }
}