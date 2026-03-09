<template>
  <div class="dashboard-home">
    <div class="page-header">
      <div class="header-text">
        <h2>System <span class="gradient-text">Overview</span></h2>
        <p>Real-time synthesis of global enterprise vectors.</p>
      </div>
      <div class="live-status glass-card">
        <span class="status-dot"></span>
        <span class="status-text">Live NiceUI Stream</span>
      </div>
    </div>

    <!-- Controls (Optional: Toggle Edit Mode) -->
    <div class="dashboard-controls mb-4 flex justify-end">
      <BaseButton
        :variant="isEditable ? 'primary' : 'ghost'"
        size="sm"
        icon="tune"
        @click="isEditable = !isEditable"
      >
        {{ isEditable ? "Done Editing" : "Customize Dashboard" }}
      </BaseButton>
    </div>

    <!-- Dynamic Grid -->
    <BaseDashboardGrid
      v-model:layout="dashboardStore.layout"
      :editable="isEditable"
      :row-height="100"
    >
      <!-- Stat: Revenue -->
      <template #revenue>
        <BaseHighlightCard
          label="Synthesized Revenue"
          value="$128,430"
          unit=".00"
          icon="auto_graph"
          variant="blue"
          :trend="12.5"
          trend-label="+12.5%"
          subtext="Quantum delta vs. previous cycle: +$14.2k"
          subtext-intent="success"
        />
      </template>

      <!-- Stat: Fulfillment -->
      <template #fulfillment>
        <BaseHighlightCard
          label="Active Fulfilments"
          value="45"
          unit="Active"
          icon="stream"
          variant="indigo"
          status="optimal"
          status-icon="check"
          subtext="8 nodes awaiting terminal dispatch"
        />
      </template>

      <!-- Stat: Assets -->
      <template #assets>
        <BaseHighlightCard
          label="Asset Depletion"
          value="12"
          unit="Units"
          icon="warning"
          variant="rose"
          status="alert"
          status-icon="priority_high"
          subtext="3 critical thresholds breached"
          subtext-intent="danger"
        />
      </template>

      <!-- Chart Panel -->
      <template #chart>
        <BaseCard class="h-full" :no-body-padding="true">
          <template #header>
            <div class="panel-header-content">
              <div>
                <h3 class="panel-title">Performance Projection</h3>
                <p class="panel-subtitle">Neural analytics stream</p>
              </div>
              <div class="panel-controls">
                <BaseButton
                  size="sm"
                  :variant="!is3dMode ? 'secondary' : 'ghost'"
                  @click="is3dMode = false"
                >
                  2D
                </BaseButton>
                <BaseButton
                  size="sm"
                  :variant="is3dMode ? 'secondary' : 'ghost'"
                  @click="is3dMode = true"
                >
                  3D
                </BaseButton>
              </div>
            </div>
          </template>

          <div class="chart-content-wrapper">
            <div class="chart-area">
              <BaseLineChart
                title=""
                :data="chartData"
                category-key="date"
                :series-keys="{
                  total_order: 'Total Orders',
                  total_payment: 'Revenue',
                }"
                :is3d="is3dMode"
                height="100%"
                width="100%"
              />
            </div>
            <div class="chart-labels">
              <p>Phase 01</p>
              <p>Phase 02</p>
              <p>Phase 03</p>
              <p>Phase 04</p>
              <p class="current">Current</p>
            </div>
          </div>
        </BaseCard>
      </template>

      <!-- Logs Panel -->
      <template #logs>
        <BaseCard
          class="h-full"
          title="Event Horizons"
          subtitle="NiceUI log activity"
        >
          <div class="logs-content-wrapper">
            <div class="logs-list-area">
              <ul class="logs-list">
                <li class="log-item">
                  <div class="icon-box soft-emerald">
                    <span class="material-symbols-outlined icon-small"
                      >verified</span
                    >
                  </div>
                  <div>
                    <h4 class="log-title">Node #4295 Synced</h4>
                    <p class="log-subtitle">Alex Rivera • 14 cycles ago</p>
                  </div>
                </li>
                <li class="log-item">
                  <div class="icon-box soft-blue">
                    <span class="material-symbols-outlined icon-small"
                      >person_add</span
                    >
                  </div>
                  <div>
                    <h4 class="log-title">New Core Entity Linked</h4>
                    <p class="log-subtitle">Sarah Smith • 2 solar hrs</p>
                  </div>
                </li>
                <li class="log-item">
                  <div class="icon-box soft-purple">
                    <span class="material-symbols-outlined icon-small"
                      >refresh</span
                    >
                  </div>
                  <div>
                    <h4 class="log-title">Asset Flux Adjustment</h4>
                    <p class="log-subtitle">Sector B • 5 solar hrs</p>
                  </div>
                </li>
              </ul>
            </div>
            <div class="logs-footer">
              <BaseButton variant="ghost" class="full-width-btn">
                Expand Log History
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </template>

      <!-- New Chart: Bar Comparison (2 Series) -->
      <template #revenue_target>
        <BaseCard
          class="h-full"
          title="Revenue vs Target"
          subtitle="Monthly Goals"
        >
          <div class="h-full p-4">
            <BaseBarChart
              :data="revenueTargetData"
              category-key="month"
              :series-keys="{ revenue: 'Revenue', target: 'Target' }"
              height="100%"
              width="100%"
            />
          </div>
        </BaseCard>
      </template>

      <!-- New Chart: Line Comparison (3 Series) -->
      <template #product_perf>
        <BaseCard
          class="h-full"
          title="Product Performance"
          subtitle="Weekly Trend"
        >
          <div class="h-full p-4">
            <BaseLineChart
              :data="productPerformanceData"
              category-key="day"
              :series-keys="{
                prodA: 'Prod A',
                prodB: 'Prod B',
                prodC: 'Prod C',
              }"
              height="100%"
              width="100%"
            />
          </div>
        </BaseCard>
      </template>

      <!-- New Chart: Pie Distribution -->
      <template #market_share>
        <BaseCard
          class="h-full"
          title="Market Share"
          subtitle="Global Distribution"
        >
          <div class="h-full p-4">
            <BasePieChart
              :data="marketShareData"
              label-key="region"
              value-key="share"
              :donut="true"
              height="100%"
              width="100%"
            />
          </div>
        </BaseCard>
      </template>
    </BaseDashboardGrid>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDashboardStore } from "@/stores/dashboardStore";
import BaseDashboardGrid from "@/components/Base/BaseDashboardGrid.vue";
import BaseHighlightCard from "@/components/Base/BaseHighlightCard.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseLineChart from "@/components/Base/BaseLineChart.vue";
import BaseBarChart from "@/components/Base/BaseBarChart.vue";
import BasePieChart from "@/components/Base/BasePieChart.vue";
import BaseCard from "@/components/Base/BaseCard.vue";

const isEditable = ref(false);
const dashboardStore = useDashboardStore();
const is3dMode = ref(false);

// 1. Line Chart Data (Existing)
const chartData = [
  { date: "2023-10-01", total_order: 150, total_payment: 12000000 },
  { date: "2023-10-02", total_order: 230, total_payment: 15000000 },
  { date: "2023-10-03", total_order: 224, total_payment: 14000000 },
  { date: "2023-10-04", total_order: 218, total_payment: 13500000 },
  { date: "2023-10-05", total_order: 135, total_payment: 11000000 },
  { date: "2023-10-06", total_order: 147, total_payment: 16000000 },
  { date: "2023-10-07", total_order: 260, total_payment: 19000000 },
];

// 2. Bar Chart Comparison (2 Data Series)
const revenueTargetData = [
  { month: "Jan", revenue: 45000, target: 50000 },
  { month: "Feb", revenue: 52000, target: 50000 },
  { month: "Mar", revenue: 48000, target: 55000 },
  { month: "Apr", revenue: 61000, target: 55000 },
  { month: "May", revenue: 58000, target: 60000 },
];

// 3. Line Chart Comparison (3 Data Series)
const productPerformanceData = [
  { day: "Mon", prodA: 120, prodB: 132, prodC: 101 },
  { day: "Tue", prodA: 132, prodB: 101, prodC: 134 },
  { day: "Wed", prodA: 101, prodB: 134, prodC: 90 },
  { day: "Thu", prodA: 134, prodB: 90, prodC: 230 },
  { day: "Fri", prodA: 90, prodB: 230, prodC: 210 },
  { day: "Sat", prodA: 230, prodB: 210, prodC: 120 },
  { day: "Sun", prodA: 210, prodB: 120, prodC: 132 },
];

// 4. Pie Chart Data (Distribution)
const marketShareData = [
  { region: "North America", share: 40 },
  { region: "Europe", share: 30 },
  { region: "Asia Pacific", share: 20 },
  { region: "Latin America", share: 10 },
];

// Update Layout to include new charts if not already present
// Ideally this should be in the store, but we'll patch it here for the demo if needed
// Or assume the store provides slots. Let's start by assuming we fit them in the grid.
// If the store manages layout, we might need to update the store initial state.
// For now, let's assume the user wants to see them on the page.
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/mixins" as *;

.dashboard-home {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1rem;

  .header-text {
    h2 {
      font-size: 2.25rem;
      font-weight: 300;
      color: var(--text-primary);
      letter-spacing: -0.025em;
      margin: 0;

      .gradient-text {
        @include text-gradient-primary;
        font-weight: 700;
      }
    }

    p {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-top: 0.5rem;
      font-weight: 500;
      letter-spacing: 0.025em;
    }
  }

  .live-status {
    @include glass-card;
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--surface-glass);

    .status-dot {
      width: 0.5rem;
      height: 0.5rem;
      background: #10b981; // emerald-500
      border-radius: 50%;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .status-text {
      font-size: 0.625rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #059669; // emerald-600
      text-transform: uppercase;
    }
  }
}

// Chart & Log Styles
.panel-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .panel-title {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-primary);
    text-transform: uppercase;
    margin: 0 0 0.25rem 0;
  }

  .panel-subtitle {
    font-size: 0.625rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    font-weight: 500;
    margin: 0;
  }

  .panel-controls {
    display: flex;
    gap: 0.25rem;
    background: rgba(var(--neutral-100-rgb), 0.5);
    padding: 0.25rem;
    border-radius: 0.75rem;
  }
}

.chart-content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;

  .chart-area {
    flex: 1;
    padding: 1.5rem;
  }

  .chart-labels {
    display: flex;
    justify-content: space-between;
    padding: 0 2rem 1.5rem 2rem;

    p {
      font-size: 0.625rem;
      color: var(--text-muted);
      font-weight: 700;
      text-transform: uppercase;
    }
    .current {
      color: $primary-color;
      background: rgba($primary-rgb, 0.1);
      padding: 0.125rem 0.5rem;
      border-radius: 0.375rem;
    }
  }
}

.logs-content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.logs-list-area {
  flex: 1;
  overflow-y: auto;
  padding: 1rem; // Adjusted padding since BaseCard Body has padding
}

.logs-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.log-item {
  display: flex;
  gap: 1rem;

  .icon-box {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;

    &.soft-emerald {
      background: rgba($status-success-rgb, 0.1);
      color: $status-success;
    }
    &.soft-blue {
      background: rgba($primary-rgb, 0.1);
      color: $primary-color;
    }
    &.soft-purple {
      background: rgba(147, 51, 234, 0.1);
      color: #c084fc;
    }

    .icon-small {
      font-size: 1.25rem;
    }
  }

  .log-title {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .log-subtitle {
    font-size: 0.625rem;
    color: var(--text-secondary);
    font-weight: 600;
    text-transform: uppercase;
    margin: 0.25rem 0 0 0;
  }
}

.logs-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(var(--neutral-200-rgb), 0.4);

  .full-width-btn {
    width: 100%;
    font-size: 0.75rem;
    font-weight: 900;
    text-transform: uppercase;
    color: $primary-color;
    border: 1px solid rgba($primary-rgb, 0.2);

    &:hover {
      background: $primary-color;
      color: white;
    }
  }
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
