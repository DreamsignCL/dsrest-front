<template>
  <div class="unauthorized-container">
    <div class="unauthorized-card">
      <h1>⚠️ Acceso no autorizado</h1>
      <p>No tienes permisos para acceder a esta página.</p>
      <button class="back-button" @click="goBack">Volver atrás</button>
      <button class="home-button" @click="goHome">Ir al inicio</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1) // Regresa a la página anterior
}

const goHome = () => {
  router.push('/') // Redirige a la página de inicio
}
</script>

<style scoped>
.unauthorized-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
}

.unauthorized-card {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
}

h1 {
  color: #dc3545;
  margin-bottom: 1rem;
}

p {
  color: #6c757d;
  margin-bottom: 2rem;
}

button {
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.back-button {
  background-color: #6c757d;
  color: white;
}

.home-button {
  background-color: #007bff;
  color: white;
}

button:hover {
  opacity: 0.9;
}
</style>
