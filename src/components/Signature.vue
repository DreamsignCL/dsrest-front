<template>
  <div class="ds-signature">
    <span>Desarrollado por:</span>
    <a
      href="https://www.dreamsign.cl/?utm_source=firma&utm_medium=webs&utm_campaign=branding"
      target="_blank"
      title="Visita nuestro sitio! ðŸ˜‰"
      aria-label="Dreamsign - Desarrollo Digital"
    >
      <img
        src="https://dreamsign.cl/assets/logo-dreamsign-BtW70eZV.svg"
        alt="Dreamsign - Desarrollo Digital"
        class="ds-logo"
      />
    </a>
    <h2>Desarrollo Web y Branding Digital - Dreamsign</h2>
  </div>
</template>

<script>
export default {
  name: 'Signature',
}
</script>

<style lang="scss" scoped>
.ds-signature {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #000;
  padding: 0.5rem 1rem 0.5rem 1rem;

  .ds-logo {
    width: 105px;
  }

  h2 {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(100%);
    border: 0;
  }
}
</style>
