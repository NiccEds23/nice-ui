<template>
  <div class="base-switch-wrapper" :class="{ 'disabled': disabled }" @click="toggle">
    <div class="switch-container" :class="{ 'checked': modelValue }">
      <div class="switch-track" :class="{ 'checked': modelValue }"></div>
      <div class="switch-thumb" :class="{ 'checked': modelValue }"></div>
    </div>
    <label v-if="label" class="switch-label">{{ label }}</label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue']);

const toggle = () => {
  if (props.disabled) return;
  emit('update:modelValue', !props.modelValue);
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/component_mixins' as *;

.base-switch-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.switch-container {
  @include switch-container;
  position: relative;
  width: 2.75rem;
  height: 1.5rem;
}

.switch-track {
  @include switch-track;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.switch-thumb {
  @include switch-thumb;
  z-index: 10;
}

.switch-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: $neutral-700; // #334155
  cursor: pointer;
}
</style>
