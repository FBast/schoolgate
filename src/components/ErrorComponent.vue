<template>
  <div class="panel error-component">
    <p class="error-message">{{ message }}</p>
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
