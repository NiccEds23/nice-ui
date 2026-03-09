<template>
  <div
    class="base-stepper"
    :class="[`stepper-${orientation}`, `stepper-size-${size}`]"
  >
    <div class="stepper-track">
      <div
        v-for="(step, index) in steps"
        :key="step.key ?? index"
        class="stepper-step"
        :class="{
          'is-completed': index < modelValue,
          'is-active': index === modelValue,
          'is-error': step.error,
          'is-clickable': clickable && index < modelValue,
        }"
        @click="
          clickable && index < modelValue && $emit('update:modelValue', index)
        "
      >
        <!-- Node -->
        <div class="step-node">
          <Transition name="step-icon" mode="out-in">
            <span
              v-if="step.error"
              class="material-symbols-outlined node-icon"
              key="err"
              >cancel</span
            >
            <span
              v-else-if="index < modelValue"
              class="material-symbols-outlined node-icon"
              key="done"
              >check</span
            >
            <span
              v-else-if="step.icon"
              class="material-symbols-outlined node-icon"
              key="icon"
              >{{ step.icon }}</span
            >
            <span v-else class="node-number" key="num">{{ index + 1 }}</span>
          </Transition>
        </div>

        <!-- Connector -->
        <div v-if="index < steps.length - 1" class="step-connector">
          <div class="connector-fill" :class="{ filled: index < modelValue }" />
        </div>

        <!-- Label -->
        <div class="step-label">
          <span class="step-title">{{ step.label }}</span>
          <span v-if="step.description" class="step-description">{{
            step.description
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface StepItem {
  key?: string;
  label: string;
  description?: string;
  icon?: string;
  error?: boolean;
}

withDefaults(
  defineProps<{
    modelValue: number; // current step index (0-based)
    steps: StepItem[];
    orientation?: "horizontal" | "vertical";
    size?: "sm" | "md" | "lg";
    clickable?: boolean; // allow clicking completed steps to go back
  }>(),
  {
    orientation: "horizontal",
    size: "md",
    clickable: false,
  },
);

defineEmits<{ "update:modelValue": [index: number] }>();
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

// ── Track ──────────────────────────────────────────────────────────────────
.stepper-track {
  display: flex;
  width: 100%;
}

// ── Horizontal ─────────────────────────────────────────────────────────────
.stepper-horizontal {
  .stepper-track {
    flex-direction: row;
    align-items: flex-start;
  }

  .stepper-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    gap: 0.625rem;
    position: relative;
  }

  .step-connector {
    position: absolute;
    top: 1rem;
    left: calc(50% + 1.25rem);
    right: calc(-50% + 1.25rem);
    height: 2px;
    background: var(--border-light);
    overflow: hidden;

    .connector-fill {
      height: 100%;
      width: 0;
      background: $primary-color;
      transition: width 0.4s ease;

      &.filled {
        width: 100%;
      }
    }
  }

  .step-label {
    text-align: center;
  }
}

// ── Vertical ───────────────────────────────────────────────────────────────
.stepper-vertical {
  .stepper-track {
    flex-direction: column;
    gap: 0;
  }

  .stepper-step {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 1rem;
    position: relative;
  }

  .step-node {
    flex-shrink: 0;
  }

  .step-connector {
    position: absolute;
    left: 1rem;
    top: 2.25rem;
    bottom: -0.25rem;
    width: 2px;
    background: var(--border-light);
    transform: translateX(-50%);
    overflow: hidden;

    .connector-fill {
      width: 100%;
      height: 0;
      background: $primary-color;
      transition: height 0.4s ease;

      &.filled {
        height: 100%;
      }
    }
  }

  .step-label {
    padding: 0.25rem 0 1.5rem;
  }
}

// ── Node ───────────────────────────────────────────────────────────────────
.step-node {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border-light);
  background: var(--surface-white);
  color: $text-muted;
  transition: all 0.25s;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.node-icon {
  font-size: 1rem;
}
.node-number {
  font-size: 0.75rem;
  font-weight: 700;
}

// ── States ─────────────────────────────────────────────────────────────────
.is-active .step-node {
  border-color: $primary-color;
  background: $primary-color;
  color: white;
  box-shadow: 0 0 0 4px rgba($primary-rgb, 0.15);
}

.is-completed .step-node {
  border-color: $status-success;
  background: $status-success;
  color: white;
}

.is-error .step-node {
  border-color: $status-danger;
  background: $status-danger;
  color: white;
}

.is-clickable {
  cursor: pointer;
}

// ── Labels ──────────────────────────────────────────────────────────────────
.step-title {
  display: block;
  font-size: 0.8125rem;
  font-weight: 700;
  color: $text-secondary;
  transition: color 0.2s;

  .is-active & {
    color: $primary-color;
  }
  .is-completed & {
    color: $text-primary;
  }
  .is-error & {
    color: $status-danger;
  }
}

.step-description {
  display: block;
  font-size: 0.75rem;
  color: $text-muted;
  margin-top: 0.125rem;
}

// ── Icon transition ─────────────────────────────────────────────────────────
.step-icon-enter-active,
.step-icon-leave-active {
  transition: all 0.2s;
}
.step-icon-enter-from {
  opacity: 0;
  transform: scale(0.5);
}
.step-icon-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

// ── Sizes ───────────────────────────────────────────────────────────────────
.stepper-size-sm {
  .step-node {
    width: 1.5rem;
    height: 1.5rem;
  }
  .node-icon {
    font-size: 0.875rem;
  }
  .node-number {
    font-size: 0.625rem;
  }
  .step-title {
    font-size: 0.75rem;
  }
}

.stepper-size-lg {
  .step-node {
    width: 2.5rem;
    height: 2.5rem;
  }
  .node-icon {
    font-size: 1.25rem;
  }
  .node-number {
    font-size: 0.875rem;
  }
  .step-title {
    font-size: 0.9375rem;
  }
}
</style>
