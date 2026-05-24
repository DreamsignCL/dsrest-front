<template>
  <header>
    <button 
      class="btn btn-header"
      type="button" 
      @click="$emit('open-qr')">
      <img src="../assets/img/qrcode-icon.svg" alt="QR Code" />
    </button>

    <div class="dropdown">
      <button class="btn btn-header btn--menu" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><button class="dropdown-item" @click="goToPlatos">Inicio</button></li>
        
        <!-- Editar perfil: ahora visible para cualquier usuario -->
        <li><button class="dropdown-item" @click="editProfile">Mi perfil</button></li>
        
        <!-- Escritorio de garzón: solo para Administrador y categoría 2, 3 o 4 -->
        <li><button v-if="isAdmin && isCategoria234" class="dropdown-item" @click="goToGarzon">Atención de clientes</button></li>
        <li><button v-if="isAdmin && isCategoria234" class="dropdown-item" @click="goToCaja">Gestión de caja</button></li>
        
        <!-- Opciones avanzadas solo para Administrador en el local de sesión y no categoría 1 -->
        <template v-if="isAdmin && !isCategoria1">
          <li><button class="dropdown-item" @click="goToUsuarios">Garzones</button></li>
          <li><button class="dropdown-item" @click="goToMesas">Mesas</button></li>
          
          <!-- Zonas: solo para Administrador y categoría 3 o 4 -->
          <li><button v-if="isCategoria34" class="dropdown-item" @click="goToZonas">Zonas</button></li>
          
          <!-- Categorías de productos: para Administrador -->
          <li><button class="dropdown-item" @click="goToCategorias">Categorías</button></li>
        </template>
        
        <li><button class="dropdown-item text-danger" @click="confirmLogout">Cerrar sesión</button></li>
      </ul>
    </div>
  </header>

  <!-- Modal de confirmación de cierre de sesión -->
  <div v-if="showLogoutModal" class="modal animate__animated animate__fadeIn" @click="showLogoutModal = false">
    <div class="modal-content animate__animated animate__fadeInUp" @click.stop>
      <div class="modal-header">
        <h4 class="modal-title">Cerrar sesión</h4>
        <button class="btn-close" type="button" @click="showLogoutModal = false"></button>
      </div>
      <div class="modal-body">
        <p>¿Estás seguro de que quieres cerrar sesión?</p>
      </div>
      <div class="modal-footer justify-content-center">
        <button class="btn btn-outline-primary rounded-pill" @click="showLogoutModal = false">Cancelar</button>
        <button class="btn btn-danger rounded-pill" @click="logout">Sí, cerrar sesión</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { hasCategory, hasRole } from '../helpers/auth';

export default {
  name: "InnerHeader",
  emits: ['open-qr'],
  setup() {
    const router = useRouter();
    const menuOpen = ref(false);
    const menuContainer = ref(null);
    const showLogoutModal = ref(false);

    // Obtener usuario y localId de la sesión
    const user = computed(() => {
      return JSON.parse(localStorage.getItem('user'));
    });
    const sessionLocalId = computed(() => {
      const local = JSON.parse(localStorage.getItem('local'));
      return local?.id ?? null;
    });

    // Verificar si es categoría 1 (por local de sesión)
    const isCategoria1 = computed(() => {
      return user.value && hasCategory(user.value, 'Categoria 1', sessionLocalId.value);
    });

    // Verificar si es Administrador en el local de sesión
    const isAdmin = computed(() => {
      return user.value && hasRole(user.value, 'Administrador', sessionLocalId.value);
    });

    // Verificar si es Garzon en el local de sesión
    const isGarzon = computed(() => {
      return user.value && hasRole(user.value, 'Garzon', sessionLocalId.value);
    });

    // Verificar si es categoría 2, 3 o 4 en el local de sesión
    const isCategoria234 = computed(() => {
      return user.value && (
        hasCategory(user.value, 'Categoria 2', sessionLocalId.value) ||
        hasCategory(user.value, 'Categoria 3', sessionLocalId.value) ||
        hasCategory(user.value, 'Categoria 4', sessionLocalId.value)
      );
    });

    // Verificar si es categoría 3 o 4 en el local de sesión (para Zonas)
    const isCategoria34 = computed(() => {
      return user.value && (
        hasCategory(user.value, 'Categoria 3', sessionLocalId.value) ||
        hasCategory(user.value, 'Categoria 4', sessionLocalId.value)
      );
    });

    // Métodos de navegación
    const editProfile = () => {
      if (isGarzon.value && !isAdmin.value && !isCategoria1.value) {
        router.push('/editar-perfil-garzon');
      } else {
        router.push('/editar-perfil');
      }
    };

    const goToPlatos = () => {
      if (isGarzon.value) {
        router.push('/garzon');
      } else {
        router.push('/platos');
      }
    };

    const goToUsuarios = () => {
      router.push('/usuarios');
    };

    const goToMesas = () => {
      router.push('/mesas');
    };

    const goToZonas = () => {
      router.push('/zonas');
    };

    const goToCategorias = () => {
      router.push('/categorias');
    };

    const goToGarzon = () => {
      router.push('/garzon');
    };

    const goToCaja = () => {
      router.push('/caja');
    };

    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('local');
      sessionStorage.clear();
      router.push('/');
    };

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
    };

    const confirmLogout = () => {
      showLogoutModal.value = true;
    };

    const handleClickOutside = (event) => {
      if (menuContainer.value && !menuContainer.value.contains(event.target)) {
        menuOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return { 
      menuOpen,
      menuContainer,
      showLogoutModal,
      user,
      isCategoria1,
      isAdmin,
      isGarzon,
      isCategoria234,
      isCategoria34,
      editProfile,
      goToPlatos,
      goToUsuarios,
      goToMesas,
      goToZonas,
      goToGarzon,
      goToCaja,
      goToCategorias,
      logout,
      toggleMenu,
      confirmLogout
    };
  }
};
</script>