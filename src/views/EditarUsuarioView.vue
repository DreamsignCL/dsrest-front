<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiService } from '@/services/api.service'
import InnerHeader from '@/components/InnerHeader.vue'

const router = useRouter()
const route = useRoute()

const userId = ref(null)

const usuario = ref({
  id: null,
  nombre: '',
  telefono: '',
  rut: '',
  correo: '',
  localId: null,
  categoriaId: null,
})

const formData = ref({
  nombre: '',
  telefono: '',
  rut: '',
  correo: '',
  contrasena: '',
  repetirContrasena: '',
  localId: null,
  categoriaId: null,
})

const localLogoSrc = ref('../assets/img/no-logo.png')
const errorMessage = ref('')
const successMessage = ref('')
const showSaveConfirmModal = ref(false)

onMounted(async () => {
  userId.value = route.params.id
  if (!userId.value) {
    errorMessage.value = 'ID de usuario no proporcionado en la URL.'
    return
  }

  const loggedInUser = JSON.parse(localStorage.getItem('user'))
  if (
    loggedInUser &&
    loggedInUser.localUsuarioCategorias &&
    loggedInUser.localUsuarioCategorias.length > 0
  ) {
    if (
      loggedInUser.localUsuarioCategorias[0].local &&
      loggedInUser.localUsuarioCategorias[0].local.foto
    ) {
      localLogoSrc.value = loggedInUser.localUsuarioCategorias[0].local.foto
    }
  }

  await cargarDatosUsuario(userId.value)
})

const cargarDatosUsuario = async (id) => {
  try {
    const data = await apiService.get(`usuarios/${id}`)

    // Obtener el localId del usuario en sesión
    const loggedInUser = JSON.parse(localStorage.getItem('user'))
    let sessionLocalId = null
    if (
      loggedInUser &&
      loggedInUser.localUsuarioCategorias &&
      loggedInUser.localUsuarioCategorias.length > 0
    ) {
      sessionLocalId = loggedInUser.localUsuarioCategorias[0].localId
    }

    // Buscar el rol correspondiente a ese localId
    let rolNombre = 'Desconocido'
    if (data.usuarioRolesLocales && data.usuarioRolesLocales.length > 0 && sessionLocalId) {
      const rolLocal = data.usuarioRolesLocales.find(
        (url) => url.localId === sessionLocalId && url.rol && url.rol.nombre
      )
      rolNombre = rolLocal ? rolLocal.rol.nombre : 'Sin rol'
    }

    usuario.value = {
      id: data.id,
      nombre: data.nombre,
      telefono: data.telefono,
      rut: data.rut,
      correo: data.correo,
      rol: rolNombre,
      localId: null,
      categoriaId: null,
    }

    formData.value = {
      nombre: data.nombre,
      telefono: data.telefono,
      rut: data.rut,
      correo: data.correo,
      contrasena: '',
      repetirContrasena: '',
      localId: null,
      categoriaId: null,
    }

    if (data.localUsuarioCategorias && data.localUsuarioCategorias.length > 0) {
      usuario.value.localId = data.localUsuarioCategorias[0].localId
      usuario.value.categoriaId = data.localUsuarioCategorias[0].categoriaId
      formData.value.localId = data.localUsuarioCategorias[0].localId
      formData.value.categoriaId = data.localUsuarioCategorias[0].categoriaId
    } else {
      errorMessage.value = 'El usuario no tiene un local o categoría asignados.'
      console.warn('El usuario a editar no tiene localUsuarioCategorias asignadas:', data)
    }
  } catch (error) {
    console.error('Error al cargar datos del usuario:', error)
    errorMessage.value =
      'Error al cargar los datos del usuario. Asegúrate de que el ID es correcto o que el usuario existe.'
  }
}

const rutRegex = /^(\d{1,2}\.?\d{3}\.?\d{3}-[\dkK])$/

const triggerSaveConfirmation = () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (
    !formData.value.nombre ||
    !formData.value.telefono ||
    !formData.value.rut ||
    !formData.value.correo
  ) {
    errorMessage.value = 'Por favor, complete todos los campos obligatorios.'
    return
  }

  if (formData.value.contrasena && formData.value.contrasena !== formData.value.repetirContrasena) {
    errorMessage.value = 'Las contraseñas no coinciden.'
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.correo)) {
    errorMessage.value = 'Por favor, ingrese un correo electrónico válido.'
    return
  }

  // Acepta RUT con o sin puntos
  if (!rutRegex.test(formData.value.rut)) {
    errorMessage.value = 'Por favor, ingrese un RUT válido (Ej: 12345678-9 o 12.345.678-9).'
    return
  }

  if (!formData.value.localId || !formData.value.categoriaId) {
    errorMessage.value =
      'No se pudo determinar el local o la categoría del usuario a editar. Verifique los datos cargados.'
    return
  }

  showSaveConfirmModal.value = true
}

const guardarUsuario = async () => {
  showSaveConfirmModal.value = false

  try {
    const payload = {
      nombre: formData.value.nombre,
      telefono: formData.value.telefono,
      rut: formData.value.rut,
      correo: formData.value.correo,
      ...(formData.value.contrasena && { contrasena: formData.value.contrasena }),
      localId: formData.value.localId,
      categoriaId: formData.value.categoriaId,
    }

    const response = await apiService.put(`usuarios/${userId.value}`, payload)

    if (response.message) {
      successMessage.value = response.message
      setTimeout(() => {
        router.push('/usuarios')
      }, 1500)
    } else {
      errorMessage.value = 'Error desconocido al actualizar el usuario.'
    }
  } catch (error) {
    console.error('Error al guardar usuario:', error)
    errorMessage.value =
      error.response?.data?.message ||
      'Error al actualizar el usuario. Verifique los datos e intente nuevamente.'
  }
}

const cancelSave = () => {
  showSaveConfirmModal.value = false
}

const volver = () => {
  router.push('/usuarios')
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
            <h2>Editar garzón</h2>
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
                  <label class="form-label" for="rut">RUT</label>
                  <input
                    id="rut"
                    v-model="formData.rut"
                    type="text"
                    class="form-control"
                    disabled
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label" for="correo">Correo electrónico</label>
                  <input
                    id="correo"
                    v-model="formData.correo"
                    type="email"
                    class="form-control"
                    disabled
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

                <div class="mb-3">
                  <label class="form-label" for="rol">Rol</label>
                  <input id="rol" v-model="usuario.rol" type="text"
class="form-control" disabled />
                </div>
              </div>
              <div class="form-container__footer">
                <button class="btn btn-outline-primary rounded-pill" type="button" @click="volver">
                  Cancelar
                </button>
                <button class="btn btn-primary rounded-pill" type="submit">Guardar cambios</button>
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
          <h4 class="modal-title">Editar usuario</h4>
          <button class="btn-close" @click="cancelCreate"></button>
        </div>
        <div class="modal-body">
          <p>
            ¿Estás seguro que deseas <strong>guardar</strong> los cambios de
            <strong>{{ formData.nombre }}</strong
            >?
          </p>
        </div>
        <div class="modal-footer justify-content-center">
          <button class="btn btn-outline-primary rounded-pill" type="button" @click="cancelSave">
            Cancelar
          </button>
          <button class="btn btn-primary rounded-pill" type="button" @click="guardarUsuario">
            Sí, guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
