<template>
  <div class="base-alert" :class="`alert-${variant}`" role="alert">
    <div class="alert-icon-wrapper">
      <span class="material-symbols-outlined icon">{{ iconName }}</span>
    </div>
    <div class="alert-content">
      <h4 v-if="title" class="alert-title">{{ title }}</h4>
      <p class="alert-message">
        <slot>{{ message }}</slot>
      </p>
    </div>
    <button v-if="dismissible" class="dismiss-btn" @click="$emit('dismiss')">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "info",
    validator: (v: string) =>
      ["info", "success", "warning", "danger"].includes(v),
  },
  title: { type: String, default: "" },
  message: { type: String, default: "" },
  dismissible: { type: Boolean, default: false },
});

defineEmits(["dismiss"]);

const iconName = computed(() => {
  switch (props.variant) {
    case "success":
      return "check_circle";
    case "warning":
      return "warning";
    case "danger":
      return "error";
    default:
      return "info";
  }
});
</script>

<style lang="scss" scoped>
@use "sass:color";
@use "@/assets/styles/variables" as *;

.base-alert {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(8px);

  // Variants
  &.alert-info {
    background: rgba($status-info-rgb, 0.1);
    border-color: rgba($status-info-rgb, 0.3);
    color: color-mix(in srgb, $status-info, black 20%);

    .alert-icon-wrapper {
      background: rgba($status-info-rgb, 0.2);
      color: $status-info;
    }
  }

  &.alert-success {
    background: rgba($status-success-rgb, 0.1);
    border-color: rgba($status-success-rgb, 0.3);
    color: color-mix(
      in srgb,
      $status-success,
      black 30%
    ); // Green needs more darkening for text

    .alert-icon-wrapper {
      background: rgba($status-success-rgb, 0.2);
      color: $status-success;
    }
  }

  &.alert-warning {
    background: rgba($status-warning-rgb, 0.1);
    border-color: rgba($status-warning-rgb, 0.3);
    color: color-mix(
      in srgb,
      $status-warning,
      black 45%
    ); // Amber needs significant darkening

    .alert-icon-wrapper {
      background: rgba($status-warning-rgb, 0.2);
      color: $status-warning;
    }
  }

  &.alert-danger {
    background: rgba($status-danger-rgb, 0.1);
    border-color: rgba($status-danger-rgb, 0.3);
    color: color-mix(in srgb, $status-danger, black 20%);

    .alert-icon-wrapper {
      background: rgba($status-danger-rgb, 0.2);
      color: $status-danger;
    }
  }
}

.alert-icon-wrapper {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    font-size: 1.25rem;
  }
}

.alert-content {
  flex: 1;
  padding-top: 0.125rem;

  .alert-title {
    font-weight: 700;
    margin: 0;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
    letter-spacing: -0.01em;
  }

  .alert-message {
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.5;
    opacity: 0.9;
  }
}

.dismiss-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  color: currentColor;
  opacity: 0.5;
  transition: opacity 0.2s;
  align-self: flex-start;
  margin-top: -0.25rem;
  margin-right: -0.25rem;

  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.05);
  }
}
</style>
