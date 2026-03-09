<template>
  <div
    class="base-rating"
    :class="[
      `rating-${size}`,
      `rating-${variant}`,
      { 'is-readonly': readonly, 'is-disabled': disabled },
    ]"
    role="radiogroup"
    :aria-label="label || 'Rating'"
  >
    <span v-if="label" class="rating-label">{{ label }}</span>
    <div class="rating-stars">
      <button
        v-for="i in max"
        :key="i"
        type="button"
        class="star-btn"
        :class="{
          'star-full': i <= displayValue,
          'star-half': halfStar && i - 0.5 === displayValue,
          'star-empty': i > displayValue,
        }"
        :disabled="readonly || disabled"
        :aria-label="`${i} out of ${max}`"
        @mouseenter="!readonly && !disabled && (hovered = i)"
        @mouseleave="!readonly && !disabled && (hovered = 0)"
        @click="!readonly && !disabled && select(i)"
      >
        <span class="material-symbols-outlined star-icon">
          {{ getIcon(i) }}
        </span>
      </button>
    </div>
    <span v-if="showValue" class="rating-value">
      {{ modelValue }} / {{ max }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    max?: number;
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "warning" | "danger" | "success";
    readonly?: boolean;
    disabled?: boolean;
    halfStar?: boolean;
    showValue?: boolean;
    label?: string;
  }>(),
  {
    modelValue: 0,
    max: 5,
    size: "md",
    variant: "warning",
    readonly: false,
    disabled: false,
    halfStar: false,
    showValue: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const hovered = ref(0);
const displayValue = computed(() => hovered.value || props.modelValue);

function getIcon(i: number): string {
  const val = displayValue.value;
  if (props.halfStar && i - 0.5 === val) return "star_half";
  if (i <= val) return "star";
  return "star";
}

function select(i: number) {
  // toggle off if clicking same value
  const newVal = props.modelValue === i ? 0 : i;
  emit("update:modelValue", newVal);
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.base-rating {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &.is-disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}

.rating-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: $text-secondary;
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 0.125rem;
}

.star-btn {
  background: none;
  border: none;
  padding: 0.125rem;
  cursor: pointer;
  transition: transform 0.15s;
  display: flex;

  &:not(:disabled):hover {
    transform: scale(1.2);
  }
}

.star-icon {
  transition: color 0.15s;
  font-variation-settings: "FILL" 0;
}

// Filled stars
.star-full .star-icon {
  font-variation-settings: "FILL" 1;
}
.star-half .star-icon {
  font-variation-settings: "FILL" 1;
}

// Sizes
.rating-sm .star-icon {
  font-size: 1rem;
}
.rating-md .star-icon {
  font-size: 1.5rem;
}
.rating-lg .star-icon {
  font-size: 2rem;
}

// Variants — color the stars
.rating-warning .star-full .star-icon,
.rating-warning .star-half .star-icon,
.rating-warning .star-btn:hover .star-icon {
  color: $status-warning;
}
.rating-warning .star-empty .star-icon {
  color: var(--border-light);
}

.rating-primary .star-full .star-icon,
.rating-primary .star-half .star-icon,
.rating-primary .star-btn:hover .star-icon {
  color: $primary-color;
}
.rating-primary .star-empty .star-icon {
  color: var(--border-light);
}

.rating-danger .star-full .star-icon,
.rating-danger .star-half .star-icon,
.rating-danger .star-btn:hover .star-icon {
  color: $status-danger;
}
.rating-danger .star-empty .star-icon {
  color: var(--border-light);
}

.rating-success .star-full .star-icon,
.rating-success .star-half .star-icon,
.rating-success .star-btn:hover .star-icon {
  color: $status-success;
}
.rating-success .star-empty .star-icon {
  color: var(--border-light);
}

.is-readonly .star-btn {
  cursor: default;
}

.rating-value {
  font-size: 0.8125rem;
  font-weight: 600;
  color: $text-secondary;
}
</style>
