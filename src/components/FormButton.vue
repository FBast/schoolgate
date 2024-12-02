<template>
  <button :type="type" @click="onClick" :disabled="disabled">
    <label>{{ label }}</label>
  </button>
</template>

<script setup>
const props = defineProps({
  label: String,
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const onClick = (event) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/utils/_variables.scss";
@import "@/styles/utils/_mixins.scss";

button {
  flex: 0;
  background-color: var(--secondary-color);
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  transition: background-color 0.3s ease;
  color: white;
  font-weight: bold;
  width: 100%;

  &:hover {
    background-color: var(--accent-color);
  }

  &.active {
    background-color: var(--accent-color);
  }

  &:disabled {
    background-color: var(--disabled-color);
    cursor: not-allowed;
  }
}
</style>