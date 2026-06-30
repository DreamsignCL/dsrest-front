import { ref } from 'vue'

const user = ref(
    JSON.parse(
        localStorage.getItem('user')
    ) || null
)

const local = ref(
    JSON.parse(
        localStorage.getItem('local')
    ) || null
)

const token = ref(
    localStorage.getItem('token')
)

export function useCurrentUser() {

    const updateUser = data => {

        user.value = data

        localStorage.setItem(
            'user',
            JSON.stringify(data)
        )
    }

    const updateLocal = data => {

        local.value = data

        localStorage.setItem(
            'local',
            JSON.stringify(data)
        )
    }

    const updateToken = value => {

        token.value = value

        localStorage.setItem(
            'token',
            value
        )
    }

    return {
        user,
        local,
        token,

        updateUser,
        updateLocal,
        updateToken,
    }
}