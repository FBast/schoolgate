<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
      <option disabled value="">Veuillez choisir</option>
      <option v-for="option in options" :key="option">{{ option }}</option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    modelValue: String,
    options: Array,
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

select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}
</style>
