import { ref, watch } from "vue";

interface LayoutItem {
  i: string | number;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  [key: string]: any;
}

export const useDashboardStore = defineStore("dashboard", () => {
  const STORAGE_KEY = "niceui-dashboard-layout";

  // Default Layout Configuration
  const defaultLayout: LayoutItem[] = [
    // Stats Row
    { i: "revenue", x: 0, y: 0, w: 4, h: 3, minW: 3, minH: 3 },
    { i: "fulfillment", x: 4, y: 0, w: 4, h: 3, minW: 3, minH: 3 },
    { i: "assets", x: 8, y: 0, w: 4, h: 3, minW: 3, minH: 3 },

    // Charts & Logs Row
    { i: "chart", x: 0, y: 3, w: 8, h: 5, minW: 6, minH: 4 },
    { i: "logs", x: 8, y: 3, w: 4, h: 5, minW: 3, minH: 4 },

    // Row 2: Additional Charts
    { i: "revenue_target", x: 0, y: 8, w: 4, h: 4, minW: 3, minH: 3 },
    { i: "product_perf", x: 4, y: 8, w: 4, h: 4, minW: 3, minH: 3 },
    { i: "market_share", x: 8, y: 8, w: 4, h: 4, minW: 3, minH: 3 },
  ];

  // Merge saved layout with default to ensure new items appear
  // This is a simple merge strategy: if saved exists, use it, but check if we are missing keys
  const saved = localStorage.getItem(STORAGE_KEY);
  let initialLayout = defaultLayout;

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Check if our new keys exist in saved layout
      const hasNewKeys = parsed.some(
        (item: any) => item.i === "revenue_target",
      );
      if (hasNewKeys) {
        initialLayout = parsed;
      } else {
        // If missing new keys, we 'migrate' by appending them or just resetting
        // For simplicity in this dev phase, let's append default positions for new items
        const newItems = defaultLayout.filter(
          (d) => !parsed.some((p: any) => p.i === d.i),
        );
        initialLayout = [...parsed, ...newItems];
      }
    } catch (e) {
      console.error("Failed to parse layout", e);
    }
  }

  const layout = ref<LayoutItem[]>(initialLayout);

  // Watch for changes and save to LocalStorage
  watch(
    layout,
    (newLayout) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLayout));
    },
    { deep: true },
  );

  // Actions
  const resetLayout = () => {
    layout.value = structuredClone(defaultLayout);
  };

  const updateLayout = (newLayout: LayoutItem[]) => {
    // Basic validation or sanitization could go here
    layout.value = newLayout;
  };

  return {
    layout,
    resetLayout,
    updateLayout,
  };
});
