<template>
    <div class="page page--backoffice">
        <InnerHeader @open-qr="abrirQrModal" />
        <main>
            <div class="page-content page-content--backoffice">
                <div class="page-content__header">
                    <div class="user-logo">
                        <div class="user-logo__image">
                        <img v-if="local?.foto" :src="local.foto" alt="Logo del Local" />
                        <img v-else src="../../assets/img/no-logo.png" alt="Sin logo" />
                        </div>
                    </div>

                    <div class="title">
                        <h2>Mesas</h2>
                    </div>
                </div>

                <div class="page-content__body">
                    <div class="element-list">
                        <div v-if="isLoading" class="loader"></div>

                        <div v-else-if="mesas.length === 0" class="empty-state">
                            <p>No hay mesas registradas.</p>
                        </div>

                        <button v-else v-for="mesa in mesas" :key="mesa.id" class="element-item element-item--table" @click="irAEditarMesa(mesa.id)">
                            <!--
                                <pre>{{ JSON.stringify(mesa, null, 2) }}</pre>
                            -->
                            
                            <div class="element-item__text">
                                <span>#{{ mesa.numero }} {{ mesa.nombre }}</span><br>
                                <strong>Capacidad:</strong> {{ mesa.capacidad }} <strong>zona:</strong> {{ mesa.zona.id }}
                            </div>

                            <div class="element-item__text">
                                {{ mesa.estado.replace('_', ' ') }}
                            </div>
                        </button>
                    </div>
                </div>

                <div class="page-content__footer">
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary rounded-pill" type="button" @click="irANuevoMesa">
                            Nueva mesa
                        </button>
                    </div>
                    <Signature />
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
import { apiService } from '@/services/api.service'
import InnerHeader from '@/components/InnerHeader.vue'
import QrModal from '@/components/QrModal.vue'
import Signature from '@/components/Signature.vue'

const router = useRouter()
const showQrModal = ref(false)
const local = ref(null)
const mesas = ref([])
const isLoading = ref(true)

const obtenerLocal = () => {
    const localStr = localStorage.getItem('local')
    if (localStr) {
        local.value = JSON.parse(localStr)
    }
}

const obtenerMesas = async () => {
    try {
        const localStr = localStorage.getItem('local')
        const localObj = localStr ? JSON.parse(localStr) : null

        if (!localObj?.id) {
            console.warn('ID del local no disponible')
            return
        }

        const res = await apiService.get(`mesas/local/${localObj.id}`)
        mesas.value = res
    } catch (error) {
        console.error('Error al obtener mesas:', error)
    } finally {
        isLoading.value = false
    }
}

const abrirQrModal = () => {
    showQrModal.value = true
}

const irAEditarMesa = (id) => {
    router.push(`/mesas/${id}/editar`)
}

const cerrarQrModal = () => {
    showQrModal.value = false
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

const irANuevoMesa = () => {
    router.push('/mesas/nuevo')
}

onMounted(() => {
    obtenerLocal()
    obtenerMesas()
})
</script>
