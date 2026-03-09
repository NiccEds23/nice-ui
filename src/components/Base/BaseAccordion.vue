<template>
  <div class="base-accordion" :class="{ 'accordion-flush': flush }">
    <div
      v-for="(item, idx) in items"
      :key="item.key ?? idx"
      class="accordion-item"
      :class="{
        'is-open': isOpen(item.key ?? String(idx)),
        'is-disabled': item.disabled,
      }"
    >
      <button
        class="accordion-trigger"
        :disabled="item.disabled"
        :aria-expanded="isOpen(item.key ?? String(idx))"
        @click="toggle(item.key ?? String(idx))"
      >
        <span
          v-if="item.icon"
          class="material-symbols-outlined accordion-icon"
          >{{ item.icon }}</span
        >
        <span class="accordion-title">{{ item.title }}</span>
        <BaseBadge
          v-if="item.badge != null"
          :variant="item.badgeVariant ?? 'primary'"
          size="xs"
          pill
        >
          {{ item.badge }}
        </BaseBadge>
        <span class="accordion-chevron material-symbols-outlined"
          >expand_more</span
        >
      </button>
      <Transition name="accordion">
        <div v-if="isOpen(item.key ?? String(idx))" class="accordion-body">
          <div class="accordion-content">
            <slot :name="`item-${item.key ?? idx}`" :item="item">
              {{ item.content }}
            </slot>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseBadge from "./BaseBadge.vue";

export interface AccordionItem {
  key?: string;
  title: string;
  content?: string;
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
    items: AccordionItem[];
    multiple?: boolean;
    defaultOpen?: string[];
    flush?: boolean;
  }>(),
  {
    multiple: false,
    defaultOpen: () => [],
    flush: false,
  },
);

const openKeys = ref<Set<string>>(new Set(props.defaultOpen));

function isOpen(key: string) {
  return openKeys.value.has(key);
}

function toggle(key: string) {
  if (openKeys.value.has(key)) {
    openKeys.value.delete(key);
  } else {
    if (!props.multiple) openKeys.value.clear();
    openKeys.value.add(key);
  }
  // trigger reactivity
  openKeys.value = new Set(openKeys.value);
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.base-accordion {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.accordion-flush {
  gap: 0;

  .accordion-item {
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: none;

    &:first-child {
      border-top: 1px solid var(--border-light);
    }
  }
}

.accordion-item {
  border: 1px solid var(--border-light);
  border-radius: 1rem;
  background: var(--surface-glass);
  overflow: hidden;
  transition: border-color 0.2s;

  &.is-open {
    border-color: $primary-color;
    background: var(--surface-white);

    .accordion-chevron {
      transform: rotate(180deg);
    }
  }

  &.is-disabled {
    opacity: 0.45;
    pointer-events: none;
  }
}

.accordion-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  color: $text-primary;
  transition: background 0.15s;

  &:hover {
    background: var(--neutral-50);
  }
}

.accordion-icon {
  font-size: 1.125rem;
  color: $primary-color;
  flex-shrink: 0;
}

.accordion-title {
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 600;
}

.accordion-chevron {
  font-size: 1.25rem;
  color: $text-muted;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.accordion-body {
  overflow: hidden;
}

.accordion-content {
  padding: 0 1.25rem 1.25rem;
  font-size: 0.875rem;
  line-height: 1.7;
  color: $text-secondary;
}

// Transition
.accordion-enter-active,
.accordion-leave-active {
  transition:
    max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s;
  max-height: 600px;
  opacity: 1;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
