<template>
    <form id="dish-form" class="dish-form" @submit.prevent="$emit('submit')">

        <BaseImageUploader
            id="dish-image"
            label="Foto"
            variant="square"
            :model-value="form.image"
            :error="errors.image"
            @update:model-value="handleImageChange($event)"
            @error="$emit('image-error', $event)"
        />

        <BaseInput
            id="dish-name"
            label="Nombre:"
            placeholder="Ingresa el nombre del plato"
            :model-value="form.name"
            :error="errors.name"
            required
            @update:model-value="
                updateField(
                    'name',
                    $event
                )
            "
        />

        <BaseTextarea
            id="dish-description"
            label="Descripción:"
            placeholder="Describe el plato"
            :model-value="form.description"
            :error="errors.description"
            @update:model-value="
                updateField(
                    'description',
                    $event
                )
            "
        />

        <BaseSelect
            id="dish-category"
            label="Categoría:"
            placeholder="Selecciona una categoría"
            :model-value="form.categoryId"
            :options="categoryOptions"
            :error="errors.categoryId"
            required
            @update:model-value="
                updateField(
                    'categoryId',
                    $event
                )
            "
        />

        <div class="dish-form__prices">

            <BaseInput
                id="dish-price"
                label="Precio:"
                type="number"
                placeholder="0"
                :model-value="form.price"
                :error="errors.price"
                required
                @update:model-value="
                    updateField(
                        'price',
                        $event
                    )
                "
            />

            <BaseInput
                id="dish-compare-price"
                label="Precio comparación:"
                type="number"
                placeholder="0"
                :model-value="form.comparePrice"
                :error="errors.comparePrice"
                @update:model-value="
                    updateField(
                        'comparePrice',
                        $event
                    )
                "
            />

        </div>

        <div class="dish-form__switches">

            <BaseSwitch
                id="dish-recommended"
                label="Recomendado del chef"
                variant="horizontal"
                :model-value="form.recommended"
                @update:model-value="
                    updateField(
                        'recommended',
                        $event
                    )
                "
            />

        </div>
    </form>
</template>

<script setup>
import { computed } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'
import BaseImageUploader from '@/components/ui/BaseImageUploader.vue'

const props = defineProps({
    form: {
        type: Object,
        required: true,
    },

    categories: {
        type: Array,
        default: () => [],
    },

    errors: {
        type: Object,
        default: () => ({}),
    },
})

const emit = defineEmits([
    'update:form',
    'submit',
    'image-error',
])

const categoryOptions = computed(() => {
    return props.categories.map(
        category => ({
            value: category.id,
            label: category.nombre,
        })
    )
})

const updateField = ( field, value ) => {
    emit(
        'update:form',
        {
            ...props.form,
            [field]: value,
        }
    )
}

const handleImageChange = file => {
    emit(
        'update:form',
        {
            ...props.form,
            image: file,
        }
    )

    emit(
        'image-error',
        ''
    )
}
</script>