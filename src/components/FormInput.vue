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

<style scoped lang="scss">
@import "@/styles/utils/_variables.scss";

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
  color: white;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.error-message {
  padding-top: 5px;
  color: $error-color;
}
</style>
