<template>
  <div v-if="show" class="role-modal-overlay">
    <div class="role-modal animate__animated animate__fadeIn">
      <button class="close-modal" @click="$emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <h3 class="modal-title">Selecciona tu local</h3>
      <div class="role-options">
        <button v-for="(item, idx) in usuarioRolesLocales" :key="item.id" class="btn btn-role btn-pro"
          @click="$emit('select-role', { rol: item.rol.nombre, local: item.local })">
          <div>
            {{ item.local.nombreFantasia || item.local.nombre }} ({{ item.rol.nombre }})
          </div>
        </button>
        <div v-if="!usuarioRolesLocales || usuarioRolesLocales.length === 0" style="color: #888; text-align: center;">
          No tienes locales asignados.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RoleSelectionModal",
  props: {
    show: { type: Boolean, default: false },
    usuarioRolesLocales: { type: Array, default: () => [] }
  },
  emits: ["close", "select-role"]
}
</script>

<style scoped>
/* Estilos para el modal de selección de rol */
.role-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.role-modal {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  position: relative;
}

.close-modal {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.role-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-role {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 500;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-basic {
  background-color: #4a89dc;
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-pro {
  background-color: #4a89dc;
}

.btn-pro:hover {
  background-color: #3a70c2;
}

.btn-garzon {
  background-color: #4a89dc;
  opacity: 0.5;
  cursor: not-allowed;
}
</style>