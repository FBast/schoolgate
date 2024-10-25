<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
      <option disabled value="">Veuillez choisir</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    modelValue: [String, Number], // La valeur peut être une chaîne ou un numéro
    options: {
      type: Array,
      required: true,
      // Vérification que chaque option contient bien les champs label et value
      validator: (options) =>
          options.every(option => option.hasOwnProperty('label') && option.hasOwnProperty('value'))
    },
    error: String
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

select {
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