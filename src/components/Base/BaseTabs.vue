<template>
  <div class="base-tabs" :class="`tabs-${variant}`">
    <!-- Tab Navigation -->
    <div class="tabs-nav" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        role="tab"
        class="tab-item"
        :class="{ active: modelValue === tab.key, disabled: tab.disabled }"
        :aria-selected="modelValue === tab.key"
        :disabled="tab.disabled"
        @click="!tab.disabled && $emit('update:modelValue', tab.key)"
      >
        <span v-if="tab.icon" class="material-symbols-outlined tab-icon">{{
          tab.icon
        }}</span>
        {{ tab.label }}
        <BaseBadge
          v-if="tab.badge != null"
          :variant="tab.badgeVariant ?? 'primary'"
          size="xs"
          pill
        >
          {{ tab.badge }}
        </BaseBadge>
      </button>
      <div class="tabs-indicator" :style="indicatorStyle" />
    </div>

    <!-- Tab Content -->
    <div class="tabs-content">
      <slot :active="modelValue" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseBadge from "./BaseBadge.vue";

export interface TabItem {
  key: string;
  label: string;
  icon?: string;
  badge?: string | number;
  badgeVariant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral";
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue: string;
    tabs: TabItem[];
    variant?: "line" | "pill" | "card";
  }>(),
  {
    variant: "line",
  },
);

defineEmits<{ "update:modelValue": [key: string] }>();

const indicatorStyle = computed(() => {
  if (props.variant !== "line") return {};
  const idx = props.tabs.findIndex((t) => t.key === props.modelValue);
  const tabCount = props.tabs.length;
  return {
    width: `${100 / tabCount}%`,
    transform: `translateX(${idx * 100}%)`,
  };
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.base-tabs {
  display: flex;
  flex-direction: column;
  width: 100%;
}

// ── Navigation ─────────────────────────────────────────────────────────────
.tabs-nav {
  display: flex;
  position: relative;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.625rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: $text-secondary;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  position: relative;
  z-index: 1;

  .tab-icon {
    font-size: 1rem;
  }

  &:hover:not(.disabled):not(.active) {
    color: $text-primary;
  }

  &.active {
    color: $primary-color;
  }

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

// ── Line variant ───────────────────────────────────────────────────────────
.tabs-line {
  .tabs-nav {
    border-bottom: 2px solid var(--border-light);
  }

  .tabs-indicator {
    position: absolute;
    bottom: -2px;
    left: 0;
    height: 2px;
    background: $primary-color;
    border-radius: 2px 2px 0 0;
    transition:
      transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      width 0.25s;
  }

  .tabs-content {
    padding-top: 1.25rem;
  }
}

// ── Pill variant ───────────────────────────────────────────────────────────
.tabs-pill {
  .tabs-nav {
    background: var(--surface-glass);
    border: 1px solid var(--border-light);
    border-radius: 1rem;
    padding: 0.25rem;
    gap: 0.25rem;
    width: fit-content;
  }

  .tab-item {
    border-radius: 0.75rem;
    padding: 0.5rem 1rem;

    &.active {
      background: $primary-color;
      color: white;
      box-shadow: 0 2px 8px rgba($primary-rgb, 0.3);
    }
  }

  .tabs-indicator {
    display: none;
  }

  .tabs-content {
    padding-top: 1.25rem;
  }
}

// ── Card variant ───────────────────────────────────────────────────────────
.tabs-card {
  .tabs-nav {
    gap: 0.25rem;
  }

  .tab-item {
    border-radius: 0.75rem 0.75rem 0 0;
    border: 1px solid transparent;
    border-bottom: none;
    padding: 0.625rem 1.25rem;

    &.active {
      background: var(--surface-white);
      border-color: var(--border-light);
      color: $primary-color;
    }
  }

  .tabs-indicator {
    display: none;
  }

  .tabs-content {
    background: var(--surface-white);
    border: 1px solid var(--border-light);
    border-radius: 0 0.75rem 0.75rem 0.75rem;
    padding: 1.25rem;
  }
}
</style>
