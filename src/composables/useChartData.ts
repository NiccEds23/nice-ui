import { computed } from "vue";

interface RowData {
  [key: string]: any;
}

interface UseChartDataProps {
  data: RowData[];
  categoryKey: string; // The key for X-axis (e.g., 'date')
  seriesKeys: string[] | Record<string, string>; // Keys to plot (e.g., ['total_order'] or { total_order: 'Orders' })
}

export function useChartData(props: UseChartDataProps) {
  // Extract Categories (X-Axis)
  const categories = computed(() => {
    return props.data.map((item) => item[props.categoryKey]);
  });

  // Extract Series
  const series = computed(() => {
    const keys = Array.isArray(props.seriesKeys)
      ? props.seriesKeys.map((k) => ({ key: k, label: k }))
      : Object.entries(props.seriesKeys).map(([key, label]) => ({
          key,
          label,
        }));

    return keys.map(({ key, label }) => ({
      name: label,
      type: "line", // Default, can be overridden
      data: props.data.map((item) => item[key]),
      smooth: true,
      showSymbol: false,
    }));
  });

  return {
    categories,
    series,
  };
}
