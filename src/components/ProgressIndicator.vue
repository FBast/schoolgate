<template>
  <div class="progress-indicator">
    <label>{{$t('steps')}}</label>
    <div
        v-for="(stepKey, index) in steps"
        :key="index"
        :class="{ 'active-step': index === currentStep, 'step': true }"
    >
      <span class="step-number">{{ index + 1 }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  steps: {
    type: Array,
    required: true,
  },
  currentStep: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.progress-indicator {
  flex: 1;
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 10px 20px;
  height: 50px;
  gap: $spacing-md;
  color: $text-color-alt;

  label {
    font-weight: bold;
    font-size: $font-size-xl;
    color: $text-color;
  }

  .step {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex: 0;
    text-align: center;

    .step-number {
      min-width: 30px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      background-color: $secondary-color;
      z-index: 1;
    }
    
    &.active-step {
      flex: 1;
    }

    &.active-step .step-number {
      flex: 0;
      background-color: $accent-color;
      color: white;
    }
  }
}
</style>
