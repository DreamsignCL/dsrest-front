<template>
    <div class="summary summary--resume">
        <div class="summary__row">
            <div class="summary__column summary__column--label">
                Rut per.:
            </div>

            <div class="summary__column summary__column--content">
                {{ userRut }}
            </div>

            <div class="summary__column summary__column--label">
                Rut emp.:
            </div>

            <div class="summary__column summary__column--content">
                {{ businessRut }}
            </div>
        </div>

        <div class="summary__row">
            <div class="summary__column summary__column--label">
                Email:
            </div>

            <div class="summary__column summary__column--content">
                {{ userEmail }}
            </div>
        </div>

        <div class="summary__row">
            <div class="summary__column summary__column--label">
                Razón soc.:
            </div>

            <div class="summary__column summary__column--content hide-long-text">
                {{ businessName }}
            </div>
        </div>
    </div>
</template>

<script setup>

defineProps({
    userRut: {
        type: String,
        default: '',
    },

    userEmail: {
        type: String,
        default: '',
    },

    businessRut: {
        type: String,
        default: '',
    },

    businessName: {
        type: String,
        default: '',
    },
})

</script>