<template>
    <div class="home">
      <h1>Bienvenido a la aplicación</h1>
      <p>Has iniciado sesión correctamente</p>
      <button @click="logout" class="logout-btn">Cerrar sesión</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Home',
    methods: {
      logout() {
        this.$store.dispatch('auth/logout');
        this.$router.push('/');
      }
    }
  }
  </script>
  
  <style scoped>
  .home {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
  
  .logout-btn {
    background-color: #ff3333;
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 2rem;
  }
  </style>