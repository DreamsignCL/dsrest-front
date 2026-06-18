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

import { reactive, ref, watch } from 'vue'
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

    /*
    |----------------------------------------------------------------------
    | Reset State
    |----------------------------------------------------------------------
    */

    loginMessage.value = ''

    loginError.value = false

    Object.keys(loginErrors).forEach(key => {
        delete loginErrors[key]
    })

    /*
    |----------------------------------------------------------------------
    | Validate Form
    |----------------------------------------------------------------------
    */

    if (!validateLoginForm()) return

    isLoading.value = true

    try {

        const response = await apiService.post(
            'auth/login',
            {
                correo: loginForm.email,
                contrasena: loginForm.password,
            }
        )

        /*
        |----------------------------------------------------------------------
        | Save Token
        |----------------------------------------------------------------------
        */

        localStorage.setItem(
            'token',
            response.token
        )

        /*
        |----------------------------------------------------------------------
        | Save User
        |----------------------------------------------------------------------
        */

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

                const empresa = await apiService.get(
                    `empresas/por-local/${selected.local.id}`
                )

                console.log(
                    'EMPRESA',
                    empresa
                )

                const localConfig = {
                    ...selected.local,

                    usaMesas:
                        empresa.usaMesas,

                    usaNombreCliente:
                        empresa.usaNombreCliente,

                    tipoNegocio:
                        empresa.tipoNegocio,
                }

                localStorage.setItem(
                    'local',
                    JSON.stringify(localConfig)
                )

                /*
                |----------------------------------------------------------------------
                | Success Message
                |----------------------------------------------------------------------
                */

                loginError.value = false

                loginMessage.value =
                    'Inicio de sesión exitoso.'

                /*
                |----------------------------------------------------------------------
                | Redirect
                |----------------------------------------------------------------------
                */

                setTimeout(() => {

                    if (selected.rol === 'Garzon') {

                        router.push('/garzon')

                    } else {

                        router.push('/app/dashboard')

                    }

                }, 800)
            }
        }

    } catch (error) {

        console.error(error)

        loginError.value = true

        /*
        |----------------------------------------------------------------------
        | Friendly Messages
        |----------------------------------------------------------------------
        */

        const status = error?.response?.status

        if (status === 401) {

            loginMessage.value =
                'Correo o contraseña incorrectos.'

        } else if (status === 403) {

            loginMessage.value =
                'Tu cuenta no tiene permisos para acceder.'

        } else if (status === 422) {

            loginMessage.value =
                'Verifica los datos ingresados.'

        } else {

            loginMessage.value =
                'No fue posible iniciar sesión. Inténtalo nuevamente.'

        }

    } finally {

        isLoading.value = false

    }
}

watch(
    () => [loginForm.email, loginForm.password],
    () => {

        loginMessage.value = ''

        loginError.value = false

        Object.keys(loginErrors).forEach(key => {
            delete loginErrors[key]
        })

    }
)

</script>