<template>
  <div v-if="show" class="modal animate__animated animate__fadeIn" @click.self="onCancel">
    <div class="modal-content animate__animated animate__fadeInUp">
      <div class="modal-header">
        <button class="btn-close" type="button" @click.self="onCancel"></button>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="modal-footer justify-content-center">
        <button class="btn btn-primary rounded-pill" type="button" @click="onConfirm">
          Aceptar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['show', 'message'])
const emit = defineEmits(['confirm', 'cancel'])
const onConfirm = () => emit('confirm')
const onCancel = () => emit('cancel')
</script>
