<template>
    <article class="dish-card">

        <!-- Estado -->

        <div class="dish-card__status">

            <label class="switch">

                <input
                    type="checkbox"
                    :checked="dish.estado"
                    @change="$emit('toggle-status')"
                >

                <span class="switch__slider"></span>

            </label>

        </div>

        <!-- Imagen -->

        <div class="dish-card__image">

            <img
                v-if="dish.foto"
                :src="dish.foto"
                :alt="dish.nombre"
            >

            <div
                v-else
                class="dish-card__placeholder"
            >
                Sin imagen
            </div>

        </div>

        <!-- Información -->

        <div class="dish-card__content">

            <div class="dish-card__header">

                <h3>
                    {{ dish.nombre }}
                </h3>

                <ChefHat
                    v-if="dish.recomendacion_chef"
                    :size="18"
                    class="dish-card__featured"
                />

            </div>

            <p
                v-if="dish.descripcion"
                class="dish-card__description"
            >
                {{ dish.descripcion }}
            </p>

            <div class="dish-card__prices">

                <span class="dish-card__price">

                    ${{ formatPrice(dish.precio) }}

                </span>

                <span
                    v-if="dish.precio_comparacion"
                    class="dish-card__price-old"
                >
                    ${{ formatPrice(dish.precio_comparacion) }}
                </span>

            </div>

        </div>

        <!-- Acciones -->

        <div class="dish-card__actions">

            <BaseButton
                type="button"
                variant="ghost"
                size="sm"
                @click="$emit('edit')"
            >
                <Pencil :size="18" />
            </BaseButton>

            <BaseButton
                type="button"
                variant="ghost"
                size="sm"
                @click="$emit('delete')"
            >
                <Trash2 :size="18" />
            </BaseButton>

        </div>

    </article>
</template>

<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'

import {
    Pencil,
    Trash2,
    ChefHat,
} from 'lucide-vue-next'

defineProps({
    dish: {
        type: Object,
        required: true,
    },
})

defineEmits([
    'edit',
    'delete',
    'toggle-status',
])

const formatPrice = (value) => {

    if (!value) return '0'

    return new Intl.NumberFormat(
        'es-CL'
    ).format(value)
}
</script>

<style scoped>
.dish-card {
    display: grid;
    grid-template-columns: auto 96px 1fr auto;
    gap: 1rem;
    align-items: center;

    padding: 1rem;

    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
}

.dish-card__image {
    width: 96px;
    height: 96px;

    overflow: hidden;

    border-radius: var(--radius-md);
}

.dish-card__image img {
    width: 100%;
    height: 100%;

    object-fit: cover;
}

.dish-card__placeholder {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: .75rem;
}

.dish-card__content {
    display: flex;
    flex-direction: column;
    gap: .5rem;
}

.dish-card__header {
    display: flex;
    align-items: center;
    gap: .5rem;
}

.dish-card__description {
    margin: 0;
}

.dish-card__prices {
    display: flex;
    gap: .75rem;
    align-items: center;
}

.dish-card__price {
    font-weight: 700;
}

.dish-card__price-old {
    text-decoration: line-through;
    opacity: .6;
}

.dish-card__actions {
    display: flex;
    gap: .5rem;
}

@media (max-width: 768px) {

    .dish-card {

        grid-template-columns: 1fr;

    }

    .dish-card__image {

        width: 100%;
        height: 180px;

    }

    .dish-card__actions {

        justify-content: flex-end;

    }
}
</style>