<template>
  <div class="not-found">
    <h1>404 - Page non trouvée</h1>
    <p>Désolé, la page que vous recherchez n'existe pas.</p>
    <router-link to="/">Retour à l'accueil</router-link>
  </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
@import '../styles/utils/_variables.scss';

.not-found {
  text-align: center;
  margin-top: $spacing-xl;

  h1 {
    color: $primary-color;
    margin-bottom: $spacing-md;
  }

  p {
    margin-bottom: $spacing-md;
    color: $text-color-alt;
  }

  a {
    color: $accent-color;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>