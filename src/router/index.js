import { createRouter, createWebHistory } from 'vue-router'
import PrimerPlatoView from '@/views/onboarding/PrimerPlatoView.vue'
import ExitoView from '@/views/onboarding/ExitoView.vue'
import CartaPublicaView from '@/views/carta/CartaPublicaView.vue'
import AuthSystem2 from '@/components/auth/AuthSystem2.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: '',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/RegisterView.vue'),
        },
        {
          path: 'register/check-email',
          name: 'register-check-email',
          component: () => import('@/views/auth/CheckEmailView.vue'),
        },
        {
          path: 'verify-email/:token',
          name: 'verify-email',
          component: () => import('@/views/auth/VerifyEmailView.vue'),
        },        
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('@/views/auth/ForgotPasswordView.vue'),
        },
        {
          path: 'forgot-password/check-email',
          name: 'forgot-password-check-email',
          component: () => import('@/views/auth/ForgotPasswordCheckEmailView.vue'),
        },
        {
          path: 'reset-password/:token',
          name: 'reset-password',
          component: () => import('@/views/auth/ResetPasswordView.vue'),
        },
        {
          path: 'reset-password/success',
          name: 'reset-password-success',
          component: () => import('@/views/auth/ResetPasswordSuccessView.vue'),
        },
      ],
    },
    {
      path: '/app',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true, allowedRoles: ['Administrador'] },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
        },

        //Dishes
        
        {
          path: 'dishes',
          name: 'dishes',
          component: () => import('@/views/dishes/DishesView.vue'),
        },
        {
          path: 'dishes/new',
          name: 'new-dish',
          component: () => import('@/views/dishes/NewDishView.vue'),
        },
        {
          path: 'dishes/edit/:id',
          name: 'edit-dish',
          component: () => import('@/views/dishes/EditDishView.vue'),
        },

        //Orders
        
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/views/orders/OrdersView.vue'),
        },
        {
          path: 'orders/new',
          name: 'new-order',
          component: () => import('@/views/orders/NewOrderView.vue'),
        },
        {
          path: 'orders/edit/:id',
          name: 'edit-order',
          component: () => import('@/views/orders/EditOrderView.vue'),
        },

        //Profile
        
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/profile/ProfileView.vue'),
        },
        
      ]
    },
    {
      path: '/carta/:nombreLocal',
      name: 'CartaPublica',
      component: CartaPublicaView,
      // No requiere autenticación
      meta: { requiresAuth: false },
    },
    {
      path: '/editar-perfil',
      name: 'editar-perfil',
      component: () => import('../views/EditarPerfil.vue'),
      meta: { requiresAuth: true, allowedRoles: ['Administrador'] },
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: () => import('../views/UsuariosView.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Administrador'],
        allowedCategories: ['Categoria 2', 'Categoria 3', 'Categoria 4'],
      },
    },
    {
      path: '/usuarios/nuevo',
      name: 'nuevo-usuario',
      component: () => import('../views/NuevoUsuarioView.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Administrador'],
        allowedCategories: ['Categoria 2', 'Categoria 3', 'Categoria 4'],
      },
    },
    {
      path: '/usuarios/:id/editar',
      name: 'editar-usuario',
      component: () => import('../views/EditarUsuarioView.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Administrador'],
        allowedCategories: ['Categoria 2', 'Categoria 3', 'Categoria 4'],
      },
    },
    {
      path: '/mesas',
      name: 'lista-mesas',
      component: () => import('../views/mesas/Mesasview.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Administrador'],
        allowedCategories: ['Categoria 2', 'Categoria 3', 'Categoria 4'],
      },
    },
    {
      path: '/mesas/nuevo',
      name: 'nueva-mesas',
      component: () => import('../views/mesas/NuevaMesaView.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Administrador'],
        allowedCategories: ['Categoria 2', 'Categoria 3', 'Categoria 4'],
      },
    },
    {
      path: '/mesas/:id/editar',
      name: 'editar-mesa',
      component: () => import('../views/mesas/EditarMesaView.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Administrador'],
        allowedCategories: ['Categoria 2', 'Categoria 3', 'Categoria 4'],
      },
    },
    {
      path: '/garzon',
      name: 'lista-atenciones',
      component: () => import('../views/garzon/GarzonView.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Garzon', 'Administrador'],
        allowedCategories: ['Categoria 2', 'Categoria 3', 'Categoria 4'],
      },
    },
    {
      path: '/garzon/nuevaatencion',
      name: 'nueva-atencion',
      component: () => import('../views/garzon/NuevaAtencion.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Garzon', 'Administrador'],
        allowedCategories: ['Categoria 2', 'Categoria 3', 'Categoria 4'],
      },
    },
    {
      path: '/no-autorizado',
      name: 'no-autorizado',
      component: () => import('../views/NoAutorizado.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/garzon/editaratencion/:id',
      name: 'editar-atencion',
      component: () => import('@/views/garzon/EditarAtencionView.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Garzon', 'Administrador'],
        allowedCategories: ['Categoria 2', 'Categoria 3', 'Categoria 4'],
      },
    },
    {
      path: '/garzon/pedido/:id',
      name: 'detalle-pedido',
      component: () => import('@/views/garzon/DetallePedidoView.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Garzon', 'Administrador'],
        allowedCategories: ['Categoria 2', 'Categoria 3', 'Categoria 4'],
      },
    },
    {
      path: '/garzon/veratencion/:id',
      name: 'ver-atencion',
      component: () => import('@/views/garzon/VerAtencionView.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Garzon', 'Administrador'],
        allowedCategories: ['Categoria 2', 'Categoria 3', 'Categoria 4'],
      },
    },
    {
      path: '/zonas',
      name: 'lista-zonas',
      component: () => import('../views/zonas/ZonasView.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Administrador'],
        allowedCategories: ['Categoria 3', 'Categoria 4'],
      },
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: () => import('../views/CategoriasView.vue'),
      meta: { requiresAuth: true, allowedRoles: ['Administrador'] },
    },
    {
      path: '/categorias-plato',
      name: 'categorias-plato',
      redirect: '/categorias',
      meta: { requiresAuth: true, allowedRoles: ['Administrador'] },
    },
    {
      path: '/categorias-plato/nueva',
      name: 'nueva-categoria-plato',
      component: () => import('../views/categorias-plato/NuevaCategoriaPlatoView.vue'),
      meta: { requiresAuth: true, allowedRoles: ['Administrador'] },
    },
    {
      path: '/categorias-plato/:id/editar',
      name: 'editar-categoria-plato',
      component: () => import('../views/categorias-plato/EditarCategoriaPlatoView.vue'),
      meta: { requiresAuth: true, allowedRoles: ['Administrador'] },
    },
    {
      path: '/caja',
      name: 'gestion-caja',
      component: () => import('../views/caja/GestionCajaView.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Administrador'],
        allowedCategories: ['Categoria 2', 'Categoria 3', 'Categoria 4'],
      },
    },
    {
      path: '/editar-perfil-garzon',
      name: 'editar-perfil-garzon',
      component: () => import('../views/garzon/EditarPerfilGarzon.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Garzon'],
        allowedCategories: ['Categoria 2', 'Categoria 3', 'Categoria 4'],
      },
    },
  ],
})

// Guardia de navegación
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  const local = JSON.parse(localStorage.getItem('local'))
  const sessionLocalId = local?.id || user?.localUsuarioCategorias?.[0]?.localId || null

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      return next('/')
    }

    // Verificar roles SOLO para el local de la sesión
    if (to.meta.allowedRoles) {
      const userRoles =
        user?.usuarioRolesLocales
          ?.filter((url) => url.localId === sessionLocalId)
          ?.map((url) => url.rol?.nombre) || []
      if (!user || !userRoles.some((rolNombre) => to.meta.allowedRoles.includes(rolNombre))) {
        return next('/no-autorizado')
      }
    }

    // Verificar categorías SOLO para el local de la sesión
    if (to.meta.allowedCategories) {
      let hasCategory = false
      if (user.localUsuarioCategorias && user.localUsuarioCategorias.length > 0) {
        hasCategory = user.localUsuarioCategorias.some(
          (luc) =>
            luc.localId === sessionLocalId &&
            luc.categoria &&
            to.meta.allowedCategories.includes(luc.categoria.nombre)
        )
      }
      if (!hasCategory) {
        return next('/no-autorizado')
      }
    }

    // Validación especial para editar usuario: no permitir si el usuario está en más de un local
    if (to.name === 'editar-usuario' && to.params.id) {
      try {
        // Obtener datos del usuario a editar (puedes ajustar el endpoint si es diferente)
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || ''}/usuarios/${to.params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        if (response.ok) {
          const usuarioEditar = await response.json()
          // Reunir todos los locales relacionados
          const localesRelacionados = new Set()
          if (
            usuarioEditar.localUsuarioCategorias &&
            usuarioEditar.localUsuarioCategorias.length > 0
          ) {
            usuarioEditar.localUsuarioCategorias.forEach((luc) =>
              localesRelacionados.add(luc.localId)
            )
          }
          if (usuarioEditar.usuarioRolesLocales && usuarioEditar.usuarioRolesLocales.length > 0) {
            usuarioEditar.usuarioRolesLocales.forEach((url) => localesRelacionados.add(url.localId))
          }
          // Si está en más de un local y uno es el de la sesión, bloquear acceso
          if (localesRelacionados.size > 1 && localesRelacionados.has(sessionLocalId)) {
            return next('/no-autorizado')
          }
        }
      } catch {
        // Si hay error al consultar, por seguridad no permitir acceso
        return next('/no-autorizado')
      }
    }
  }

  next()
})

export default router
