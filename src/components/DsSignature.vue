<template>
    <div class="ds-signature">
        <span>Desarrollado por:</span>

        <a
            href="https://www.dreamsign.cl/?utm_source=firma&utm_medium=webs&utm_campaign=branding"
            target="_blank"
            aria-label="Dreamsign">
            <img
            src="https://dreamsign.cl/assets/logo-dreamsign-BtW70eZV.svg"
            alt="Dreamsign"
            class="ds-logo"
            />
        </a>

        <span>2026 - Todos los derechos reservados</span>
    </div>
</template>

<style>
.ds-signature {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    font-size: .75rem;
    padding: .5rem 1rem .5rem 1rem;
}

.ds-signature a {
    -webkit-transition: .2s ease-in-out all;
    -o-transition: .2s ease-in-out all;
    transition: .2s ease-in-out all;
}

.ds-signature a .ds-logo {
    width: 105px;
    transition: filter 0.3s ease-in-out;
}

.ds-signature h2 {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(100%);
    border: 0;
}
</style>