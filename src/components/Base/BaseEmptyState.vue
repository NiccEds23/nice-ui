<template>
  <div class="base-empty-state" :class="`empty-${size}`">
    <div class="empty-icon-wrapper" :class="`icon-${variant}`">
      <span class="material-symbols-outlined empty-icon">{{ icon }}</span>
    </div>
    <div class="empty-text">
      <h3 v-if="title" class="empty-title">{{ title }}</h3>
      <p v-if="description" class="empty-description">{{ description }}</p>
    </div>
    <div v-if="$slots.action" class="empty-action">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string;
    title?: string;
    description?: string;
    variant?: "default" | "primary" | "success" | "warning" | "danger";
    size?: "sm" | "md" | "lg";
  }>(),
  {
    icon: "search_off",
    title: "No data found",
    description: "",
    variant: "default",
    size: "md",
  },
);
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.base-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  text-align: center;
  padding: 3rem 2rem;
  width: 100%;

  &.empty-sm {
    padding: 1.5rem 1rem;
    gap: 0.75rem;
  }
  &.empty-lg {
    padding: 5rem 2rem;
    gap: 1.5rem;
  }
}

.empty-icon-wrapper {
  width: 5rem;
  height: 5rem;
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  .empty-sm & {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 1rem;
  }
  .empty-lg & {
    width: 6.5rem;
    height: 6.5rem;
    border-radius: 2rem;
  }

  &.icon-default {
    background: var(--surface-glass);
    color: $text-muted;
  }
  &.icon-primary {
    background: rgba($primary-rgb, 0.1);
    color: $primary-color;
  }
  &.icon-success {
    background: rgba($status-success-rgb, 0.1);
    color: $status-success;
  }
  &.icon-warning {
    background: rgba($status-warning-rgb, 0.1);
    color: $status-warning;
  }
  &.icon-danger {
    background: rgba($status-danger-rgb, 0.1);
    color: $status-danger;
  }
}

.empty-icon {
  font-size: 2.25rem;
  .empty-sm & {
    font-size: 1.5rem;
  }
  .empty-lg & {
    font-size: 3rem;
  }
}

.empty-text {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.empty-title {
  font-size: 1rem;
  font-weight: 700;
  color: $text-primary;
  margin: 0;

  .empty-sm & {
    font-size: 0.875rem;
  }
  .empty-lg & {
    font-size: 1.25rem;
  }
}

.empty-description {
  font-size: 0.875rem;
  color: $text-muted;
  margin: 0;
  max-width: 28rem;
  line-height: 1.6;
}

.empty-action {
  margin-top: 0.25rem;
}
</style>
