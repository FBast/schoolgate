<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <input :type="type" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    modelValue: String,
    error: String, 
    type: {
      type: String,
      default: 'text',
    },
  },
};
</script>