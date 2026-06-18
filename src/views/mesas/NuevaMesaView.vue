<template>
    <div class="page page--backoffice">
        <InnerHeader @open-qr="abrirQrModal" />
        <main>
            <div class="page-content page-content--backoffice-form">
                <div class="page-content__header">
                    <div class="user-logo">
                        <div class="user-logo__image">
                            <img v-if="local?.foto" :src="local.foto" alt="Logo del Local" />
                            <img v-else src="../../assets/img/no-logo.png" alt="Sin logo" />
                        </div>
                    </div>

                    <div class="title">
                        <h2>Crear mesa</h2>
                    </div>
                </div>

                <div class="page-content__body">
                    <form class="form" @submit.prevent="guardarMesa">
                        <div class="form-container form-container--no-header">
                            <div class="form-container__body">
                                <!-- Nombre -->
                                <div class="mb-3">
                                    <label class="form-label" for="nombre">Nombre de la mesa</label>
                                    <input id="nombre" class="form-control" type="text" v-model="mesa.nombre" placeholder="Ej: Mesa VIP" required />
                                </div>
        
                                <!-- Número de mesa -->
                                <div class="mb-3">
                                    <label class="form-label" for="numero">Número de mesa</label>
                                    <input id="numero" class="form-control" type="number" v-model="mesa.numero" placeholder="Ej: 101" required />
                                </div>
        
                                <!-- Capacidad -->
                                <div class="mb-3">
                                    <label class="form-label" for="capacidad">Capacidad</label>
                                    <input id="capacidad" class="form-control" type="number" v-model="mesa.capacidad" placeholder="Número de personas" required />
                                </div>
        
                                <!-- Zona -->
                                <div class="mb-3">
                                    <label class="form-label" for="zona">Zona</label>
                                    <select id="zona" class="form-select" v-model="mesa.zona_id" required>
                                        <option value="" disabled selected>Seleccione una zona</option>
                                        <option v-for="zona in zonas" :key="zona.id" :value="zona.id">
                                            {{ zona.nombre }}
                                        </option>
                                    </select>
                                </div>
        
                                <!-- Activo -->
                                <div class="switch-group mb-3">
                                    <label class="form-label">¿Mesa activa?</label>
                                    <label class="switch">
                                        <input type="checkbox" v-model="mesa.activo">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
        
                                <!-- Error -->
                                <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

                                <div class="form-container__footer">
                                    <button type="button" class="btn btn-outline-primary rounded-pill" @click="volver">
                                        Volver
                                    </button>
                                    <button type="submit" class="btn btn-primary rounded-pill" :disabled="isLoading">
                                        {{ isLoading ? 'Guardando...' : 'Guardar mesa' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Modal QR -->
                <QrModal :isOpen="showQrModal" :localNombre="localNombre" @close="cerrarQrModal" />
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import InnerHeader from '@/components/InnerHeader.vue'
import QrModal from '@/components/QrModal.vue'
import { apiService } from '@/services/api.service'

const router = useRouter()
const showQrModal = ref(false)
const local = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const zonas = ref([])


const mesa = ref({
    nombre: '',
    capacidad: '',
    numero: '',
    estado: 'disponible',
    activo: true,
    zona_id: 1,
    local_id: null
})

const abrirQrModal = () => {
    showQrModal.value = true
}

const cerrarQrModal = () => {
    showQrModal.value = false
}


const obtenerZonas = async () => {
    try {
        const response = await apiService.get('zonas')
        zonas.value = response
    } catch (error) {
        console.error('Error al obtener las zonas:', error)
    }
}


const obtenerLocal = () => {
    const localStr = localStorage.getItem('local')
    if (localStr) {
        local.value = JSON.parse(localStr)
        mesa.value.local_id = local.value.id
    }
}

const localNombre = computed(() => {
    const localStr = localStorage.getItem('local')
    if (!localStr) return 'Mi Restaurante'
    try {
        const localObj = JSON.parse(localStr)
        return localObj.nombreFantasia || localObj.nombre || 'Mi Restaurante'
    } catch {
        return 'Mi Restaurante'
    }
})

const guardarMesa = async () => {
    if (!mesa.value.nombre || !mesa.value.capacidad || !mesa.value.estado) {
        errorMessage.value = 'Por favor complete todos los campos obligatorios'
        return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
        const mesaData = { ...mesa.value }
        await apiService.post('mesas', mesaData)
        router.push('/mesas')
    } catch (error) {
        errorMessage.value = error.message || 'Ocurrió un error al guardar la mesa'
        console.error(error)
    } finally {
        isLoading.value = false
    }
}

const volver = () => {
    router.push('/mesas')
}

onMounted(() => {
    obtenerLocal()
    obtenerZonas()
})
</script>