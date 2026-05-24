<template>
  <div class="page page--login" :class="currentView">
    <AppHeader />
    
    <main>
      <!-- Login Form -->
      <LoginForm 
        v-if="currentView === 'login'" 
        :form="loginForm" 
        :is-loading="isLoading" 
        :login-errors="loginErrors"
        :login-message="loginMessage" 
        :login-error="loginError" 
        @switch-view="currentView = $event" 
        @show-role-modal="showRoleModal" 
        @update:form="loginForm = $event" 
        @login="performLogin" />

      <!-- Modal de selección de rol -->
      <RoleSelectionModal 
        v-if="showRoleSelection" 
        :show="showRoleSelection" 
        @close="closeRoleModal"
        @select-role="selectRole"/>

      <!-- Formularios de registro con pasos -->
      <div v-if="currentView === 'register' || currentView === 'email-verification' || currentView === 'plan-selection'" class="page-content page-content--form-steps animate__animated animate__fadeInUp">          
        <div class="page-content__header">
          <div class="progress-steps">
            <div 
              v-for="step in 4" 
              :key="step" 
              class="step" 
              :class="{ 
                'active': currentStep === step,
                'completed': currentStep > step 
              }"
            >
              {{ step }}
            </div>
          </div>
        </div>
        
        <div class="page-content__body">

          <!-- Paso 1: Register Form - Usuario -->
          <RegisterUserForm 
            v-if="currentView === 'register' && !showLocalForm && !showPlanSelection"
            class="animate__animated animate__fadeIn"
            :form="registerForm" 
            :confirm-password="confirmPassword" 
            :is-loading="isLoading"
            :register-errors="registerErrors" 
            @switch-view="currentView = $event" 
            @register="register"
            @update:form="registerForm = $event" 
            @update:confirm-password="confirmPassword = $event" 
          />

          <!-- Paso 2: Verificacion por correo -->
          <EmailVerification
            v-if="currentView === 'email-verification'"
            class="animate__animated animate__fadeIn"
            :email="registerForm.correo"
            :code="verificationCode" 
            :is-loading="isLoading" 
            :verification-error="verificationError"
            :verification-message="verificationMessage" 
            :resend-cooldown="resendCooldown" 
            @verify="verifyEmailCode"
            @resend="resendVerificationCode" 
            @update:code="verificationCode = $event" 
          />

          <!-- Paso 3: Register Form - Local -->
          <RegisterLocalForm 
            v-if="currentView === 'register' && showLocalForm && !showPlanSelection"
            class="animate__animated animate__fadeIn"
            :form="localForm" 
            :foto-preview="fotoPreview" 
            :is-loading="isLoading"
            :local-errors="localErrors" 
            :register-message="registerMessage" 
            :register-error="registerError"
            :nombre-empresa="nombreEmpresa" 
            :buscando-empresa="buscandoEmpresa"
            :error-busqueda-empresa="errorBusquedaEmpresa" 
            :tipos="tipos" 
            @back="backToUserForm"
            @register="goToPlanSelection" 
            @buscar-empresa="buscarEmpresaPorRut" 
            @update:form="localForm = $event"
            @error="handleLocalFormError" 
          />

          <!-- Paso 4: Selección de Plan -->
          <PlanSelection
            v-if="currentView === 'register' && showPlanSelection"
            class="animate__animated animate__fadeIn"
            :is-loading="isLoading"
            @confirm="completarRegistro"
            @back="backToLocalForm"
            @update:selectedPlan="selectedPlan = $event"
          />
        </div>
      </div>

      <ForgotPasswordForm v-if="currentView === 'forgot'" :email="forgotEmail" @switch-view="currentView = $event"
        @update:email="forgotEmail = $event" @recover-password="recoverPassword" />

      <UserExistsModal v-if="showUserExistsModal" @close="showUserExistsModal = false"
        @create-local="goToCreateLocal" />
    </main>

    <!-- Modal de éxito de registro -->
    <div v-if="showSuccessModal" class="modal-backdrop">
      <div class="modal-success">
        <h3>¡Registro exitoso!</h3>
        <p>Te registraste correctamente.</p>
        <button class="btn btn-primary" @click="goToLogin">Iniciar sesión</button>
      </div>
    </div>
  </div>
</template>

<script>
import { apiService } from '@/services/api.service.js'
import { useFormValidation } from '../../composables/useFormValidation'
import { useValidation } from '../../composables/useValidation'
import AppHeader from './AppHeader.vue'
import LoginForm from './LoginForm.vue'
import RoleSelectionModal from './RoleSelectionModal.vue'
import RegisterUserForm from './RegisterUserForm.vue'
import EmailVerification from './EmailVerification.vue'
import RegisterLocalForm from './RegisterLocalForm.vue'
import PlanSelection from './PlanSelection.vue'
import ForgotPasswordForm from './ForgotPasswordForm.vue'
import UserExistsModal from './UserExistsModal.vue'

export default {
  name: 'AuthSystem',
  components: {
    AppHeader,
    LoginForm,
    RoleSelectionModal,
    RegisterUserForm,
    EmailVerification,
    RegisterLocalForm,
    PlanSelection,
    ForgotPasswordForm,
    UserExistsModal
  },
  data() {
    return {
      currentView: 'login',
      currentStep: 1, // Para el indicador de progreso
      isLoading: false,
      showLocalForm: false,
      showPlanSelection: false,
      usuarioId: null,
      showRoleSelection: false,
      selectedRole: null,
      selectedPlan: null,

      // Autocompletado de empresa
      nombreEmpresa: '',
      buscandoEmpresa: false,
      timeoutBusqueda: null,
      errorBusquedaEmpresa: '',

      // Login form
      loginForm: {
        email: '',
        password: ''
      },
      loginErrors: {},
      loginMessage: '',
      loginError: false,

      // Register form - Usuario
      registerForm: {
        nombre: '',
        rut: '',
        correo: '',
        telefono: '',
        contrasena: '',
        local: null
      },
      confirmPassword: '',
      registerErrors: {},
      registerMessage: '',
      registerError: false,

      // Register form - Local
      localForm: {
        rut: '',
        nombreFantasia: '',
        direccion: '',
        tipo: '',
        foto: ''
      },
      localErrors: {},
      fotoPreview: null,

      // Forgot password
      forgotEmail: '',

      // Tipos de local
      tipos: [
        'Restaurant',
        'Café',
        'Bar',
        'Comida Rápida',
        'Pizzería',
        'Sushi',
        'Otro'
      ],

      // Verificacion por email
      verificationCode: '',
      verificationError: '',
      verificationMessage: '',
      resendCooldown: 0,

      // NUEVO: Roles y locales del usuario
      usuarioRolesLocales: [],

      showUserExistsModal: false,

      // NUEVO: Mostrar modal de éxito
      showSuccessModal: false,
    }
  },

  setup() {
    const { isValidRut, formatRut } = useValidation();
    return { isValidRut, formatRut };
  },

  watch: {
    // Actualizar el paso actual según la vista y los formularios mostrados
    currentView(newView) {
      if (newView === 'login' || newView === 'forgot') {
        this.currentStep = 0; // No mostrar pasos en login/forgot
      } else if (newView === 'register' && !this.showLocalForm && !this.showPlanSelection) {
        this.currentStep = 1; // Paso 1: Registro de usuario
      } else if (newView === 'email-verification') {
        this.currentStep = 2; // Paso 2: Verificación de email
      } else if (newView === 'register' && this.showLocalForm && !this.showPlanSelection) {
        this.currentStep = 3; // Paso 3: Datos del local
      } else if (newView === 'register' && this.showPlanSelection) {
        this.currentStep = 4; // Paso 4: Selección de plan
      }
    },
    showLocalForm() {
      if (this.currentView === 'register') {
        this.currentStep = this.showLocalForm ? 3 : 1;
      }
    },
    showPlanSelection() {
      if (this.currentView === 'register' && this.showPlanSelection) {
        this.currentStep = 4;
      }
    }
  },

  mounted() {
    this.wakeAPI();
  },
  methods: {
    async wakeAPI() {
      try {
        await apiService.get('');
        console.log('API despertada');
      } catch (error) {
        console.error('Error al llamar al endpoint:', error);
      }
    },
    
    // Métodos para el modal de selección de rol
    showRoleModal() {
      if (!this.validateLoginForm()) return;
      this.showRoleSelection = true;
    },

    closeRoleModal() {
      this.showRoleSelection = false;
    },

    selectRole(role) {
      this.selectedRole = role;
      this.closeRoleModal();
      this.performLogin();
    },

    // Métodos de validación utilizando los composables
    validateLoginForm() {
      const formValidation = useFormValidation();
      const { errors, isValid } = formValidation.validateLoginForm(this.loginForm);
      this.loginErrors = errors;
      return isValid;
    },

    validateRegisterForm() {
      const formValidation = useFormValidation();
      const { errors, isValid } = formValidation.validateRegisterForm(this.registerForm, this.confirmPassword);
      this.registerErrors = errors;
      return isValid;
    },

    validateLocalForm() {
      const formValidation = useFormValidation();
      const { errors, isValid } = formValidation.validateLocalForm(this.localForm, this.nombreEmpresa);
      this.localErrors = errors;
      return isValid;
    },

    // Manejo de errores del formulario local
    handleLocalFormError(errors) {
      this.localErrors = { ...this.localErrors, ...errors };
    },

    // Navegación entre pasos
    goToPlanSelection() {
      if (!this.validateLocalForm()) return;
      // Solo validar y continuar, no crear el local aún
      this.showPlanSelection = true;
    },
    
    backToLocalForm() {
      this.showPlanSelection = false;
    },
    
    backToUserForm() {
      this.showLocalForm = false;
    },

    // Búsqueda de empresa por RUT
    async buscarEmpresaPorRut() {
      clearTimeout(this.timeoutBusqueda);
      this.nombreEmpresa = '';
      this.errorBusquedaEmpresa = '';

      const { isValidRut, formatRut } = useValidation();
      if (!isValidRut(this.localForm.rut)) {
        return;
      }

      this.timeoutBusqueda = setTimeout(async () => {
        try {
          this.buscandoEmpresa = true;

          // Formatear el RUT manteniendo el guión
          const rutFormateado = formatRut(this.localForm.rut);

          // Hacer la petición con el RUT formateado
          const response = await apiService.get(`empresas/matricula/${rutFormateado}`);

          if (response) {
            this.nombreEmpresa = response.nombre;
            this.errorBusquedaEmpresa = '';
          } else {
            this.errorBusquedaEmpresa = 'No se encontró empresa con este RUT';
          }
        } catch (error) {
          console.error('Error al buscar empresa:', error);
          this.errorBusquedaEmpresa = 'Error al buscar empresa. Intente nuevamente.';
        } finally {
          this.buscandoEmpresa = false;
        }
      }, 500);
    },

    // Métodos de autenticación
    async performLogin() {
      this.isLoading = true;
      this.loginMessage = '';
      this.loginError = false;
      const start = Date.now();

      try {
        const response = await apiService.post('auth/login', {
          correo: this.loginForm.email,
          contrasena: this.loginForm.password
        });

        localStorage.setItem('token', response.token);

        if (response.usuario) {
          localStorage.setItem('user', JSON.stringify(response.usuario));
          this.usuarioRolesLocales = response.usuario.usuarioRolesLocales || [];

          if (this.usuarioRolesLocales.length > 1) {
            this.showRoleSelection = true;
            // Espera mínimo 2 segundos antes de quitar el loading
            const elapsed = Date.now() - start;
            if (elapsed < 2000) await new Promise(res => setTimeout(res, 2000 - elapsed));
            this.isLoading = false;
            return;
          }

          const selected = {
            rol: this.usuarioRolesLocales[0].rol.nombre,
            local: this.usuarioRolesLocales[0].local
          };
          
          this.selectedRole = selected.rol;
          this.selectedLocal = selected.local;
          localStorage.setItem('local', JSON.stringify(selected.local));
        }

        // Continúa el flujo normal (redirigir, etc)
        try {
          // Verifica que selectedLocal y su id existan antes de llamar al endpoint
          if (!this.selectedLocal || !this.selectedLocal.id) {
            throw new Error('No se pudo determinar el local seleccionado.');
          }

          const { existenPlatos } = await apiService.get(`locales/existenPlatos/${this.selectedLocal.id}`);
          this.loginMessage = 'Inicio de sesión exitoso';
          
          // Redirigir después de 1 segundo
          setTimeout(() => {
            if (this.selectedRole === 'Garzon') {
              this.$router.push('/garzon');
            } else {
              this.$router.push('/platos');
            }
          }, 1000);
          
        } catch (error) {
          this.loginError = true;
          this.loginMessage = 'Error al iniciar sesión. Intente nuevamente.';
        }
      } catch (error) {
        this.loginError = true;
        this.loginMessage = error.response?.data?.mensaje || 'Error al iniciar sesión. Verifique sus credenciales.';
      } finally {
        // Espera mínimo 2 segundos antes de quitar el loading
        const elapsed = Date.now() - start;
        if (elapsed < 2000) await new Promise(res => setTimeout(res, 2000 - elapsed));
        this.isLoading = false;
      }
    },

    // Métodos de registro
    async register() {
      if (!this.validateRegisterForm()) return;

      this.isLoading = true;
      this.registerMessage = '';
      this.registerError = false;

      try {
        // La respuesta ahora es igual a la de verify-code
        const response = await apiService.post('auth/register', {
          nombre: this.registerForm.nombre,
          telefono: this.registerForm.telefono,
          rut: this.registerForm.rut,
          correo: this.registerForm.correo,
          contrasena: this.registerForm.contrasena,
          rol: 'Administrador'
        });

        // Simular verificación exitosa y avanzar al formulario de local
        this.usuarioId = response.usuario.id;
        this.showLocalForm = true;
        this.currentView = 'register';
        this.verificationMessage = 'Correo verificado exitosamente';
        // this.currentView = 'email-verification'; // <-- COMENTADO
        // this.startResendCooldown(); // <-- COMENTADO
      } catch (error) {
        const mensaje =
          error.response?.data?.mensaje ||
          error.response?.data?.message ||
          error.message ||
          '';

        if (
          mensaje.includes('RUT ya está registrado') ||
          mensaje.includes('correo ya está en uso')
        ) {
          if (error.response?.data?.usuarioId) {
            this.usuarioId = error.response.data.usuarioId;
          }
          this.showUserExistsModal = true;
        } else {
          this.registerError = true;
          this.registerMessage = mensaje || 'Error al registrar usuario';
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Métodos de verificación de correo
    resendVerificationCode() {
      if (this.resendCooldown > 0) return;

      this.isLoading = true;

      try {
        apiService.post('auth/resend-code', {
          correo: this.registerForm.correo
        }).then(() => {
          this.verificationMessage = 'Código reenviado exitosamente';
          this.startResendCooldown();
        }).catch(error => {
          console.log('Error al reenviar código:', error);
          this.verificationError = error.response?.data?.mensaje || 'Error al reenviar código.';
        }).finally(() => {
          this.isLoading = false;
        });
      } catch (error) {
        console.log('Error al reenviar código:', error);
        this.verificationError = error.response?.data?.mensaje || 'Error al reenviar código.';
      } finally {
        this.isLoading = false;
      }
    },

    startResendCooldown() {
      this.resendCooldown = 15;
      const cooldownInterval = setInterval(() => {
        this.resendCooldown--;
        if (this.resendCooldown <= 0) {
          clearInterval(cooldownInterval);
        }
      }, 1000);
    },

    async verifyEmailCode() {
      if (!this.verificationCode || this.verificationCode.length !== 4) {
        this.verificationError = 'Ingrese un código de 4 dígitos válido';
        return;
      }

      this.isLoading = true;
      this.verificationMessage = '';
      this.verificationError = '';

      try {
        const response = await apiService.post('auth/verify-code', {
          correo: this.registerForm.correo,
          codigo: this.verificationCode
        });
        
        this.usuarioId = response.usuario.id;
        this.showLocalForm = true;
        this.currentView = 'register';
        this.verificationMessage = 'Correo verificado exitosamente';
      } catch (error) {
        this.verificationError = error.response?.data?.mensaje || 'Código inválido o expirado';
      } finally {
        this.isLoading = false;
      }
    },

    // Completar registro con plan seleccionado y proceder al pago
    async completarRegistro(plan) {
      if (!this.selectedPlan) {
        alert('Por favor seleccione un plan');
        return;
      }
      // Verificación crítica del usuarioId
      if (!this.usuarioId) {
        this.registerError = true;
        this.registerMessage = "Error en los datos del usuario. Por favor, reinicie el proceso.";
        return;
      }

      this.isLoading = true;
      this.registerMessage = '';
      this.registerError = false;

      try {
        const rutFormateado = this.formatRut(this.localForm.rut);

        // Preparar datos del local para el endpoint de pruebas
        const localData = {
          usuarioId: this.usuarioId,
            correo: this.registerForm.correo // Agregamos el correo del usuario
,
          nombre: this.nombreEmpresa || 'Nombre no proporcionado',
          nombreFantasia: this.localForm.nombreFantasia || null,
          rut: rutFormateado,
          direccion: this.localForm.direccion,
          foto: this.localForm.foto || null,
          tipo: this.localForm.tipo,
          rol: 'Administrador', // Rol por defecto (ajusta si es necesario)
          categoriaId: this.selectedPlan.id // ID del plan seleccionado
        };

        // --- Lógica de pago comentada para pruebas ---
        /*
        const paymentData = {
          amount: this.selectedPlan.numericPrice || '9990',
          currency: 'CLP',
          title: `Suscripción ${this.selectedPlan.name}`,
          description: `Plan ${this.selectedPlan.name} - Registro completo de usuario y local`,
          metadata: {
            productId: this.selectedPlan.id,
            planName: this.selectedPlan.name,
            quantity: 1,
            registrationFlow: true
          },
          usuario: usuarioData,
          local: localData,
          returnUrl: `${window.location.origin}/payment-result`
        };
        const response = await apiService.post('pago/mercadopago', paymentData);
        if (response.url) {
          window.location.href = response.url;
        } else {
          throw new Error('No se recibió URL de pago');
        }
        */

        // Llamar al endpoint de pruebas para crear el local directamente
        const response = await apiService.post('auth/register-local', localData);

        // Si usas Axios, la respuesta real está en response.data
        const local = response.data ? response.data.local : response.local;

        if (local) {
          this.registerMessage = 'Local creado exitosamente para pruebas.';
          this.showSuccessModal = true; // Mostrar modal de éxito
        } else {
          throw new Error('No se pudo crear el local');
        }

      } catch (error) {
        this.registerError = true;
        this.registerMessage = error.response?.data?.mensaje || 'Error al crear el local. Intente nuevamente.';
        console.error('Error en completarRegistro:', error);
      } finally {
        this.isLoading = false;
      }
    },

    // Método auxiliar para extraer precio numérico
    extractNumericPrice(priceString) {
      // Extraer el primer número de la cadena de precio
      const match = priceString.match(/\$?(\d+(?:[.,]\d{3})*(?:[.,]\d{2})?)/);
      if (match) {
        // Remover puntos/comas de miles y convertir comas decimales a puntos
        return match[1].replace(/[.,](?=\d{3})/g, '').replace(',', '.');
      }
      return '9990'; // Precio por defecto
    },

    recoverPassword() {
      if (!this.forgotEmail) {
        alert('Por favor ingrese su correo electrónico');
        return;
      }
      
      this.isLoading = true;
      
      try {
        apiService.post('auth/reset-password', {
          correo: this.forgotEmail
        }).then(() => {
          alert('Se ha enviado un correo con instrucciones para recuperar su contraseña');
          this.currentView = 'login';
        }).catch(error => {
          alert(error.response?.data?.mensaje || 'Error al enviar correo de recuperación');
        }).finally(() => {
          this.isLoading = false;
        });
      } catch (error) {
        alert(error.response?.data?.mensaje || 'Error al enviar correo de recuperación');
      } finally {
        this.isLoading = false;
      }
    },
    goToCreateLocal() {
      this.showUserExistsModal = false;
      this.showLocalForm = true;
      this.currentView = 'register';
    },
    goToLogin() {
      this.showSuccessModal = false;
      this.currentView = 'login';
    }
  }
}
</script>

<style scoped>
/* Estilos para el modal de éxito */
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-success {
  background: #fff;
  border-radius: 16px;
  padding: 2rem 2.5rem;
  box-shadow: 0 4px 32px rgba(0,0,0,0.15);
  text-align: center;
  max-width: 90vw;
}

.modal-success h3 {
  margin-bottom: 1rem;
  color: #009EE3;
}

.modal-success button {
  margin-top: 1.5rem;
}
</style>
