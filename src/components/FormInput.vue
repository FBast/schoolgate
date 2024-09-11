<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <input :type="type" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    modelValue: String,
    type: {
      type: String,
      default: 'text',
    },
  },
};
</script>

<style scoped>
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
</style>
