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