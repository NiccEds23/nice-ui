<template>
  <button
    class="base-btn"
    :class="[
      variantClass,
      sizeClass,
      { 'w-full': block, 'btn-outlined': outlined },
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="spinner"></span>
    <span v-if="loading">Loading...</span>
    <span v-if="icon && !loading" class="material-symbols-outlined icon">{{
      icon
    }}</span>
    <span v-if="$slots.default && !loading">
      <slot></slot>
    </span>
    <span v-if="iconRight && !loading" class="material-symbols-outlined icon">{{
      iconRight
    }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (v: string) =>
      ["primary", "secondary", "success", "danger", "ghost"].includes(v),
  },
  size: {
    type: String,
    default: "md",
    validator: (v: string) => ["sm", "md", "lg"].includes(v),
  },
  icon: { type: String, default: "" },
  iconRight: { type: String, default: "" },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  outlined: { type: Boolean, default: false },
});

const variantClass = computed(() => `btn-${props.variant}`);
const sizeClass = computed(() => `btn-${props.size}`);
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/component_mixins" as *;

.base-btn {
  @include btn-base;

  // Variants
  &.btn-primary {
    @include btn-primary;
  }
  &.btn-secondary {
    @include btn-secondary;
  }
  &.btn-success {
    @include btn-success;
  }
  &.btn-danger {
    @include btn-danger;
  }
  &.btn-ghost {
    @include btn-ghost;
  }

  // Outlined Logic
  &.btn-outlined {
    &.btn-primary {
      @include btn-outlined($primary-color);
    }
    &.btn-secondary {
      @include btn-outlined($secondary-color);
    }
    &.btn-success {
      @include btn-outlined($status-success);
    }
    &.btn-danger {
      @include btn-outlined($status-danger);
    }
  }

  // Sizes
  &.btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;

    .icon {
      font-size: 1rem;
    }
  }

  &.btn-lg {
    padding: 1rem 2rem;
    font-size: 1rem;

    .icon {
      font-size: 1.5rem;
    }
  }

  &.w-full {
    width: 100%;
    display: flex;
  }

  .icon {
    font-size: 1.25rem;
  }
}

.spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
