<template>
    <div class="panel__content">
        <AppHeader :title="user?.nombre || ''" beforeText="Bienvenido(a)" />

        <div class="panel__body" aria-label=""></div>

        <footer class="panel__footer">
            <DsSignature />
        </footer>
    </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import DsSignature from '@/components/DsSignature.vue'
import { inject } from 'vue'

const user = inject('currentUser')

</script>