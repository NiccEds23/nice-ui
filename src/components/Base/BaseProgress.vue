<template>
  <div
    class="base-progress"
    :class="[
      `progress-${variant}`,
      `progress-size-${size}`,
      { striped, animated, circular },
    ]"
  >
    <!-- Linear Progress -->
    <template v-if="!circular">
      <div v-if="label || showValue" class="progress-header">
        <span v-if="label" class="progress-label">{{ label }}</span>
        <span v-if="showValue" class="progress-value">{{ displayValue }}</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${clampedValue}%` }">
          <div v-if="striped" class="progress-stripes" />
        </div>
      </div>
      <p v-if="description" class="progress-description">{{ description }}</p>
    </template>

    <!-- Circular Progress -->
    <template v-else>
      <div class="circular-wrapper">
        <svg
          class="circular-svg"
          :width="circularSize"
          :height="circularSize"
          viewBox="0 0 100 100"
        >
          <circle class="circular-track" cx="50" cy="50" :r="radius" />
          <circle
            class="circular-fill"
            cx="50"
            cy="50"
            :r="radius"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
          />
        </svg>
        <div class="circular-content">
          <slot name="center">
            <span class="circular-value">{{ displayValue }}</span>
          </slot>
        </div>
      </div>
      <span v-if="label" class="progress-label center">{{ label }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    value: number;
    max?: number;
    label?: string;
    description?: string;
    variant?: "primary" | "success" | "warning" | "danger" | "secondary";
    size?: "xs" | "sm" | "md" | "lg";
    showValue?: boolean;
    striped?: boolean;
    animated?: boolean;
    circular?: boolean;
    circularSize?: number;
    suffix?: string;
  }>(),
  {
    max: 100,
    variant: "primary",
    size: "md",
    showValue: true,
    striped: false,
    animated: false,
    circular: false,
    circularSize: 100,
    suffix: "%",
  },
);

const clampedValue = computed(() =>
  Math.min(100, Math.max(0, (props.value / props.max) * 100)),
);
const displayValue = computed(
  () => `${Math.round(clampedValue.value)}${props.suffix}`,
);

const radius = 38;
const circumference = computed(() => 2 * Math.PI * radius);
const dashOffset = computed(
  () => circumference.value * (1 - clampedValue.value / 100),
);
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.base-progress {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.progress-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: $text-secondary;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &.center {
    text-align: center;
    margin-top: 0.375rem;
  }
}

.progress-value {
  font-size: 0.75rem;
  font-weight: 700;
  color: $text-primary;
}

.progress-description {
  font-size: 0.6875rem;
  color: $text-muted;
  margin: 0;
}

.progress-track {
  background: var(--surface-glass);
  border: 1px solid var(--border-light);
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}

.progress-size-xs .progress-track {
  height: 0.25rem;
}
.progress-size-sm .progress-track {
  height: 0.5rem;
}
.progress-size-md .progress-track {
  height: 0.75rem;
}
.progress-size-lg .progress-track {
  height: 1.25rem;
}

.progress-fill {
  height: 100%;
  border-radius: 9999px;
  position: relative;
  background: $primary-color;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.progress-primary .progress-fill {
  background: $primary-color;
}
.progress-success .progress-fill {
  background: $status-success;
}
.progress-warning .progress-fill {
  background: $status-warning;
}
.progress-danger .progress-fill {
  background: $status-danger;
}
.progress-secondary .progress-fill {
  background: $secondary-color;
}

.progress-stripes {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 0px,
    rgba(255, 255, 255, 0.2) 8px,
    transparent 8px,
    transparent 16px
  );
}

.animated .progress-stripes {
  animation: stripe-move 0.8s linear infinite;
}

@keyframes stripe-move {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 1.5rem 0;
  }
}

.circular-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.circular-svg {
  transform: rotate(-90deg);
  overflow: visible;
}

.circular-track {
  fill: none;
  stroke: var(--border-light);
  stroke-width: 8;
}

.circular-fill {
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
  stroke: $primary-color;
  transition: stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-primary .circular-fill {
  stroke: $primary-color;
}
.progress-success .circular-fill {
  stroke: $status-success;
}
.progress-warning .circular-fill {
  stroke: $status-warning;
}
.progress-danger .circular-fill {
  stroke: $status-danger;
}
.progress-secondary .circular-fill {
  stroke: $secondary-color;
}

.circular-content {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.circular-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: $text-primary;
  line-height: 1;
}
</style>
