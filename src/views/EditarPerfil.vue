<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api.service'
import InnerHeader from '@/components/InnerHeader.vue'
import Signature from '@/components/Signature.vue'

const router = useRouter()
const usuario = ref(null)
const local = ref(null)
const empresa = ref(null)
const isLoading = ref(true)
const activeTab = ref('personal') // 'personal' or 'business'

// Form data
const formPersonal = ref({
  nombre: '',
  telefono: '',
  contrasena: '',
  repetirContrasena: ''
})

const formNegocio = ref({
  nombre: '',
  nombreFantasia: '',
  direccion: '',
  logotipo: null
})

const formEmpresa = ref({
  tipoNegocio: '',
  usaMesas: 'si',
  usaNombreCliente: 'no'
})

// Lista dinámica cargada desde la API
const tiposNegocio = ref([])
// Flag para evitar que el watch sobreescriba los valores cargados desde la API
const cargandoEmpresa = ref(false)

watch(() => formEmpresa.value.tipoNegocio, (nuevoNombre) => {
  if (cargandoEmpresa.value) return // No autosugerir durante la carga inicial
  const tipo = tiposNegocio.value.find(t => t.nombre === nuevoNombre)
  if (tipo) {
    formEmpresa.value.usaMesas = tipo.sugerenciaUsaMesas || 'si'
    formEmpresa.value.usaNombreCliente = tipo.sugerenciaUsaNombreCliente || 'no'
  }
})

// Imagen de logo preview
const logoPreview = ref(null)

// Mensajes de error y éxito
const errorMessages = ref({
  personal: {
    contrasena: '',
    general: ''
  },
  negocio: {
    general: ''
  },
  success: ''
})

const obtenerDatos = async () => {
  try {
    isLoading.value = true
    errorMessages.value.success = ''

    // 1. Cargar usuario desde localStorage
    const userLS = JSON.parse(localStorage.getItem('user'))
    usuario.value = userLS || null
    formPersonal.value.nombre = userLS?.nombre || ''
    formPersonal.value.telefono = userLS?.telefono || ''

    // 2. Buscar el local desde localStorage o desde user
    let localLS = JSON.parse(localStorage.getItem('local'))
    let localEncontrado = null

    if (localLS && localLS.id) {
      // Si el local guardado está incompleto, pide el objeto completo a la API
      if (!localLS.nombreFantasia || !localLS.direccion) {
        try {
          const localApi = await apiService.get(`locales/${localLS.id}`)
          if (localApi) {
            localEncontrado = localApi
            localStorage.setItem('local', JSON.stringify(localApi))
          } else {
            localEncontrado = localLS
          }
        } catch (e) {
          localEncontrado = localLS
        }
      } else {
        localEncontrado = localLS
      }
    } else if (userLS?.rolesLocales?.length > 0) {
      const rolLocal = userLS.rolesLocales.find(rl => rl.local)
      if (rolLocal && rolLocal.local) {
        localEncontrado = rolLocal.local
      }
    } else if (userLS?.localUsuarioCategorias?.length > 0) {
      localEncontrado = { id: userLS.localUsuarioCategorias[0].localId }
    }

    // Si tienes solo el id, obtén el objeto completo desde la API
    if (localEncontrado && !localEncontrado.nombreFantasia && localEncontrado.id) {
      try {
        const localApi = await apiService.get(`locales/${localEncontrado.id}`)
        if (localApi) {
          localEncontrado = localApi
          localStorage.setItem('local', JSON.stringify(localApi))
        }
      } catch (e) {}
    }

    local.value = localEncontrado

    if (localEncontrado) {
      formNegocio.value.nombre = localEncontrado.nombre || ''
      formNegocio.value.nombreFantasia = localEncontrado.nombreFantasia || ''
      formNegocio.value.direccion = localEncontrado.direccion || ''
      if (localEncontrado.foto) {
        logoPreview.value = localEncontrado.foto
      } else {
        logoPreview.value = null
      }
    } else {
      local.value = null
      formNegocio.value.nombre = ''
      formNegocio.value.nombreFantasia = ''
      formNegocio.value.direccion = ''
      logoPreview.value = null
    }

    // 3. Refrescar usuario desde la API y actualizar localStorage (opcional)
    try {
      const userData = await apiService.get('usuarios/perfil')
      if (userData) {
        usuario.value = userData
        localStorage.setItem('user', JSON.stringify(userData))
        formPersonal.value.nombre = userData.nombre || ''
        formPersonal.value.telefono = userData.telefono || ''
      }
    } catch (e) {}

    // 4. Cargar tipos de negocio disponibles
    try {
      const tipos = await apiService.get('tipos-negocio')
      if (Array.isArray(tipos)) tiposNegocio.value = tipos
    } catch (e) {}

    // 5. Cargar datos de la empresa (configuración operativa)
    try {
      if (local.value?.id) {
        const empresaData = await apiService.get(`empresas/por-local/${local.value.id}`)
        if (empresaData) {
          empresa.value = empresaData
          cargandoEmpresa.value = true
          formEmpresa.value.tipoNegocio = empresaData.tipoNegocio || ''
          formEmpresa.value.usaMesas = empresaData.usaMesas || 'si'
          formEmpresa.value.usaNombreCliente = empresaData.usaNombreCliente || 'no'
          await nextTick()
          cargandoEmpresa.value = false
        }
      }
    } catch (e) {}

  } catch (error) {
    errorMessages.value.personal.general = 'Error al cargar los datos del perfil'
  } finally {
    isLoading.value = false
  }
}

const cambiarTab = (tab) => {
  activeTab.value = tab
  errorMessages.value.success = ''
  errorMessages.value.personal.contrasena = ''
  errorMessages.value.personal.general = ''
  errorMessages.value.negocio.general = ''
}

const seleccionarLogo = (event) => {
  const file = event.target.files[0]
  if (file) {
    formNegocio.value.logotipo = file
    
    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const guardarDatos = async () => {
  isLoading.value = true
  errorMessages.value.success = ''
  errorMessages.value.personal.contrasena = ''
  errorMessages.value.personal.general = ''
  errorMessages.value.negocio.general = ''

  try {
    if (formPersonal.value.contrasena && 
        formPersonal.value.contrasena !== formPersonal.value.repetirContrasena) {
      errorMessages.value.personal.contrasena = 'Las contraseñas no coinciden'
      isLoading.value = false
      return
    }

    if (activeTab.value === 'personal') {
      const datosPersonales = {
        nombre: formPersonal.value.nombre,
        telefono: formPersonal.value.telefono
      }

      if (formPersonal.value.contrasena) {
        datosPersonales.contrasena = formPersonal.value.contrasena
      }

      console.log('🟡 Datos personales antes de enviar:', datosPersonales)

      if (usuario.value?.id) {
        await apiService.put(`usuarios/${usuario.value.id}`, datosPersonales)

        usuario.value = {
          ...usuario.value,
          ...datosPersonales
        }

        localStorage.setItem('user', JSON.stringify(usuario.value))
        errorMessages.value.success = 'Datos personales guardados correctamente'
      } else {
        throw new Error('No se pudo obtener el ID del usuario')
      }
    } else {
      if (!local.value?.id) {
        throw new Error('No se pudo obtener el ID del local')
      }

      const datosNegocio = {
        nombre: formNegocio.value.nombre || local.value.nombre,
        nombreFantasia: formNegocio.value.nombreFantasia || local.value.nombreFantasia,
        direccion: formNegocio.value.direccion,
        tipo: formEmpresa.value.tipoNegocio || local.value.tipo || null,
        foto: logoPreview.value || local.value.foto
      }

      await apiService.put(`locales/${local.value.id}`, datosNegocio)

      local.value = {
        ...local.value,
        ...datosNegocio
      }

      localStorage.setItem('local', JSON.stringify(local.value))

      // Guardar configuración operativa de la empresa
      if (empresa.value?.id) {
        const datosEmpresa = {
          tipoNegocio: formEmpresa.value.tipoNegocio || null,
          usaMesas: formEmpresa.value.usaMesas,
          usaNombreCliente: formEmpresa.value.usaNombreCliente,
        }
        const respEmpresa = await apiService.put(`empresas/${empresa.value.id}`, datosEmpresa)
        if (respEmpresa?.empresa) {
          empresa.value = { ...empresa.value, ...respEmpresa.empresa }
        }
      }

      errorMessages.value.success = 'Datos del negocio guardados correctamente'
    }
  } catch (error) {
    console.error('❌ Error al guardar datos:', error)
    if (activeTab.value === 'personal') {
      errorMessages.value.personal.general = 'Error al guardar los datos personales: ' + error.message
    } else {
      errorMessages.value.negocio.general = 'Error al guardar los datos del negocio: ' + error.message
    }
  } finally {
    isLoading.value = false
  }
}

const volver = () => {
  router.push('/platos')
}

onMounted(() => {
  obtenerDatos()
})
</script>

<template>
  <div class="page page--backoffice">
    <InnerHeader />
    <main>
      <div class="page-content page-content--backoffice-form">
        <div class="page-content__header">
          <div class="user-logo">
            <div class="user-logo__image">
              <img v-if="local?.foto" :src="local.foto" alt="Logo del Local" />
              <img v-else src="../../src/assets/img/no-logo.png" alt="Sin logo" />
            </div>
          </div>

          <div v-if="usuario" class="title">
            <h2>Mi perfil</h2>
          </div>
        </div>

        <div class="page-content__body">
          <div class="tabs">
            <div 
              class="tab" 
              :class="{ active: activeTab === 'personal' }" 
              @click="cambiarTab('personal')">
              Datos personales
            </div>
            <div 
              class="tab" 
              :class="{ active: activeTab === 'business' }" 
              @click="cambiarTab('business')">
              Datos del negocio
            </div>
          </div>

          <div v-if="isLoading" class="loader"></div>

          <template v-else>
            <!-- Mensaje de éxito con botón para volver -->
            <div v-if="errorMessages.success" class="success-message">
              <div class="alert alert-success mb-3">
                {{ errorMessages.success }}
              </div>

              <button 
                class="btn btn-outline-primary rounded-pill"
                @click="errorMessages.success = ''">
                Volver al formulario
              </button>
            </div>
            
            <!-- Formulario datos personales -->
            <form v-if="activeTab === 'personal' && !errorMessages.success" @submit.prevent="guardarDatos">
              <div class="form-container form-container--no-header">
                <div class="form-container__body">
                  <!-- RUT -->
                  <div class="mb-3">
                    <label class="form-label" for="user-rut">RUT</label>
                    <input id="user-rut" class="form-control" type="text" :value="usuario?.rut || 'No disponible'" aria-label="Campo de RUT deshabilitado" disabled readonly>
                  </div>

                  <!-- Email -->
                  <div class="mb-3">
                    <label class="form-label" for="user-email">Correo electrónico</label>
                    <input id="user-email" class="form-control" type="text" :value="usuario?.correo || 'No disponible'" aria-label="Campo de Correo deshabilitado" disabled readonly>
                  </div>

                  <!-- Nombre -->
                  <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre</label>
                    <input 
                      type="text" 
                      id="nombre" 
                      v-model="formPersonal.nombre" 
                      class="form-control" 
                      placeholder="Nombre completo"
                    />
                  </div>

                  <div class="mb-3">
                    <label for="telefono" class="form-label">Teléfono</label>
                    <input 
                      type="tel" 
                      id="telefono" 
                      v-model="formPersonal.telefono" 
                      class="form-control" 
                      placeholder="Teléfono de contacto"
                    />
                  </div>

                  <div class="mb-3">
                    <label for="contrasena" class="form-label">Contraseña</label>
                    <input 
                      type="password" 
                      id="contrasena" 
                      v-model="formPersonal.contrasena" 
                      class="form-control" 
                      placeholder="Dejar en blanco para mantener"
                    />
                  </div>

                  <div class="mb-3">
                    <label for="repetirContrasena" class="form-label">Repetir contraseña</label>
                    <input 
                      type="password" 
                      id="repetirContrasena" 
                      v-model="formPersonal.repetirContrasena" 
                      class="form-control" 
                      placeholder="Confirmar contraseña"
                    />
                    <div v-if="errorMessages.personal.contrasena" class="error-message">
                      {{ errorMessages.personal.contrasena }}
                    </div>
                  </div>

                  <div v-if="errorMessages.personal.general" class="alert alert-danger">
                    {{ errorMessages.personal.general }}
                  </div>
                </div>

                <div class="form-container__footer">
                  <button type="button" class="btn btn-outline-primary btn-block rounded-pill" @click="volver">
                    Volver
                  </button>
                  <button type="submit" class="btn btn-primary btn-block rounded-pill">
                    Guardar
                  </button>
                </div>
              </div>
            </form>
            
            <!-- Formulario datos del negocio -->
            <form v-if="activeTab === 'business' && !errorMessages.success" @submit.prevent="guardarDatos">
              <div class="form-container form-container--no-header">
                <div class="form-container__body">
                  <!-- RUT -->
                  <div class="mb-3">
                    <label class="form-label" for="company-rut">RUT empresa</label>
                    <input id="company-rut" class="form-control" type="text" :value="local?.rut || 'No disponible'" aria-label="Campo de RUT deshabilitado" disabled readonly>
                  </div>

                  <!-- Razón social -->
                  <div class="mb-3">
                    <label class="form-label" for="company-name">Razón social</label>
                    <input id="company-name" class="form-control" type="text" :value="local?.nombre || 'No disponible'" aria-label="Campo de Razón social deshabilitado" disabled readonly>
                  </div>
                  
                  <div class="mb-3">
                    <label for="nombreFantasia" class="form-label">Nombre de fantasía</label>
                    <input 
                      type="text" 
                      id="nombreFantasia" 
                      v-model="formNegocio.nombreFantasia" 
                      class="form-control" 
                      placeholder="Nombre de fantasía del local"
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Logotipo</label>
                    <div class="file-upload">
                      <input type="file" accept="image/*" id="foto" @change="seleccionarLogo" class="file-upload__input" />
                      <label for="foto" class="file-upload__label">
                        <div v-if="logoPreview" class="file-upload__preview">
                          <img :src="logoPreview" alt="Vista previa" />
                        </div>
                        <div v-else class="file-upload__placeholder">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 5v14"></path>
                            <path d="M5 12h14"></path>
                          </svg>
                        </div>
                      </label>
                    </div>
                  </div>

                  <!-- 
                  -------------------------
                  ---Componente original---
                  -------------------------

                  <div class="mb-3 logo-upload">
                    <label>Logotipo</label>
                    <div class="logo-container" @click="$refs.logoInput.click()">
                      <img v-if="logoPreview" :src="logoPreview" alt="Logo preview" />
                      <div v-else class="upload-placeholder">
                        <div class="plus-icon">+</div>
                      </div>
                    </div>
                    <input 
                      type="file" 
                      ref="logoInput" 
                      accept="image/*" 
                      style="display: none" 
                      @change="seleccionarLogo"
                    />
                  </div>
                  -->
                  
                  <div class="mb-3">
                    <label for="direccion" class="form-label">Dirección</label>
                    <input 
                      type="text" 
                      id="direccion" 
                      v-model="formNegocio.direccion" 
                      class="form-control" 
                      placeholder="Dirección del negocio"
                    />
                  </div>
                  
                  <div class="mb-3">
                    <label for="tipoNegocio" class="form-label">Tipo de negocio</label>
                    <select id="tipoNegocio" class="form-select" v-model="formEmpresa.tipoNegocio">
                      <option value="">Sin especificar</option>
                      <option v-for="tipo in tiposNegocio" :key="tipo.id" :value="tipo.nombre">{{ tipo.nombre }}</option>
                    </select>
                    <small class="form-text text-muted">Al seleccionar un tipo se sugieren valores automáticamente.</small>
                  </div>

                  <div class="mb-3">
                    <label for="usaMesas" class="form-label">¿Usa mesas?</label>
                    <select id="usaMesas" class="form-select" v-model="formEmpresa.usaMesas">
                      <option value="si">Sí</option>
                      <option value="no">No</option>
                      <option value="opcional">Opcional</option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <label for="usaNombreCliente" class="form-label">¿Usa nombre de cliente?</label>
                    <select id="usaNombreCliente" class="form-select" v-model="formEmpresa.usaNombreCliente">
                      <option value="si">Sí</option>
                      <option value="no">No</option>
                      <option value="opcional">Opcional</option>
                    </select>
                  </div>
                  <!-- Fin configuración operativa -->
                  
                  <div v-if="errorMessages.negocio.general" class="alert alert-danger">
                    {{ errorMessages.negocio.general }}
                  </div>
                </div>
                <div class="form-container__footer">
                  <button type="button" class="btn btn-outline-primary btn-block rounded-pill" @click="volver">
                    Volver
                  </button>
                  <button type="submit" class="btn btn-primary btn-block rounded-pill">
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/*
.registration-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding: 1rem;
}

.content-header {
  text-align: center;
}

.content-header strong {
  font-size: 0.9rem;
  color: #6c757d;
}

.content-header h2 {
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.local-name {
  color: #0096d6;
  margin-bottom: 1rem;
}

.user-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tabs {
  display: flex;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 1.5rem;
}

.tab {
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-weight: 500;
  color: #6c757d;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
}

.tab.active {
  color: #0096d6;
  border-bottom-color: #0096d6;
}

.content-body {
  padding: 1rem 0;
}

.mb-3 {
  margin-bottom: 1.25rem;
}

.mb-3 label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #212529;
}

.read-only-field {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  background-color: #f8f9fa;
  color: #495057;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ced4da;
  border-radius: 20px;
  background-color: #fff;
}

.form-control::placeholder {
  color: #adb5bd;
}

.form-control:focus {
  outline: none;
  border-color: #0096d6;
  box-shadow: 0 0 0 0.2rem rgba(0, 150, 214, 0.25);
}

.logo-upload {
  text-align: center;
}

.logo-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px dashed #ced4da;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 auto;
  overflow: hidden;
}

.logo-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.plus-icon {
  font-size: 2rem;
  color: #adb5bd;
}

.form-actions {
  margin-top: 2rem;
}

.btn {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  text-align: center;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary {
  background-color: #0096d6;
  color: white;
}

.btn-outline-primary {
  background-color: transparent;
  border: 1px solid #6c757d;
  color: #6c757d;
}

.btn-outline-primary {
  color: #0096d6;
  border: 1px solid #0096d6;
  background-color: transparent;
}

.btn-outline-primary:hover {
  color: white;
  background-color: #0096d6;
}

.loading {
  text-align: center;
  padding: 2rem 0;
  color: #6c757d;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.alert {
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.success-message {
  text-align: center;
  margin-bottom: 2rem;
}

.success-message .alert {
  margin-bottom: 1.5rem;
}
  */
</style>