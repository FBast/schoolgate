<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
    ></textarea>
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    modelValue: String,
    placeholder: {
      type: String,
      default: '',
    },
    error: String,
  },
};
</script>
