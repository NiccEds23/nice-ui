<template>
  <div
    class="base-stat-card"
    :class="[`stat-${variant}`, { 'stat-clickable': clickable }]"
    @click="clickable && $emit('click')"
  >
    <!-- Icon -->
    <div class="stat-icon-wrap">
      <span class="material-symbols-outlined stat-icon">{{ icon }}</span>
    </div>

    <!-- Body -->
    <div class="stat-body">
      <div class="stat-header">
        <span class="stat-label">{{ label }}</span>
        <div
          v-if="trend != null"
          class="stat-trend"
          :class="trend >= 0 ? 'trend-up' : 'trend-down'"
        >
          <span class="material-symbols-outlined trend-icon">
            {{ trend >= 0 ? "trending_up" : "trending_down" }}
          </span>
          <span class="trend-value">{{ Math.abs(trend) }}%</span>
        </div>
      </div>

      <div class="stat-value-row">
        <span class="stat-value">{{ formattedValue }}</span>
        <span v-if="suffix" class="stat-suffix">{{ suffix }}</span>
      </div>

      <p v-if="description" class="stat-description">{{ description }}</p>

      <!-- Mini sparkline -->
      <div v-if="sparkline && sparkline.length > 1" class="stat-sparkline">
        <svg
          :width="sparkWidth"
          :height="sparkHeight"
          :viewBox="`0 0 ${sparkWidth} ${sparkHeight}`"
          preserveAspectRatio="none"
        >
          <polyline
            :points="sparkPoints"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="sparkline-line"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    value: number | string;
    label: string;
    icon?: string;
    variant?:
      | "primary"
      | "success"
      | "warning"
      | "danger"
      | "secondary"
      | "neutral";
    trend?: number;
    description?: string;
    suffix?: string;
    sparkline?: number[];
    clickable?: boolean;
    formatValue?: boolean;
  }>(),
  {
    icon: "analytics",
    variant: "primary",
    formatValue: true,
    clickable: false,
  },
);

defineEmits<{ click: [] }>();

const sparkWidth = 80;
const sparkHeight = 28;

const formattedValue = computed(() => {
  if (typeof props.value === "string") return props.value;
  if (!props.formatValue) return String(props.value);
  return new Intl.NumberFormat("id-ID").format(props.value);
});

const sparkPoints = computed(() => {
  const data = props.sparkline ?? [];
  if (data.length < 2) return "";
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  return data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * sparkWidth;
      const y = sparkHeight - ((v - min) / range) * (sparkHeight - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.base-stat-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 1.25rem;
  border: 1px solid var(--border-light);
  background: var(--surface-white);
  transition: all 0.2s;
  overflow: hidden;

  &.stat-clickable {
    cursor: pointer;
    position: relative;

    &:hover {
      border-color: $primary-color;
      box-shadow: 0 4px 20px rgba($primary-rgb, 0.1);
      transform: translateY(-2px);
      z-index: 1;
    }
  }
}

.stat-icon-wrap {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon {
  font-size: 1.375rem;
}

// Variant colors
.stat-primary .stat-icon-wrap {
  background: rgba($primary-rgb, 0.1);

  .stat-icon {
    color: $primary-color;
  }
}
.stat-success .stat-icon-wrap {
  background: rgba($status-success-rgb, 0.1);
  .stat-icon {
    color: $status-success;
  }
}
.stat-warning .stat-icon-wrap {
  background: rgba($status-warning-rgb, 0.1);
  .stat-icon {
    color: $status-warning;
  }
}
.stat-danger .stat-icon-wrap {
  background: rgba($status-danger-rgb, 0.1);
  .stat-icon {
    color: $status-danger;
  }
}
.stat-secondary .stat-icon-wrap {
  background: rgba($secondary-rgb, 0.1);
  .stat-icon {
    color: $secondary-color;
  }
}
.stat-neutral .stat-icon-wrap {
  background: var(--surface-glass);
  .stat-icon {
    color: $text-secondary;
  }
}

.stat-body {
  flex: 1;
  min-width: 0;
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: $text-muted;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;

  &.trend-up {
    background: rgba($status-success-rgb, 0.1);
    color: $status-success;
  }

  &.trend-down {
    background: rgba($status-danger-rgb, 0.1);
    color: $status-danger;
  }
}

.trend-icon {
  font-size: 0.875rem;
}

.stat-value-row {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  flex-wrap: wrap;
  overflow: hidden;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: $text-primary;
  line-height: 1.1;
  letter-spacing: -0.02em;
  word-break: break-all;
  min-width: 0;
}

.stat-suffix {
  font-size: 0.875rem;
  font-weight: 600;
  color: $text-muted;
}

.stat-description {
  font-size: 0.75rem;
  color: $text-muted;
  margin: 0.25rem 0 0;
}

.stat-sparkline {
  margin-top: 0.625rem;
  color: $primary-color;
  opacity: 0.7;
}

.stat-primary .sparkline-line {
  stroke: $primary-color;
}
.stat-success .sparkline-line {
  stroke: $status-success;
}
.stat-warning .sparkline-line {
  stroke: $status-warning;
}
.stat-danger .sparkline-line {
  stroke: $status-danger;
}
.stat-secondary .sparkline-line {
  stroke: $secondary-color;
}
</style>
