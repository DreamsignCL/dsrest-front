<template>
  <header class="panel__header">
    <h1 id="page-title">{{ title }}</h1>
    <p v-if="description">{{ description }}</p>
  </header>
</template>

<script setup>

defineProps({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        default: '',
    },
})

</script>