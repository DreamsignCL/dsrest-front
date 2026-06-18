<template>
    <AppContentHeader 
        beforeText="Bienvenido(a)" 
        :title="user?.nombre || ''" 
    />

    <div class="app-content__body" aria-label="KPI's del local">
    </div>

    <AppContentFooter />
</template>

<script setup>
import AppContentHeader from '@/components/layout/AppContentHeader.vue'
import AppContentFooter from '@/components/layout/AppContentFooter.vue';
import { inject } from 'vue'

const user = inject('currentUser')

</script>