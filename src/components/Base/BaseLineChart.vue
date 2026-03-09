<template>
  <BaseChart
    :options="chartOptions"
    :height="height"
    :width="width"
    :loading="loading"
  />
</template>

<script setup lang="ts">
import { computed, watchEffect } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
} from "echarts/components";
import BaseChart from "./BaseChart.vue";
import { useChartData } from "@/composables/useChartData";

// Register 2D ECharts components — always needed, lightweight
use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
]);

const props = defineProps<{
  data: any[];
  categoryKey: string;
  seriesKeys: string[] | Record<string, string>;
  title?: string;
  is3d?: boolean;
  height?: string;
  width?: string;
  loading?: boolean;
}>();

// echarts-gl (~2.5MB) is loaded on demand only when is3d=true — keeps initial bundle lean
watchEffect(async () => {
  if (props.is3d) {
    const [{ Line3DChart }, { Grid3DComponent }] = await Promise.all([
      import("echarts-gl/charts"),
      import("echarts-gl/components"),
    ]);
    use([Line3DChart, Grid3DComponent]);
  }
});

const { categories, series } = useChartData(props);

const chartOptions = computed(() => {
  if (props.is3d) {
    return {
      title: { text: props.title },
      tooltip: {},
      visualMap: {
        show: false,
        dimension: 2,
        min: 0,
        max: 30,
      },
      xAxis3D: {
        type: "category",
        data: categories.value,
      },
      yAxis3D: { type: "value" },
      zAxis3D: { type: "value" },
      grid3D: {
        viewControl: { projection: "orthographic" },
      },
      series: series.value.map((s) => ({
        type: "line3D",
        data: s.data.map((val: any, idx: number) => [idx, 0, val]),
        lineStyle: { width: 4 },
      })),
    } as any;
  }

  return {
    title: { text: props.title },
    tooltip: { trigger: "axis" },
    legend: { show: true, bottom: 0 },
    grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: categories.value,
      axisLine: { lineStyle: { color: "var(--text-muted)" } },
      axisLabel: { color: "var(--text-secondary)" },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { color: "var(--chart-grid)" } },
      axisLabel: { color: "var(--text-secondary)" },
    },
    series: series.value.map((s) => ({
      ...s,
      type: "line",
      smooth: true,
      symbol: "circle",
      symbolSize: 8,
      itemStyle: { borderWidth: 2 },
      areaStyle: { opacity: 0.1 },
    })),
  } as any;
});
</script>
