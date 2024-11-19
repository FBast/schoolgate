<template>
  <button :type="type" @click="onClick" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
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
  background-color: $secondary-color;
  border: none;
  cursor: pointer;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius;
  transition: background-color 0.3s ease;
  color: white;
  font-weight: bold;
  width: 100%;

  &:hover {
    background-color: $accent-color;
  }

  &.active {
    background-color: $accent-color;
  }
  
  &:disabled {
    background-color: $disabled-color;
    cursor: not-allowed;
  }
}
</style>