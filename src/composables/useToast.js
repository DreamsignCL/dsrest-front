import { ref } from 'vue'

const toasts = ref([])

export function useToast() {

    const showToast = ({
        message,
        variant = 'info',
        showIcon = false,
        duration = 3000,
    }) => {

        const id = Date.now()

        toasts.value.push({
            id,
            message,
            variant,
            showIcon,
        })

        setTimeout(() => {

            toasts.value =
                toasts.value.filter(
                    toast =>
                        toast.id !== id
                )

        }, duration)
    }

    const removeToast = id => {

        toasts.value =
            toasts.value.filter(
                toast =>
                    toast.id !== id
            )
    }

    return {
        toasts,
        showToast,
        removeToast,
    }
}