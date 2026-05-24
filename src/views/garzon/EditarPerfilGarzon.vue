<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api.service'
import InnerHeader from '@/components/InnerHeader.vue'

const router = useRouter()

const usuario = ref({
  nombre: '',
  telefono: '',
  rut: '',
  correo: '',
})

const formData = ref({
  nombre: '',
  telefono: '',
  contrasena: '',
  repetirContrasena: '',
})

const localLogoSrc = ref('../../assets/img/no-logo.png')
const errorMessage = ref('')
const successMessage = ref('')
const showSaveConfirmModal = ref(false)

onMounted(async () => {
  await cargarDatosUsuario()
})

const cargarDatosUsuario = async () => {
  try {
    // Cargar usuario desde la API
    const data = await apiService.get('usuarios/perfil')
    usuario.value = {
      nombre: data.nombre,
      telefono: data.telefono,
      rut: data.rut,
      correo: data.correo,
    }
    formData.value.nombre = data.nombre
    formData.value.telefono = data.telefono

    // Cargar logo del local desde localStorage o desde la API si es necesario
    const localLS = JSON.parse(localStorage.getItem('local'))
    if (localLS && localLS.foto) {
      localLogoSrc.value = localLS.foto
    } else if (localLS && localLS.id) {
      try {
        const localApi = await apiService.get(`locales/${localLS.id}`)
        if (localApi && localApi.foto) {
          localLogoSrc.value = localApi.foto
          localStorage.setItem('local', JSON.stringify(localApi))
        }
      } catch (error) {
        console.error('Error al obtener datos del local:', error)
      }
    }
  } catch {
    errorMessage.value = 'Error al cargar los datos del perfil.'
  }
}

const triggerSaveConfirmation = () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!formData.value.nombre || !formData.value.telefono) {
    errorMessage.value = 'Por favor, complete todos los campos obligatorios.'
    return
  }

  if (formData.value.contrasena && formData.value.contrasena !== formData.value.repetirContrasena) {
    errorMessage.value = 'Las contraseñas no coinciden.'
    return
  }

  showSaveConfirmModal.value = true
}

const guardarPerfil = async () => {
  showSaveConfirmModal.value = false
  try {
    const payload = {
      nombre: formData.value.nombre,
      telefono: formData.value.telefono,
    }
    if (formData.value.contrasena) {
      payload.contrasena = formData.value.contrasena
    }

    const response = await apiService.put('usuarios/perfil', payload)

    if (response && response.usuario) {
      successMessage.value = response.message || 'Perfil actualizado correctamente.'
      // Refresca el usuario completo
      const userFull = await apiService.get('usuarios/perfil')
      localStorage.setItem('user', JSON.stringify(userFull))
      usuario.value.nombre = userFull.nombre
      usuario.value.telefono = userFull.telefono
      formData.value.contrasena = ''
      formData.value.repetirContrasena = ''
    } else {
      errorMessage.value = response?.message || 'No se pudo actualizar el perfil.'
    }
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      'Error al actualizar el perfil. Verifique los datos e intente nuevamente.'
  }
}

const cancelSave = () => {
  showSaveConfirmModal.value = false
}

const volver = () => {
  router.push('/garzon')
}
</script>

<template>
  <div class="page page--backoffice">
    <InnerHeader />
    <main>
      <div class="page-content page-content--backoffice-form">
        <div class="page-content__header">
          <div class="user-logo">
            <div class="user-logo__image">
              <img :src="localLogoSrc" alt="Logo de local" />
            </div>
          </div>

          <div class="title">
            <h2>Editar perfil</h2>
          </div>
        </div>

        <div class="page-content__body">
          <form @submit.prevent="triggerSaveConfirmation">
            <div class="form-container form-container--no-header">
              <div class="form-container__body">
                <div v-if="errorMessage" class="alert alert-danger mb-3" role="alert">
                  {{ errorMessage }}
                </div>
                <div v-if="successMessage" class="alert alert-success mb-3" role="alert">
                  {{ successMessage }}
                </div>

                <div class="mb-3">
                  <label class="form-label" for="rut">RUT</label>
                  <input id="rut" type="text" :value="usuario.rut"
class="form-control" disabled />
                </div>

                <div class="mb-3">
                  <label class="form-label" for="correo">Correo electrónico</label>
                  <input
                    id="correo"
                    type="email"
                    :value="usuario.correo"
                    class="form-control"
                    disabled
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label" for="nombre">Nombre Completo</label>
                  <input
                    id="nombre"
                    v-model="formData.nombre"
                    type="text"
                    placeholder="Ingrese nombre completo"
                    class="form-control"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label" for="telefono">Teléfono</label>
                  <input
                    id="telefono"
                    v-model="formData.telefono"
                    type="text"
                    placeholder="Ingrese número de teléfono"
                    class="form-control"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label" for="contrasena">Contraseña</label>
                  <input
                    id="contrasena"
                    v-model="formData.contrasena"
                    type="password"
                    placeholder="Dejar en blanco para no cambiar"
                    class="form-control"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label" for="repetirContrasena">Repetir contraseña</label>
                  <input
                    id="repetirContrasena"
                    v-model="formData.repetirContrasena"
                    type="password"
                    placeholder="Confirmar contraseña"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="form-container__footer">
                <button type="button" class="btn btn-outline-primary rounded-pill" @click="volver">
                  Volver
                </button>
                <button type="submit" class="btn btn-primary rounded-pill">Guardar cambios</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>

    <div
      v-if="showSaveConfirmModal"
      class="modal animate__animated animate__fadeIn"
      @click="cancelSave"
    >
      <div class="modal-content animate__animated animate__fadeInUp" @click.stop>
        <div class="modal-header">
          <h4 class="modal-title">Editar perfil</h4>
          <button class="btn-close" @click="cancelSave"></button>
        </div>
        <div class="modal-body">
          <p>
            ¿Estás seguro que deseas <strong>guardar</strong> los cambios de
            <strong>{{ formData.nombre }}</strong
            >?
          </p>
        </div>
        <div class="modal-footer justify-content-center">
          <button class="btn btn-outline-primary rounded-pill" @click="cancelSave">Cancelar</button>
          <button class="btn btn-primary rounded-pill" @click="guardarPerfil">Sí, guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>
