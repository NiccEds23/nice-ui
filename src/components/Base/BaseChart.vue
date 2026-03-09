<template>
  <div class="base-chart" :style="{ height, width }">
    <v-chart
      v-if="shouldRender"
      class="chart-instance"
      :option="themeOptions"
      :autoresize="true"
      :loading="loading"
      :theme="isDark ? 'dark' : undefined"
      :style="{ height: '100%', width: '100%', minHeight: '300px' }"
      background-color="transparent"
    />
    <div v-else-if="!options" class="chart-empty">No data available</div>
    <div v-else class="chart-loading-placeholder"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, onMounted, nextTick, watch } from "vue";
import VChart, { THEME_KEY } from "vue-echarts";
import { useTheme } from "@/composables/useTheme"; // Assuming you have this
import type { EChartsOption } from "echarts";

// Explicitly register theme for ECharts if needed (vue-echarts handles reactive theme prop)
// But we need to toggle 'dark' string based on our app theme

const props = defineProps<{
  options: EChartsOption | null;
  height?: string;
  width?: string;
  loading?: boolean;
}>();

const { theme } = useTheme();
const isDark = computed(() => theme.value === "dark");

const isMounted = ref(false);

const shouldRender = computed(() => {
  return !!props.options && isMounted.value;
});

onMounted(() => {
  // Delay slightly to ensure layout is computed
  nextTick(() => {
    isMounted.value = true;
  });
});

// Inject global styles or overrides if needed
const themeOptions = computed(() => {
  if (!props.options) return {};

  // Merge with default styles for the app
  const base: EChartsOption = {
    backgroundColor: "transparent",
    textStyle: {
      fontFamily: "Plus Jakarta Sans, sans-serif",
    },
    grid: {
      top: 30,
      left: 20,
      right: 20,
      bottom: 20,
      containLabel: true,
    },
  };

  return { ...base, ...props.options };
});

// Provide theme for child components if they need it
provide(THEME_KEY, isDark.value ? "dark" : "light");
</script>

<style lang="scss" scoped>
.base-chart {
  position: relative;
  overflow: hidden;

  .chart-instance {
    height: 100%;
    width: 100%;
  }

  .chart-empty {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    font-size: 0.875rem;
  }
}
</style>
