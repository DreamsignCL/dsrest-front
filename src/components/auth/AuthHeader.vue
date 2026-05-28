<template>
  <div class="auth-header">
    <h1 class="auth-header__title">
      {{ title }}
    </h1>

    <p v-if="description" class="auth-header__description">
      {{ description }}
    </p>
  </div>
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