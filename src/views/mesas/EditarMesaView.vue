<template>
    <div class="page page--backoffice">
        <InnerHeader />
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
                        <h2>Editar mesa</h2>
                    </div>
                </div>

                <div class="page-content__body">
                    <form class="form" @submit.prevent="guardarCambios">
                        <div class="form-container form-container--no-header">
                            <div class="form-container__body">
                                <!-- Nombre -->
                                <div class="mb-3">
                                    <label class="form-label" for="nombre">Nombre de la mesa</label>
                                    <input id="nombre" class="form-control" type="text" v-model="mesa.nombre" required />
                                </div>
        
                                <!-- Número de mesa -->
                                <div class="mb-3">
                                    <label class="form-label" for="numero">Número de mesa</label>
                                    <input id="numero" class="form-control" type="number" v-model="mesa.numero" placeholder="Ej: 5" required />
                                </div>
        
                                <!-- Capacidad -->
                                <div class="mb-3">
                                    <label class="form-label" for="capacidad">Capacidad</label>
                                    <input id="capacidad" class="form-control" type="number" v-model.number="mesa.capacidad" required />
                                </div>
        
                                <!-- Zona -->
                                <div class="mb-3">
                                    <label class="form-label" for="zona">Zona</label>
                                    <select id="zona" class="form-select" v-model="mesa.zona_id" required>
                                        <option value="" disabled>Seleccione una zona</option>
                                        <option v-for="zona in zonas" :key="zona.id" :value="zona.id">
                                            {{ zona.nombre }}
                                        </option>
                                    </select>
                                </div>
        
                                <!-- Estado -->
                                <div class="mb-3">
                                    <label class="form-label" for="estado">Estado</label>
                                    <select id="estado" class="form-select" v-model="mesa.estado" required>
                                        <option value="disponible">Disponible</option>
                                        <option value="ocupada">Ocupada</option>
                                        <option value="reservada">Reservada</option>
                                        <option value="fuera_servicio">Fuera de servicio</option>
                                    </select>
                                </div>
        
                                <!-- Activo -->
                                <div class="switch-group mb-3">
                                    <label class="form-label">¿Mesa activa?</label>
                                    <label class="switch">
                                        <input type="checkbox" v-model="mesa.activo" />
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                            </div>
                            <div class="form-container__footer">
                                <button class="btn btn-outline-primary rounded-pill" type="button" @click="volver">
                                    Volver
                                </button>
                                <button class="btn btn-primary rounded-pill" type="submit" :disabled="isLoading">
                                    {{ isLoading ? 'Guardando...' : 'Guardar cambios' }}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiService } from '@/services/api.service'
import InnerHeader from '@/components/InnerHeader.vue'

const route = useRoute()
const router = useRouter()

const mesa = ref({
    nombre: '',
    capacidad: 0,
    numero: '',
    estado: 'disponible',
    zona_id: null,
    activo: true,
    local_id: null
})

const local = ref(null)
const zonas = ref([])
const isLoading = ref(false)

const obtenerLocal = () => {
    const localStr = localStorage.getItem('local')
    if (localStr) {
        local.value = JSON.parse(localStr)
        mesa.value.local_id = local.value.id
    }
}

const obtenerZonas = async () => {
    try {
        const response = await apiService.get('zonas')
        zonas.value = response
    } catch (error) {
        console.error('Error al obtener zonas:', error)
    }
}

const obtenerMesa = async () => {
    isLoading.value = true
    try {
        const res = await apiService.get(`mesas/${route.params.id}`)
        mesa.value = {
            ...res,
            activo: res.activo ?? true
        }
    } catch (error) {
        console.error('Error al obtener la mesa:', error)
        alert('No se pudo cargar la mesa.')
    } finally {
        isLoading.value = false
    }
}

const guardarCambios = async () => {
    isLoading.value = true
    try {
        await apiService.put(`mesas/${route.params.id}`, mesa.value)
        alert('Mesa actualizada con éxito.')
        router.push('/mesas')
    } catch (error) {
        console.error('Error al guardar cambios:', error)
        alert('Hubo un error al guardar los cambios.')
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
    obtenerMesa()
})
</script>

<style scoped>
.form {
    max-width: 600px;
    margin: 0 auto;
}

.switch-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.switch {
    position: relative;
    display: inline-block;
    width: 46px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 24px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
}

input:checked+.slider {
    background-color: #4caf50;
}

input:checked+.slider:before {
    transform: translateX(22px);
}
</style>