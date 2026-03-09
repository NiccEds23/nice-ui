<template>
  <span
    class="base-badge"
    :class="[
      `badge-${variant}`,
      `badge-size-${size}`,
      { 'badge-pill': pill, 'badge-dot': dot },
    ]"
  >
    <span v-if="dot" class="badge-dot-circle" />
    <span v-if="icon && !dot" class="material-symbols-outlined badge-icon">{{
      icon
    }}</span>
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?:
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "danger"
      | "info"
      | "neutral";
    size?: "xs" | "sm" | "md";
    pill?: boolean;
    dot?: boolean;
    icon?: string;
  }>(),
  {
    variant: "neutral",
    size: "sm",
    pill: false,
    dot: false,
    icon: "",
  },
);
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.base-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 0.5rem;
  white-space: nowrap;

  // Sizes
  &.badge-size-xs {
    font-size: 0.5625rem;
    padding: 0.125rem 0.5rem;
  }
  &.badge-size-sm {
    font-size: 0.6875rem;
    padding: 0.2rem 0.625rem;
  }
  &.badge-size-md {
    font-size: 0.75rem;
    padding: 0.3rem 0.75rem;
  }

  &.badge-pill {
    border-radius: 9999px;
  }

  // Dot mode
  &.badge-dot {
    gap: 0.4rem;

    .badge-dot-circle {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      flex-shrink: 0;
      background: currentColor;
    }
  }

  .badge-icon {
    font-size: 0.875em;
  }

  // Variants
  &.badge-primary {
    background: rgba($primary-rgb, 0.12);
    color: $primary-color;
  }
  &.badge-secondary {
    background: rgba($secondary-rgb, 0.12);
    color: $secondary-color;
  }
  &.badge-success {
    background: rgba($status-success-rgb, 0.12);
    color: $status-success;
  }
  &.badge-warning {
    background: rgba($status-warning-rgb, 0.12);
    color: $status-warning;
  }
  &.badge-danger {
    background: rgba($status-danger-rgb, 0.12);
    color: $status-danger;
  }
  &.badge-info {
    background: rgba($status-info-rgb, 0.12);
    color: $status-info;
  }
  &.badge-neutral {
    background: var(--surface-glass);
    color: $text-secondary;
    border: 1px solid var(--border-light);
  }
}
</style>
