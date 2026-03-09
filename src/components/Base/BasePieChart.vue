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
import { PieChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from "echarts/components";
import BaseChart from "./BaseChart.vue";

use([
  CanvasRenderer,
  PieChart,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
]);

const props = defineProps<{
  data: any[];
  valueKey: string;
  labelKey: string;
  title?: string;
  is3d?: boolean; // Note: ECharts GL doesn't support true 3D Pie. We can simulate or ignore.
  donut?: boolean;
  height?: string;
  width?: string;
  loading?: boolean;
}>();

const transformedData = computed(() => {
  return props.data.map((item) => ({
    name: item[props.labelKey],
    value: item[props.valueKey],
  }));
});

const chartOptions = computed(() => {
  // Parsing 3D mode for Pie is complex/unsupported in standard GL.
  // We will stick to 2D for now, but enhanced.

  return {
    title: { text: props.title, left: "center" },
    tooltip: { trigger: "item" },
    legend: { oriental: "vertical", left: "left", bottom: 0 },
    series: [
      {
        name: props.title || "Data",
        type: "pie",
        radius: props.donut ? ["40%", "70%"] : "50%",
        data: transformedData.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        itemStyle: {
          borderRadius: 5,
          borderColor: "#fff",
          borderWidth: 2,
        },
      },
    ],
  };
});
</script>
