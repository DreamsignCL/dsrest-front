<template>
    <transition name="fade">
        <div class="loader">
            <div class="loader__content">
                <div class="loader__spinner"></div>
                <p v-if="text" class="loader__text">
                    {{ text }}
                </p>
            </div>
        </div>
    </transition>
</template>

<script setup>
defineProps({
    text: {
        type: String,
        default: 'Cargando...',
    },
})
</script>