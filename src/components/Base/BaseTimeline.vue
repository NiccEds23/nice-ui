<template>
  <div
    class="base-timeline"
    :class="[`timeline-${variant}`, `timeline-${orientation}`]"
  >
    <div
      v-for="(item, idx) in items"
      :key="item.key ?? idx"
      class="timeline-item"
      :class="[
        `item-${item.status ?? 'default'}`,
        { 'item-last': idx === items.length - 1 },
      ]"
    >
      <!-- Connector line (before icon) -->
      <div class="timeline-track">
        <div class="timeline-line" v-if="idx < items.length - 1" />
        <div class="timeline-node">
          <slot :name="`icon-${item.key ?? idx}`" :item="item" :index="idx">
            <span
              v-if="item.icon"
              class="material-symbols-outlined node-icon"
              >{{ item.icon }}</span
            >
            <span v-else class="node-dot" />
          </slot>
        </div>
      </div>

      <!-- Content -->
      <div class="timeline-content">
        <div class="timeline-header">
          <span class="timeline-title">{{ item.title }}</span>
          <span v-if="item.time" class="timeline-time">{{ item.time }}</span>
        </div>
        <p v-if="item.description" class="timeline-desc">
          {{ item.description }}
        </p>
        <slot :name="`content-${item.key ?? idx}`" :item="item" :index="idx" />
        <BaseBadge
          v-if="item.badge"
          :variant="item.badgeVariant ?? 'neutral'"
          size="xs"
          class="mt-2"
        >
          {{ item.badge }}
        </BaseBadge>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseBadge from "./BaseBadge.vue";

export interface TimelineItem {
  key?: string;
  title: string;
  description?: string;
  time?: string;
  icon?: string;
  status?: "default" | "success" | "warning" | "danger" | "info" | "muted";
  badge?: string;
  badgeVariant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral";
}

withDefaults(
  defineProps<{
    items: TimelineItem[];
    variant?: "default" | "compact";
    orientation?: "vertical" | "horizontal";
  }>(),
  {
    variant: "default",
    orientation: "vertical",
  },
);
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.base-timeline {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1.5rem;

  &.item-last {
    padding-bottom: 0;
  }
}

// ── Track ───────────────────────────────────────────────────────────────────
.timeline-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 2rem;
  flex-shrink: 0;
}

.timeline-line {
  flex: 1;
  width: 2px;
  background: var(--border-light);
  margin-top: 0.25rem;
  margin-bottom: 0;
  min-height: 1.5rem;
}

.timeline-node {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--surface-glass);
  border: 2px solid var(--border-light);
  order: -1; // icon before line
}

.node-icon {
  font-size: 1rem;
  color: $text-secondary;
}

.node-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: $text-muted;
}

// Status variants — node
.item-success .timeline-node {
  border-color: $status-success;
  background: rgba($status-success-rgb, 0.1);
  .node-icon {
    color: $status-success;
  }
  .node-dot {
    background: $status-success;
  }
}
.item-warning .timeline-node {
  border-color: $status-warning;
  background: rgba($status-warning-rgb, 0.1);
  .node-icon {
    color: $status-warning;
  }
  .node-dot {
    background: $status-warning;
  }
}
.item-danger .timeline-node {
  border-color: $status-danger;
  background: rgba($status-danger-rgb, 0.1);
  .node-icon {
    color: $status-danger;
  }
  .node-dot {
    background: $status-danger;
  }
}
.item-info .timeline-node {
  border-color: $primary-color;
  background: rgba($primary-rgb, 0.1);
  .node-icon {
    color: $primary-color;
  }
  .node-dot {
    background: $primary-color;
  }
}
.item-muted .timeline-node {
  opacity: 0.45;
}

// ── Content ─────────────────────────────────────────────────────────────────
.timeline-content {
  flex: 1;
  padding-top: 0.25rem;
}

.timeline-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.timeline-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: $text-primary;
}

.timeline-time {
  font-size: 0.75rem;
  color: $text-muted;
  white-space: nowrap;
}

.timeline-desc {
  font-size: 0.875rem;
  color: $text-secondary;
  margin: 0;
  line-height: 1.6;
}

// Compact mode
.timeline-compact {
  .timeline-item {
    gap: 0.75rem;
    padding-bottom: 1rem;
  }

  .timeline-node {
    width: 1.5rem;
    height: 1.5rem;
  }

  .timeline-title {
    font-size: 0.875rem;
  }
}

.mt-2 {
  margin-top: 0.5rem;
}
</style>
