<template>
    <div class="panel__content">
        <AuthHeader
            title="Iniciar sesión"
            description="Completa el formulario para iniciar sesión"
        />
    
        <div class="panel__body" aria-label="Formulario de acceso">
            <LoginForm
                :form="loginForm"
                :is-loading="isLoading"
                :login-errors="loginErrors"
                :login-message="loginMessage"
                :login-error="loginError"
                @update:form="Object.assign(loginForm, $event)"
                @login="performLogin"
            />
        </div>
    
        <footer class="panel__footer">
            <div class="panel__actions">
                <RouterLink class="btn btn--link" to="/register">
                    Crear cuenta
                </RouterLink>
        
                <RouterLink class="btn btn--link" to="/forgot-password">
                    ¿Olvidaste tu contraseña?
                </RouterLink>
            </div>
            <DsSignature />
        </footer>
    
        <BaseLoader v-if="isLoading" text="Iniciando sesión..." />
    </div>
</template>

<script setup>

import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import BaseLoader from '@/components/ui/BaseLoader.vue'
import { apiService } from '@/services/api.service.js'
import { useFormValidation } from '@/composables/useFormValidation'
import DsSignature from '@/components/DsSignature.vue'

const router = useRouter()

const isLoading = ref(false)

const loginMessage = ref('')

const loginError = ref(false)

const loginErrors = reactive({})

const loginForm = reactive({
    email: '',
    password: '',
})

const validateLoginForm = () => {

    const formValidation = useFormValidation()

    const {
    errors,
    isValid,
    } = formValidation.validateLoginForm(loginForm)

    Object.assign(loginErrors, errors)

    return isValid
}

const performLogin = async () => {

    if (!validateLoginForm()) return

    isLoading.value = true

    loginMessage.value = ''

    loginError.value = false

  try {

    const response = await apiService.post(
      'auth/login',
      {
        correo: loginForm.email,
        contrasena: loginForm.password,
      }
    )

    localStorage.setItem(
      'token',
      response.token
    )

    if (response.usuario) {

      localStorage.setItem(
        'user',
        JSON.stringify(response.usuario)
      )

      const usuarioRolesLocales =
        response.usuario.usuarioRolesLocales || []

      if (usuarioRolesLocales.length > 0) {

        const selected = {
          rol: usuarioRolesLocales[0].rol.nombre,
          local: usuarioRolesLocales[0].local,
        }

        localStorage.setItem(
          'local',
          JSON.stringify(selected.local)
        )

        loginMessage.value =
          'Inicio de sesión exitoso'

        setTimeout(() => {

          if (selected.rol === 'Garzon') {

            router.push('/garzon')

          } else {

            router.push('/platos')

          }

        }, 800)
      }
    }

  } catch (error) {

    loginError.value = true

    loginMessage.value =
      error.response?.data?.mensaje ||
      'Error al iniciar sesión'

  } finally {

    isLoading.value = false

  }
}

</script>