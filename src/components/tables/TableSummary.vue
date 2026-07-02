<template>
    <div class="summary summary--tables">
        <div class="summary__item summary__item--success">
            <div class="summary__item-head">Disponible</div>
            <div class="summary__item-body">
                {{ available }}
            </div>
        </div>

        <div class="summary__item summary__item--warning">
            <div class="summary__item-head">Ocupada</div>
            <div class="summary__item-body">
                {{ occupied }}
            </div>
        </div>

        <div class="summary__item summary__item--info">
            <div class="summary__item-head">Reservada</div>
            <div class="summary__item-body">
                {{ reserved }}
            </div>
        </div>

        <div class="summary__item summary__item--danger">
            <div class="summary__item-head">Fuera de servicio</div>
            <div class="summary__item-body">
                {{ outOfService }}
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({

    available: {
        type: Number,
        default: 0,
    },

    occupied: {
        type: Number,
        default: 0,
    },

    reserved: {
        type: Number,
        default: 0,
    },

    outOfService: {
        type: Number,
        default: 0,
    },

})
</script>