<template>
  <div class="base-highlight-card glass-card">
    <div class="card-header">
      <!-- Icon Box -->
      <div v-if="icon" class="icon-box" :class="`soft-${variant}`">
        <span class="material-symbols-outlined">{{ icon }}</span>
      </div>

      <!-- Trend/Status Badge -->
      <div
        v-if="trend || status"
        class="trend-badge"
        :class="status || (trend && trend > 0 ? 'positive' : 'negative')"
      >
        <span class="material-symbols-outlined icon">
          {{
            statusIcon || (trend && trend > 0 ? "trending_up" : "trending_down")
          }}
        </span>
        <span v-if="trendLabel">{{ trendLabel }}</span>
      </div>

      <slot name="header-actions"></slot>
    </div>

    <!-- Content -->
    <div class="card-body">
      <p v-if="label" class="card-label">{{ label }}</p>

      <div class="value-wrapper">
        <slot name="value">
          <h3 class="card-value">
            {{ formattedValue }}
            <span v-if="unit" class="unit">{{ unit }}</span>
          </h3>
        </slot>
      </div>

      <div v-if="subtext || $slots.footer" class="card-footer">
        <p
          v-if="subtext"
          class="card-sub"
          :class="{
            'text-danger': subtextIntent === 'danger',
            'text-success': subtextIntent === 'success',
          }"
        >
          {{ subtext }}
        </p>
        <slot name="footer"></slot>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  label: { type: String, default: "" },
  value: { type: [String, Number], default: "" },
  unit: { type: String, default: "" },
  icon: { type: String, default: "" },
  variant: { type: String, default: "blue" }, // blue, indigo, rose, emerald, purple
  trend: { type: Number, default: 0 },
  trendLabel: { type: String, default: "" },
  status: { type: String, default: "" }, // positive, negative, optimal, alert
  statusIcon: { type: String, default: "" },
  subtext: { type: String, default: "" },
  subtextIntent: { type: String, default: "neutral" }, // neutral, danger, success
  loading: { type: Boolean, default: false },
});

const formattedValue = computed(() => {
  return props.value;
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/mixins" as *;
@use "@/assets/styles/component_mixins" as *;

.base-highlight-card {
  @include glass-card;
  padding: 1.5rem;
  border-radius: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;

    .icon-box {
      padding: 0.75rem;
      border-radius: 1rem;
      border: 1px solid transparent;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        font-size: 1.25rem;
      }

      // Variants
      &.soft-blue {
        background: rgba($primary-rgb, 0.1);
        color: $primary-color;
        border-color: rgba($primary-rgb, 0.2);
      }
      &.soft-indigo {
        background: rgba(79, 70, 229, 0.1);
        color: #818cf8;
        border-color: rgba(79, 70, 229, 0.2);
      } // Indigo 500
      &.soft-rose {
        background: rgba(244, 63, 94, 0.1);
        color: #fb7185;
        border-color: rgba(244, 63, 94, 0.2);
      } // Rose 500
      &.soft-emerald {
        background: rgba($status-success-rgb, 0.1);
        color: $status-success;
        border-color: rgba($status-success-rgb, 0.2);
      }
      &.soft-purple {
        background: rgba(147, 51, 234, 0.1);
        color: #c084fc;
        border-color: rgba(147, 51, 234, 0.2);
      } // Purple 600
      &.soft-orange {
        background: rgba(234, 88, 12, 0.1);
        color: #fb923c;
        border-color: rgba(234, 88, 12, 0.2);
      } // Orange 600
    }

    .trend-badge {
      font-size: 0.625rem;
      font-weight: 800;
      padding: 0.25rem 0.625rem;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      border: 1px solid transparent;

      .icon {
        font-size: 1rem;
      }

      &.positive {
        background: rgba($status-success-rgb, 0.1);
        color: $status-success;
        border-color: rgba($status-success-rgb, 0.2);
      }
      &.optimal {
        background: rgba($status-success-rgb, 0.15);
        color: $status-success-hover;
        border-color: rgba($status-success-rgb, 0.25);
      }
      &.alert,
      &.negative {
        background: rgba($status-danger-rgb, 0.1);
        color: $status-danger;
        border-color: rgba($status-danger-rgb, 0.2);
      }
      &.warning {
        background: rgba($status-warning-rgb, 0.1);
        color: $status-warning;
        border-color: rgba($status-warning-rgb, 0.2);
      }
    }
  }

  .card-body {
    flex: 1;
    display: flex;
    flex-direction: column;

    .card-label {
      color: $text-secondary;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 0 0 0.5rem 0;
    }

    .card-value {
      font-size: 1.75rem;
      font-weight: 600;
      color: $text-primary;
      margin: 0;
      line-height: 1.2;
      letter-spacing: -0.03em;

      .unit {
        font-size: 1rem;
        color: $text-muted;
        font-weight: 500;
        margin-left: 0.25rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .card-footer {
      margin-top: auto;
      padding-top: 1rem;

      .card-sub {
        font-size: 0.75rem;
        color: $text-muted;
        font-weight: 500;
        margin: 0;

        &.text-danger {
          color: #f43f5e;
        }
        &.text-success {
          color: #059669;
        }
      }
    }
  }

  .loading-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;

    .spinner {
      width: 1.5rem;
      height: 1.5rem;
      border: 2px solid $neutral-200;
      border-top-color: $primary-color;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
