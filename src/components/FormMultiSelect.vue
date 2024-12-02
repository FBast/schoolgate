<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <ul class="multi-select">
      <li
          v-for="option in options"
          :key="option.value"
          :class="{ selected: modelValue.includes(option.value) }"
          @click="toggleSelection(option.value)"
      >
        {{ option.label }}
      </li>
    </ul>
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    modelValue: {
      type: Array,
      required: true, // The selected values are stored as an array
    },
    options: {
      type: Array,
      required: true,
      validator: (options) =>
          options.every(
              (option) => option.hasOwnProperty("label") && option.hasOwnProperty("value")
          ),
    },
    error: String,
  },
  methods: {
    toggleSelection(value) {
      const index = this.modelValue.indexOf(value);
      if (index === -1) {
        // Add value if it's not already selected
        this.$emit("update:modelValue", [...this.modelValue, value]);
      } else {
        // Remove value if it's already selected
        const updated = [...this.modelValue];
        updated.splice(index, 1);
        this.$emit("update:modelValue", updated);
      }
    },
  },
};
</script>

<style scoped>
.form-group {
  flex: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.multi-select {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border: 1px solid var(--text-color-alt, #ccc);
  border-radius: var(--border-radius, 4px);
  background-color: var(--primary-color, #f9f9f9);
}

.multi-select li {
  padding: var(--spacing-sm, 0.5rem);
  border-radius: var(--border-radius, 4px);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  box-sizing: border-box;
}

.multi-select li:hover {
  background-color: var(--secondary-color, #e6e6e6);
}

.multi-select li.selected {
  background-color: var(--accent-color, #007bff);
  color: var(--text-color-alt, #fff);
}
</style>
