<template>
    <div class="dish-item">
        <div class="dish-item__image">
            <div class="image">
                <img v-if="dish.foto" :src="dish.foto" :alt="dish.nombre">
                <img v-else :src="NoImage" alt="Sin logotipo">
            </div>

            <span v-if="dish.recomendacion_chef" class="dish-item__image-icon">
                <ChefHat :size="18" aria-hidden="true" />
            </span>
        </div>

        <div class="dish-item__info">
            <h3 class="title hide-long-text">{{ dish.nombre }}</h3>
            <p class="description hide-long-text"> {{ dish.descripcion }}</p>
        </div>

        <div class="dish-item__info dish-item__info--price">
            <span class="current-price">
                ${{ formatCurrency(dish.precio) }}
            </span>

            <span v-if="dish.precio_comparacion" class="old-price">
                ${{ formatCurrency(dish.precio_comparacion) }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { formatCurrency } from '@/helpers/formatters'
import NoImage from '@/assets/img/no-image.jpg'
import { ChefHat,} from 'lucide-vue-next'

const props = defineProps({
    dish: {
        type: Object,
        required: true,
    },
})
</script>