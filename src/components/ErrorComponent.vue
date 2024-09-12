<template>
  <div class="error-component">
    <h3>Erreur</h3>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: false,
    default: 'Erreur inconnue. Veuillez contacter l\'assistance.'
  }
});
</script>

<style scoped>
.error-component {
  color: red;
  padding: 20px;
  text-align: center;
}
</style>
