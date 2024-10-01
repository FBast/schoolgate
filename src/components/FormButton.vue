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
  width: 100%;
  background-color: $accent-color;
  border: none;
  cursor: pointer;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius;
  transition: background-color 0.3s ease;
  color: white;
  font-weight: bold;

  &:hover {
    background-color: lighten($accent-color, 20%);
  }
  &:disabled {
    background-color: darken($accent-color, 50%);
    cursor: not-allowed;
  }
}
</style>