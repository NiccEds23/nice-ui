<template>
  <BaseChart
    :options="chartOptions"
    :height="height"
    :width="width"
    :loading="loading"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
} from "echarts/components";
import { Bar3DChart } from "echarts-gl/charts";
import { Grid3DComponent } from "echarts-gl/components";
import BaseChart from "./BaseChart.vue";
import { useChartData } from "@/composables/useChartData";

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
  Bar3DChart,
  Grid3DComponent,
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

const { categories, series } = useChartData(props);

const chartOptions = computed(() => {
  if (props.is3d) {
    return {
      title: { text: props.title },
      tooltip: {},
      visualMap: {
        max: 1000,
        inRange: {
          color: [
            "#313695",
            "#4575b4",
            "#74add1",
            "#abd9e9",
            "#e0f3f8",
            "#ffffbf",
            "#fee090",
            "#fdae61",
            "#f46d43",
            "#d73027",
            "#a50026",
          ],
        },
      },
      xAxis3D: {
        type: "category",
        data: categories.value,
      },
      yAxis3D: {
        type: "category",
        data: series.value.map((s) => s.name),
      },
      zAxis3D: {
        type: "value",
      },
      grid3D: {
        boxWidth: 200,
        boxDepth: 80,
        viewControl: {
          // projection: 'orthographic'
        },
        light: {
          main: {
            intensity: 1.2,
            shadow: true,
          },
          ambient: {
            intensity: 0.3,
          },
        },
      },
      series: series.value.map((s, index) => ({
        type: "bar3D",
        data: s.data.map((val: any, idx: number) => [idx, index, val]),
        shading: "lambert",
        label: { show: false, fontSize: 16, borderWidth: 1 },
      })),
    } as any;
  }

  return {
    title: { text: props.title },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: { show: true, bottom: 0 },
    grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
    xAxis: {
      type: "category",
      data: categories.value,
      axisLabel: { color: "var(--text-secondary)" },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "var(--text-secondary)" },
      splitLine: {
        lineStyle: { type: "dashed", color: "var(--chart-grid)" },
      },
      nameTextStyle: { color: "var(--text-secondary)" },
    },
    series: series.value.map((s) => ({
      ...s,
      type: "bar",
      itemStyle: { borderRadius: [4, 4, 0, 0] },
      emphasis: { focus: "series" },
    })),
  } as any;
});
</script>
