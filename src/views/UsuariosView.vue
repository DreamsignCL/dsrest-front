<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api.service'
import InnerHeader from '@/components/InnerHeader.vue'
import Signature from '@/components/Signature.vue'

const router = useRouter()
const usuarios = ref([])
const local = ref(null)
const usuario = ref(null)
const isLoading = ref(true)
const mostrarMenu = ref(null)
const showDeleteModal = ref(false)
const usuarioToDelete = ref(null)
const searchTerm = ref('')

const showRelationModal = ref(false)
const relationModalType = ref('') // 'edit' | 'delete'
const relationModalUser = ref(null)
const relationModalMessage = ref('')
const relationModalRelations = ref([]) // [{ id, type }] type: 'localUsuarioCategoria' | 'usuarioRolLocal'

const handleClickOutside = (event) => {
  if (mostrarMenu.value !== null) {
    const menuElement = document.getElementById(`options-menu-${mostrarMenu.value}`);
    const menuTriggerButton = document.getElementById(`menu-trigger-${mostrarMenu.value}`);

    if (menuElement && !menuElement.contains(event.target) &&
      menuTriggerButton && !menuTriggerButton.contains(event.target)) {
      mostrarMenu.value = null;
    }
  }
};

// ACTUALIZADO: obtener local según cómo se guarda user en localStorage
const obtenerLocalYUsuario = async () => {
  try {
    // Obtener usuario desde localStorage
    const userStr = localStorage.getItem('user')
    if (userStr) {
      usuario.value = JSON.parse(userStr)
    }

    // Obtener local directamente desde localStorage
    const localStr = localStorage.getItem('local')
    let localId = null
    if (localStr) {
      const localObj = JSON.parse(localStr)
      localId = localObj.id
    }

    if (localId) {
      // Obtener datos completos del local desde la API
      const localApi = await apiService.get(`locales/${localId}`)
      if (localApi) {
        local.value = localApi
        await obtenerUsuariosPorLocal()
      } else {
        local.value = null
      }
    } else {
      local.value = null
      usuarios.value = []
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const obtenerUsuariosPorLocal = async () => {
  try {
    isLoading.value = true
    if (!local.value?.id) return

    const response = await apiService.get(`usuarios/usuarios-local/${local.value.id}`)

    if (response && usuario.value) {
      usuarios.value = response.usuarios.filter(
        (user) => user.id !== usuario.value.id
      )
    } else if (response) {
      usuarios.value = response.usuarios
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    isLoading.value = false
  }
}

const irANuevoUsuario = () => {
  router.push('/usuarios/nuevo')
}

// Método para alternar la visibilidad de las opciones
const toggleUserActive = (usuario) => {
  // Cerrar todos los demás menús primero
  usuarios.value.forEach(u => {
    if (u.id !== usuario.id) {
      u.isActive = false
    }
  })
  // Alternar el estado del plato actual
  usuario.isActive = !usuario.isActive
}

const editarUsuario = (id) => {
  const usuarioItem = usuarios.value.find(u => u.id === id)
  if (!usuarioItem) return

  // Verifica si está asociado a más de un local
  const localesRelacionados = new Set()
  if (usuarioItem.localUsuarioCategorias && usuarioItem.localUsuarioCategorias.length > 0) {
    usuarioItem.localUsuarioCategorias.forEach(luc => localesRelacionados.add(luc.localId))
  }
  if (usuarioItem.usuarioRolesLocales && usuarioItem.usuarioRolesLocales.length > 0) {
    usuarioItem.usuarioRolesLocales.forEach(url => localesRelacionados.add(url.localId))
  }

  // Si está en más de un local y uno de ellos es el local de la sesión, bloquea edición
  if (localesRelacionados.size > 1 && localesRelacionados.has(local.value.id)) {
    relationModalType.value = 'edit'
    relationModalUser.value = usuarioItem
    relationModalMessage.value = 'No puedes editar los datos de este usuario porque está asociado a otro local.'
    showRelationModal.value = true
    mostrarMenu.value = null
    return
  }

  // Si solo está en el local de la sesión, permite editar
  router.push(`/usuarios/${id}/editar`)
  mostrarMenu.value = null
}

const confirmarEliminarUsuario = (usuarioItem) => {
  // Verifica si está asociado a más de un local
  const localesRelacionados = new Set()
  if (usuarioItem.localUsuarioCategorias && usuarioItem.localUsuarioCategorias.length > 0) {
    usuarioItem.localUsuarioCategorias.forEach(luc => localesRelacionados.add(luc.localId))
  }
  if (usuarioItem.usuarioRolesLocales && usuarioItem.usuarioRolesLocales.length > 0) {
    usuarioItem.usuarioRolesLocales.forEach(url => localesRelacionados.add(url.localId))
  }

  // Si está en más de un local y uno de ellos es el local de la sesión, muestra modal especial
  if (localesRelacionados.size > 1 && localesRelacionados.has(local.value.id)) {
    relationModalType.value = 'delete'
    relationModalUser.value = usuarioItem
    relationModalMessage.value = 'Este usuario está asociado a otro local. ¿Deseas eliminar solo la relación con este local?'
    // Busca las relaciones a eliminar (del local de la sesión)
    const relations = []
    if (usuarioItem.localUsuarioCategorias) {
      usuarioItem.localUsuarioCategorias.forEach(luc => {
        if (luc.localId === local.value.id) {
          relations.push({ id: luc.id, type: 'localUsuarioCategoria' })
        }
      })
    }
    if (usuarioItem.usuarioRolesLocales) {
      usuarioItem.usuarioRolesLocales.forEach(url => {
        if (url.localId === local.value.id) {
          relations.push({ id: url.id, type: 'usuarioRolLocal' })
        }
      })
    }
    relationModalRelations.value = relations
    showRelationModal.value = true
    mostrarMenu.value = null
    return
  }

  // Si solo está en el local de la sesión, permite eliminar normalmente
  usuarioToDelete.value = usuarioItem
  showDeleteModal.value = true
  mostrarMenu.value = null
}

const eliminarUsuario = async () => {
  if (!usuarioToDelete.value) return

  try {
    await apiService.delete(`usuarios/${usuarioToDelete.value.id}`)

    await obtenerUsuariosPorLocal()

    showDeleteModal.value = false
    usuarioToDelete.value = null
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

const eliminarRelacionesUsuario = async () => {
  try {
    for (const rel of relationModalRelations.value) {
      if (rel.type === 'localUsuarioCategoria') {
        await apiService.delete(`localUsuarioCategoria/${rel.id}`)
      } else if (rel.type === 'usuarioRolLocal') {
        await apiService.delete(`usuarioRolLocal/${rel.id}`)
      }
    }
    await obtenerUsuariosPorLocal()
    showRelationModal.value = false
    relationModalUser.value = null
    relationModalRelations.value = []
  } catch (error) {
    alert('Error al eliminar la relación. Intente nuevamente.')
  }
}

const cancelarEliminarUsuario = () => {
  showDeleteModal.value = false
  usuarioToDelete.value = null
}

const cerrarRelationModal = () => {
  showRelationModal.value = false
  relationModalUser.value = null
  relationModalRelations.value = []
}

const formatFecha = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

onMounted(() => {
  obtenerLocalYUsuario();
  document.addEventListener('click', handleClickOutside);
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
})

const localNombre = computed(() => {
  return local.value?.nombreFantasia || local.value?.nombre || 'Mi Local'
})

const filteredUsers = computed(() => {
  if (!searchTerm.value) {
    return usuarios.value;
  }
  const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
  return usuarios.value.filter(usuarioItem =>
    usuarioItem.nombre.toLowerCase().includes(lowerCaseSearchTerm)
  );
});

const toggleMenu = (id) => {
  if (mostrarMenu.value === id) {
    mostrarMenu.value = null
  } else {
    mostrarMenu.value = id
  }
}
</script>

<template>
  <div class="page page--backoffice">
    <InnerHeader />
    <main>
      <div class="page-content page-content--backoffice">
        <div class="page-content__header">
          <div class="user-logo">
            <div class="user-logo__image">
              <img v-if="local?.foto" :src="local.foto" alt="Logo del Local" />
              <img v-else src="../../src/assets/img/no-logo.png" alt="Sin logo" />
            </div>
          </div>

          <div class="title">
            <h2>Garzones</h2>
          </div>
        </div>

        <div class="page-content__body">
          <div class="list-filters">
            <input class="form-control" type="search" v-model="searchTerm" placeholder="Buscar garzón por nombre..." />
          </div>

          <div class="element-list">
            <div v-if="isLoading" class="loader"></div>

            <div v-else-if="filteredUsers.length === 0" class="empty-state text-center py-5">
              <div class="no-image mb-3"></div>
              <p>No hay garzones que coincidan con tu búsqueda o no hay garzones en este local.</p>
            </div>

            <button v-else v-for="usuarioItem in filteredUsers" 
              class="element-item element-item--waiter"
              type="button"
              :key="usuarioItem.id" 
              :class="{ active: usuarioItem.isActive }" 
              @click="toggleUserActive(usuarioItem)">
              <!--
                <pre>{{ JSON.stringify(usuarioItem, null, 2) }}</pre>
              -->
              <div class="element-item__switch" @click.stop>
                <label class="switch switch--vertical">
                  <input type="checkbox" :checked="usuarioItem.estado" />
                  <span class="slider round"></span>
                </label>
              </div>
              <div class="element-item__text">
                {{ usuarioItem.nombre }}<br>
                <span>
                {{
                  usuarioItem.usuarioRolesLocales && usuarioItem.usuarioRolesLocales.length > 0
                    ? (
                      usuarioItem.usuarioRolesLocales.find(
                        url => url.localId === local?.id && url.rol && url.rol.nombre
                      )?.rol.nombre || 'Sin rol'
                    )
                    : 'Sin rol'
                }}
                </span>
              </div>
              <div class="element-item__text">
                
              </div>
              <div class="element-item__text">
                {{ formatFecha(usuarioItem.createdAt) }}
              </div>

              <div class="element-item__options-menu">
                <button class="btn btn-option" @click="editarUsuario(usuarioItem.id)">
                  <img src="../assets/img/edit-icon.svg" alt="Editar" />
                </button>
                <button class="btn btn-option" @click="confirmarEliminarUsuario(usuarioItem)">
                  <img src="../assets/img/delete-icon.svg" alt="Eliminar" />
                </button>
                <button class="btn btn-option">
                  <img src="../assets/img/close-skyblue-icon.svg" alt="Cerrar" />
                </button>
              </div>
            </button>
          </div>

          <div class="content-footer">
            <div class="d-grid gap-2">
              <button class="btn btn-primary rounded-pill" @click="irANuevoUsuario">
                Nuevo garzón
              </button>
            </div>
            <Signature />
          </div>
        </div>
      </div>
    </main>

    <div v-if="showDeleteModal" class="modal animate__animated animate__fadeIn" @click="cancelarEliminarUsuario">
      <div class="modal-content animate__animated animate__fadeInUp" @click.stop>
        <div class="modal-header">
          <h4 class="modal-title">Eliminar garzón</h4>
          <button class="btn-close" @click="cancelarEliminarUsuario"></button>
        </div>
        <div class="modal-body">
          <p>
            <strong class="text-danger">La siguiente acción no se puede deshacer y eliminará todas sus relaciones.</strong><br>
            ¿Estás seguro que deseas eliminar a <strong>{{ usuarioToDelete?.nombre }}</strong>?
          </p>
        </div>
        <div class="modal-footer justify-content-center">
          <button class="btn btn-outline-primary rounded-pill" type="button" @click="cancelarEliminarUsuario">Cancelar</button>
          <button class="btn btn-danger rounded-pill" type="button" @click="eliminarUsuario">Sí, eliminar</button>
        </div>
      </div>
    </div>

    <div v-if="showRelationModal" class="modal animate__animated animate__fadeIn" @click="cerrarRelationModal">
      <div class="modal-content animate__animated animate__fadeInUp" @click.stop>
        <div class="modal-header">
          <h4 class="modal-title">Eliminar relación</h4>
          <button class="btn-close" @click="cerrarRelationModal"></button>
        </div>
        <div class="modal-body">
          <p>
            <span v-if="relationModalType === 'edit'">
              {{ relationModalMessage }}
            </span>
            <span v-else-if="relationModalType === 'delete'">
              {{ relationModalMessage }}
            </span>
          </p>
        </div>
        <div v-if="relationModalType === 'delete'" class="modal-footer justify-content-center">
          <button class="btn btn-outline-primary rounded-pill" type="button" @click="cerrarRelationModal">
            Cancelar
          </button>
          <button class="btn btn-danger rounded-pill" type="button" @click="eliminarRelacionesUsuario">
            Sí, eliminar relación
          </button>
        </div>

        <div v-else class="modal-footer justify-content-center">
          <button class="btn btn-outline-primary rounded-pill" type="button" @click="cerrarRelationModal">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>