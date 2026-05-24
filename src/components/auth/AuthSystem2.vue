<template>
  <div class="auth-container">
    <h2>Registro de Cuenta</h2>

    <!-- Selección de plan -->
    <label for="plan">Selecciona tu plan:</label>
    <select id="plan" v-model="selectedPlan">
      <option value="admin">Admin - $9.900</option>
      <option value="basico">Básico - $19.900</option>
      <option value="avanzado">Avanzado - $29.900</option>
      <option value="premium">Premium - $39.900</option>
    </select>

    <!-- Info del plan -->
    <div v-if="planNombre && planPrecio">
      <p>
        Estás contratando el plan <strong>{{ planNombre }}</strong> por
        <strong>${{ planPrecio }}</strong>
      </p>
    </div>

    <!-- Formulario de registro -->
    <form @submit.prevent="handleRegister">
      <input v-model="form.name" placeholder="Nombre" required />
      <input v-model="form.rut" placeholder="RUT" required />
      <input v-model="form.email" type="email" placeholder="Correo" required />
      <input v-model="form.password" type="password" placeholder="Contraseña" required />
      <button type="submit">Registrarse y Pagar</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { apiService } from '@/services/api.service'

const route = useRoute()
const selectedPlan = ref(route.query.plan || 'basico')

const form = ref({
  name: '',
  rut: '',
  email: '',
  password: '',
})

const planNombre = computed(
  () =>
    ({
      admin: 'Admin',
      basico: 'Básico',
      avanzado: 'Avanzado',
      premium: 'Premium',
    })[selectedPlan.value] || 'Básico'
)

const planPrecio = computed(
  () =>
    ({
      admin: 9900,
      basico: 19900,
      avanzado: 29900,
      premium: 39900,
    })[selectedPlan.value] || 19900
)

const handleRegister = async () => {
  try {
    const payload = {
      amount: planPrecio.value,
      currency: 'CLP',
      returnUrl: 'https://tudominio.com/exito',
      metadata: {
        productId: selectedPlan.value,
        quantity: 1,
        userData: form.value,
      },
    }

    const response = await apiService.post('pago/mercadopago', payload)
    if (response.url) {
      window.location.href = response.url
    } else {
      alert('Error al generar enlace de pago.')
    }
  } catch (err) {
    console.error(err)
    alert('Hubo un error al procesar el registro.')
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
button {
  background: #333;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 6px;
}
</style>
