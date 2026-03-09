<template>
  <!-- Single radio -->
  <label class="base-radio" :class="{ disabled, checked: isChecked }">
    <input
      type="radio"
      class="radio-input"
      :value="value"
      :name="name"
      :disabled="disabled"
      :checked="isChecked"
      @change="onChange"
    />
    <span class="radio-circle">
      <span class="radio-dot" />
    </span>
    <span v-if="label || $slots.default" class="radio-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | boolean;
    value: string | number | boolean;
    label?: string;
    name?: string;
    disabled?: boolean;
  }>(),
  {
    disabled: false,
    name: "radio-group",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string | number | boolean];
}>();

const isChecked = computed(() => props.modelValue === props.value);
const onChange = () => emit("update:modelValue", props.value);
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.base-radio {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
  user-select: none;

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(.disabled) .radio-circle {
    border-color: $primary-color;
  }

  &.checked .radio-circle {
    border-color: $primary-color;
    background: rgba($primary-rgb, 0.08);

    .radio-dot {
      opacity: 1;
      transform: scale(1);
    }
  }
}

.radio-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
}

.radio-circle {
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 50%;
  border: 2px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
  background: var(--surface-glass);
}

.radio-dot {
  width: 0.4375rem;
  height: 0.4375rem;
  border-radius: 50%;
  background: $primary-color;
  opacity: 0;
  transform: scale(0.4);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.radio-label {
  font-size: 0.875rem;
  color: $text-primary;
  font-weight: 500;
  line-height: 1.4;
}
</style>
