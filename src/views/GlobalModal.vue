<template>
  <div class="modal-backdrop">
    <div class="layout-restricted">
      <div class="panel">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <FormButton
            label="OK"
            @click="closeModal"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FormButton from "@/components/FormButton.vue";

export default {
  components: {FormButton},
  props: {
    title: {
      type: String,
      default: "Notification",
    },
    message: {
      type: String,
      default: "",
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close"],
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
