<template>
  <div class="separator">
    <span v-if="text">{{ text }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: ''
  }
});
</script>

<style scoped lang="scss">
@import "@/styles/utils/_variables.scss";

.separator {
  display: flex;
  align-items: center;
  margin: var(--spacing-sm) 0;
  text-align: center;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--border-color);
  }

  span {
    padding: 0 var(--spacing-sm);
    color: var(--text-color);
  }
}
</style>