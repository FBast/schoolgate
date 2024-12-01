<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <div class="dropdown">
      <div class="dropdown-header" @click="toggleDropdown">
        <span v-if="selectedOptions.length">{{ displaySelected }}</span>
        <span v-else>{{ placeholder }}</span>
        <i :class="{'fa-chevron-down': !dropdownOpen, 'fa-chevron-up': dropdownOpen}" class="fas"></i>
      </div>
      <div v-if="dropdownOpen" class="dropdown-menu">
        <div
            v-for="option in options"
            :key="option.value"
            class="dropdown-item"
        >
          <input
              type="checkbox"
              :checked="isSelected(option.value)"
              @change="toggleOption(option.value)"
          />
          <label>{{ option.label }}</label>
        </div>
      </div>
    </div>
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    modelValue: {
      type: Array,
      required: true,
      default: () => [],
    },
    options: {
      type: Array,
      required: true,
      validator: (options) =>
          options.every(
              (option) =>
                  option.hasOwnProperty("label") && option.hasOwnProperty("value")
          ),
    },
    placeholder: {
      type: String,
      default: "Select options",
    },
    error: String,
  },
  data() {
    return {
      dropdownOpen: false,
    };
  },
  computed: {
    selectedOptions() {
      return this.modelValue;
    },
    displaySelected() {
      return this.selectedOptions
          .map((value) => this.options.find((option) => option.value === value)?.label)
          .filter((label) => label)
          .join(", ");
    },
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    isSelected(value) {
      return this.selectedOptions.includes(value);
    },
    toggleOption(value) {
      const newValue = [...this.selectedOptions];
      const index = newValue.indexOf(value);
      if (index === -1) {
        newValue.push(value);
      } else {
        newValue.splice(index, 1);
      }
      this.$emit("update:modelValue", newValue);
    },
  },
};
</script>

<style scoped>
.form-group {
  position: relative;
}
.dropdown {
  position: relative;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
}
.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}
.dropdown-item {
  padding: 0.5rem;
  display: flex;
  align-items: center;
}
.dropdown-item:hover {
  background-color: #f0f0f0;
}
</style>
