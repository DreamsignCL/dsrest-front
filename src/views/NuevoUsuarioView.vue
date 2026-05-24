<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api.service'
import InnerHeader from '@/components/InnerHeader.vue'
import Signature from '@/components/Signature.vue'

const router = useRouter()

const formData = ref({
  nombre: '',
  telefono: '',
  rut: '',
  correo: '',
  contrasena: '',
  repetirContrasena: '',
  localId: null,
  categoriaId: null
})

const localLogoSrc = ref('../assets/img/no-logo.png')
const errorMessage = ref('')
const successMessage = ref('')
const showCreateConfirmModal = ref(false)
const showUserExistsModal = ref(false)
const usuarioExistente = ref({
  id: null,
  nombre: '',
  correo: '',
  rut: ''
})

onMounted(() => {
  inicializarDatosSesion()
})

const inicializarDatosSesion = () => {
  // Obtener local desde localStorage
  const localStr = localStorage.getItem('local')
  let localId = null
  if (localStr) {
    const localObj = JSON.parse(localStr)
    formData.value.localId = localObj.id
    localId = localObj.id
    if (localObj.foto) {
      localLogoSrc.value = localObj.foto
    }
  }

  // Buscar categoriaId en el user según el localId
  const userStr = localStorage.getItem('user')
  if (userStr && localId) {
    const userObj = JSON.parse(userStr)
    // Busca la relación local-usuario-categoría
    if (Array.isArray(userObj.localUsuarioCategorias)) {
      const relacion = userObj.localUsuarioCategorias.find(
        (rel) => rel.localId === localId
      )
      if (relacion) {
        formData.value.categoriaId = relacion.categoriaId
      }
    }
  }

  // Si no se encontró local o categoriaId, muestra error
  if (!formData.value.localId || !formData.value.categoriaId) {
    errorMessage.value = 'No se pudo obtener la información del local o la categoría de la sesión. Asegúrese de que hay un local seleccionado y que el usuario tiene acceso.'
    console.error('No se encontró el local o la categoría en localStorage.');
  }
}

const triggerCreateConfirmation = () => {
  errorMessage.value = ''
  successMessage.value = ''

  // Validar campos obligatorios para ambos casos
  if (!formData.value.nombre || !formData.value.telefono || !formData.value.rut || !formData.value.correo) {
    errorMessage.value = 'Por favor, complete todos los campos.'
    return
  }

  // Solo validar contraseña si el usuario NO existe
  if (!usuarioExistente.value.id) {
    if (!formData.value.contrasena || !formData.value.repetirContrasena) {
      errorMessage.value = 'Por favor, complete todos los campos.'
      return
    }
    if (formData.value.contrasena !== formData.value.repetirContrasena) {
      errorMessage.value = 'Las contraseñas no coinciden.'
      return
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.correo)) {
    errorMessage.value = 'Por favor, ingrese un correo electrónico válido.'
    return
  }

  const rutRegex = /^(\d{1,2}\.?\d{3}\.?\d{3}-[\dkK])$/;
  if (!rutRegex.test(formData.value.rut)) {
    errorMessage.value = 'Por favor, ingrese un RUT válido (Ej: 12.345.678-9).'
    return
  }

  if (!formData.value.localId || !formData.value.categoriaId) {
    errorMessage.value = 'No se pudo determinar el local o la categoría para asignar el usuario. Recargue la página o revise la sesión del administrador.'
    return
  }

  showCreateConfirmModal.value = true;
}


const guardarUsuario = async () => {
  showCreateConfirmModal.value = false;


  formData.value.rut = formatRut(formData.value.rut);

  try {
    if (usuarioExistente.value.id) {
      const payload = {
        userId: usuarioExistente.value.id,
        localId: formData.value.localId,
        categoriaId: formData.value.categoriaId
      }
      const response = await apiService.post('usuarios/asignar-garzon', payload)
      if (response.message) {
        successMessage.value = response.message
        setTimeout(() => {
          router.push('/usuarios')
        }, 1500)
      } else {
        errorMessage.value = 'Error desconocido al asignar el usuario.'
      }
      return
    }

    // Si no existe, crear usuario normalmente
    const payload = {
      nombre: formData.value.nombre,
      telefono: formData.value.telefono,
      rut: formData.value.rut,
      correo: formData.value.correo,
      contrasena: formData.value.contrasena,
      localId: formData.value.localId,
      categoriaId: formData.value.categoriaId
    }

    const response = await apiService.post('usuarios/crear-garzon', payload)

    if (response.message) {
      successMessage.value = response.message
      setTimeout(() => {
        router.push('/usuarios')
      }, 1500)
    } else {
      errorMessage.value = 'Error desconocido al crear el usuario.'
    }
  } catch (error) {
    const mensaje = error.data?.message || ''
    errorMessage.value = mensaje || 'Error al crear o asignar el usuario. Verifique los datos e intente nuevamente.'
  }
}

const cancelCreate = () => {
  showCreateConfirmModal.value = false;
}

const volver = () => {
  router.push('/usuarios')
}

watch(() => formData.value.rut, async (nuevoRut) => {
  if (nuevoRut && nuevoRut !== formatRut(nuevoRut)) {
    formData.value.rut = formatRut(nuevoRut);
    return;
  }

  const rutSinFormato = (nuevoRut || '').replace(/[^\dkK]/gi, '');
  if (!rutSinFormato || rutSinFormato.length < 9) {
    formData.value.nombre = '';
    formData.value.correo = '';
    formData.value.telefono = '';
    formData.value.contrasena = '';
    formData.value.repetirContrasena = '';
    usuarioExistente.value = { id: null, nombre: '', correo: '', rut: '' }
    return;
  }


  const rutRegex = /^(\d{1,2}\.?\d{3}\.?\d{3}-[\dkK])$/;
  if (!rutRegex.test(nuevoRut)) {
    formData.value.nombre = '';
    formData.value.correo = '';
    formData.value.telefono = '';
    formData.value.contrasena = '';
    formData.value.repetirContrasena = '';
    usuarioExistente.value = { id: null, nombre: '', correo: '', rut: '' }
    return;
  }


  try {
    const usuario = await apiService.get(`usuarios/por-rut/${nuevoRut}`);
    if (usuario && usuario.id) {
      formData.value.nombre = usuario.nombre;
      formData.value.correo = usuario.correo;
      formData.value.telefono = usuario.telefono || '';
      usuarioExistente.value = {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rut: usuario.rut
      }
    } else {
      usuarioExistente.value = { id: null, nombre: '', correo: '', rut: '' }
    }
  } catch (e) {
    usuarioExistente.value = { id: null, nombre: '', correo: '', rut: '' }
  }
})

function formatRut(rut) {
  rut = rut.replace(/[^\dkK]/g, '').toUpperCase();
  rut = rut.slice(0, 9);
  if (rut.length < 2) return rut;
  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1);

  return `${cuerpo}-${dv}`;
}

formData.value.rut = formatRut(formData.value.rut);
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
            <h2>Nuevo garzón</h2>
          </div>
        </div>

        <div class="page-content__body">
          <form @submit.prevent="triggerCreateConfirmation">
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
                  <input id="rut" class="form-control" type="text" v-model="formData.rut" placeholder="Ej: 12345678-9" />
                </div>
    
                <div class="mb-3">
                  <label class="form-label" for="nombre">Nombre Completo</label>
                  <input id="nombre" class="form-control" type="text" v-model="formData.nombre" :disabled="!!usuarioExistente.id" placeholder="Ingrese nombre completo" />
                </div>
    
                <div class="mb-3">
                  <label class="form-label" for="telefono">Teléfono</label>
                  <input id="telefono" class="form-control" type="text" v-model="formData.telefono" placeholder="Ingrese número de teléfono" />
                </div>
    
                <div class="mb-3">
                  <label class="form-label" for="correo">Email</label>
                  <input id="correo" class="form-control" type="email" v-model="formData.correo" :disabled="!!usuarioExistente.id" placeholder="Ingrese correo electrónico" />
                </div>
    
                <!-- CONTRASEÑA SOLO SI NO EXISTE EL USUARIO -->
                <div v-if="!usuarioExistente.id">
                  <div class="mb-3">
                    <label class="form-label" for="contrasena">Contraseña</label>
                    <input id="contrasena" class="form-control" type="password" v-model="formData.contrasena" placeholder="Ingrese contraseña"  />
                  </div>
    
                  <div class="mb-3">
                    <label class="form-label" for="repetirContrasena">Repetir contraseña</label>
                    <input id="repetirContrasena" class="form-control" type="password" v-model="formData.repetirContrasena" placeholder="Repita la contraseña"  />
                  </div>
                </div>
              </div>
              <div class="form-container__footer">
                <button class="btn btn-outline-primary rounded-pill" type="button" @click="volver">Volver</button>
                <button class="btn btn-primary rounded-pill" type="submit">Guardar garzón</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>

    <div v-if="showCreateConfirmModal" class="modal animate__animated animate__fadeIn" @click="cancelCreate">
      <div class="modal-content animate__animated animate__fadeInUp" @click.stop>
        <div class="modal-header">
          <h4 class="modal-title">Nuevo usuario</h4>
          <button class="btn-close" @click="cancelCreate"></button>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro que deseas <strong>crear</strong> el garzón <strong>{{ formData.nombre }}</strong>?</p>
        </div>
        <div class="modal-footer justify-content-center">
          <button class="btn btn-outline-primary rounded-pill" type="button" @click="cancelCreate">Cancelar</button>
          <button class="btn btn-primary rounded-pill" type="button" @click="guardarUsuario">Sí, crear</button>
        </div>
      </div>
    </div>

  </div>
</template>