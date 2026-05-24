<template>
  <div class="modal-backdrop">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')" aria-label="Cerrar">
        <img src="../../assets/img/close-skyblue-icon.svg" alt="Eliminar"
          style="width: 15px; height: 15px; filter: brightness(0) invert(1);" />
      </button>
      <h3>Ya existes en nuestro sistema</h3>
      <p>Crea tu local y elige tu plan</p>
      <button class="primary-btn" @click="$emit('create-local')">Crear local</button>
      <button class="secondary-btn" @click="$emit('close')">Cancelar</button>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  padding: 24px 16px 16px 16px;
  min-width: 260px;
  max-width: 350px;
  width: 100%;
  position: relative;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #00AEEF;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.primary-btn {
  width: 100%;
  background: #00AEEF;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.secondary-btn {
  width: 100%;
  background: #E0E0E0;
  color: #888;
  border: none;
  border-radius: 6px;
  padding: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: bold;
}

p {
  margin: 0 0 16px 0;
  font-size: 15px;
}
</style>