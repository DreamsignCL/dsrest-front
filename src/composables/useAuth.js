import { useRouter } from 'vue-router'

export function useAuth() {

    const router = useRouter()

    const clearSession = () => {

        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('local')

        sessionStorage.clear()
    }

    const logout = () => {

        clearSession()

        router.push('/')
    }

    return {
        logout,
        clearSession,
    }
}