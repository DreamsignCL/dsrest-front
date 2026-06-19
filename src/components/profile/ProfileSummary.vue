<template>
    <div class="summary summary--resume">
        <div class="summary__row">
            <div class="summary__column summary__column--label">
                Rut personal:
            </div>

            <div class="summary__column summary__column--content">
                {{ userRut }}
            </div>

            <div class="summary__column summary__column--label">
                Rut empresa:
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

            <div class="summary__column summary__column--label">
                Razón social:
            </div>

            <div class="summary__column summary__column--content">
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