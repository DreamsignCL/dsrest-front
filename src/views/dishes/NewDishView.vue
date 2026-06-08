<template>
    <div class="panel__content">
        <AppHeader
            title="Nuevo plato"
            description="Crea un nuevo plato para tu carta"
        />

        <div class="panel__body" aria-label="Listado de platos">
            
        </div>

        <footer class="panel__footer">
            <div class="panel__actions">
                <RouterLink
                    class="btn btn--outline-primary"
                    to="/app/dishes/new">
                    Volver
                </RouterLink>

                <BaseButton 
                    type="submit" 
                    variant="secondary"
                    from="form-new-dish">
                    Crear plato
                </BaseButton>
            </div>
            <DsSignature />
        </footer>

        <ConfirmModal
            v-model="showDeleteModal"
            title="Eliminar plato"
            :message="`
                La siguiente acción no se puede deshacer.
                ¿Deseas eliminar ${dishToDelete?.nombre || 'este plato'}?
            `"
            confirm-text="Eliminar"
            cancel-text="Cancelar"
            confirm-variant="danger"
            @confirm="deleteDish"
        />
    </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import DsSignature from '@/components/DsSignature.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
</script>