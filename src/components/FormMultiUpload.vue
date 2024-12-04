<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <input
        type="file"
        :accept="accept"
        :multiple="true"
        @change="handleFileChange"
    />
    <ul v-if="files.length > 0" class="file-list">
      <li v-for="(file, index) in files" :key="index">
        <label>
          {{ file.name }} ({{ (file.size / 1024).toFixed(2) }} KB)
        </label>
        <a @click.stop="removeFile(index)">
          <i class="fa-solid fa-trash"></i>
        </a>
      </li>
    </ul>
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    accept: {
      type: String,
      default: '',
    },
    error: String,
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      files: [...this.modelValue], // Synchronize with `modelValue`
    };
  },
  methods: {
    handleFileChange(event) {
      const selectedFiles = Array.from(event.target.files); // Convert FileList to Array
      this.files.push(...selectedFiles); // Add files to the list
      this.emitUpdate();
    },
    removeFile(index) {
      this.files.splice(index, 1); // Remove file from the list
      this.emitUpdate();
    },
    emitUpdate() {
      this.$emit('update:modelValue', this.files); // Emit updated file list
    },
  },
};
</script>

<style scoped>
.file-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  flex: 1;
  padding: var(--spacing-sm);
  border: 1px solid var(--text-color-alt);
  border-radius: var(--border-radius);
  width: 100%;
  box-sizing: border-box;
  background-color: var(--primary-color);
  gap: var(--spacing-sm);

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-md);

    label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
