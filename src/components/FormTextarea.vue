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

<style scoped lang="scss">
@import "@/styles/utils/_variables.scss";

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  flex: 1;
}

label {
  margin-bottom: 5px;
  color: white;
}

textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  min-height: 150px;
  resize: vertical;
}

.error-message {
  padding-top: 5px;
  color: $error-color;
}
</style>
