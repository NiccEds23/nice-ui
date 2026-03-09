<template>
  <div
    class="base-divider"
    :class="[
      `divider-${orientation}`,
      `divider-${variant}`,
      { 'has-label': label || $slots.default },
    ]"
    role="separator"
  >
    <span
      v-if="(label || $slots.default) && orientation === 'horizontal'"
      class="divider-label"
    >
      <slot>{{ label }}</slot>
    </span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    orientation?: "horizontal" | "vertical";
    variant?: "solid" | "dashed" | "dotted" | "gradient";
  }>(),
  {
    orientation: "horizontal",
    variant: "solid",
  },
);
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.base-divider {
  display: flex;
  align-items: center;
  width: 100%;

  &.divider-horizontal {
    flex-direction: row;
    height: 1px;

    &:not(.has-label)::before {
      content: "";
      flex: 1;
      height: 1px;
    }

    &.has-label {
      gap: 0.75rem;

      &::before,
      &::after {
        content: "";
        flex: 1;
        height: 1px;
      }
    }
  }

  &.divider-vertical {
    flex-direction: column;
    width: 1px;
    height: 100%;
    align-self: stretch;

    &::before {
      content: "";
      flex: 1;
      width: 1px;
    }
  }

  // Variants — line style
  &.divider-solid::before,
  &.divider-solid::after,
  &.divider-solid:not(.has-label) {
    background: var(--border-light);
  }

  &.divider-dashed::before,
  &.divider-dashed::after,
  &.divider-dashed:not(.has-label) {
    background: repeating-linear-gradient(
      90deg,
      var(--border-light) 0px,
      var(--border-light) 6px,
      transparent 6px,
      transparent 12px
    );
    height: 1px;
  }

  &.divider-dotted::before,
  &.divider-dotted::after,
  &.divider-dotted:not(.has-label) {
    background: repeating-linear-gradient(
      90deg,
      var(--border-light) 0px,
      var(--border-light) 2px,
      transparent 2px,
      transparent 6px
    );
    height: 1px;
  }

  &.divider-gradient::before,
  &.divider-gradient::after,
  &.divider-gradient:not(.has-label) {
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--border-light) 30%,
      $primary-color 50%,
      var(--border-light) 70%,
      transparent 100%
    );
  }
}

.divider-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: $text-muted;
  white-space: nowrap;
  padding: 0 0.25rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>
