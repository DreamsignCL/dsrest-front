<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const irAAdmin = () => {
  router.push('/platos')
}

const cargarOtroPlato = () => {
  router.push('/onboarding/plato')
}
</script>

<template>
  <div class="success-page">
    <div class="card message-card text-center animate__animated animate__fadeInUp">
      <div class="card-body">

        <h1>¡Felicidades, tu primer plato ha sido creado!</h1>

        <div class="emoji">👌</div>

        <h2 class="fw-normal mb-4">¿Cómo deseas continuar?</h2>

        <div class="d-grid gap-2">
          <button class="btn btn-outline-primary rounded-pill" @click="irAAdmin">
            Ir a mi admin
          </button>
          <button class="btn btn-primary rounded-pill" @click="cargarOtroPlato">
            Cargar otro plato
          </button>
        </div>
      </div>
    </div>
  </div>
</template>