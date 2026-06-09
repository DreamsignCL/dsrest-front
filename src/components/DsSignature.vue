<template>
    <div class="ds-signature">
        <span>Desarrollado por:</span>

        <a
            href="https://www.dreamsign.cl/?utm_source=firma&utm_medium=webs&utm_campaign=branding"
            target="_blank"
            aria-label="Dreamsign">
            <img
            :src="DreamsignLogo"
            alt="Dreamsign"
            class="ds-logo"
            />
        </a>

        <span>2026 - Todos los derechos reservados</span>
    </div>
</template>

<script setup>
import DreamsignLogo from '@/assets/img/dreamsign.svg'
</script>