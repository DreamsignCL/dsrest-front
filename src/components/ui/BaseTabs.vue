<template>
    <div class="tabs">
        <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            class="tabs__item"
            :disabled="tab.disabled"
            :class="{
                'tabs__item--active':
                    modelValue === tab.value,
            }"
            @click="
                emit(
                    'update:modelValue',
                    tab.value
                )
            ">
            {{ tab.label }}
        </button>
    </div>
</template>

<script setup>

defineProps({
    modelValue: {
        type: String,
        required: true,
    },

    tabs: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits([
    'update:modelValue',
])

</script>