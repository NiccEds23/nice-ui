import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VueRouterAutoImports } from "unplugin-vue-router";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    VueRouter({
      /* options */
    }),
    vue(),
    AutoImport({
      imports: ["vue", VueRouterAutoImports, "pinia"],
      dts: "src/auto-imports.d.ts",
      dirs: [
        "src/composables",
        "src/stores",
        "src/modules/*/stores",
        "src/utils",
      ],
      vueTemplate: true,
    }),
    Components({
      dirs: ["src/components", "src/modules/*/components"],
      dts: "src/components.d.ts",
    }),
  ],
  build: {
    // Modern output — no IE11 polyfills
    target: "esnext",

    // Warn when any single chunk exceeds 1MB (gzipped it will be ~250KB)
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        /**
         * Manual chunk splitting strategy:
         *  - vue-vendor  : Vue core (rarely changes — long cache TTL)
         *  - echarts     : ECharts 2D (rarely changes — long cache TTL)
         *  - ui-vendor   : Other heavy UI libs (grid-layout-plus, maska)
         *  - app code    : Changes every deploy — separate from vendor cache
         *
         * echarts-gl (3D) is NOT included here because it is loaded
         * dynamically via import() only when `is3d` prop is true.
         */
        manualChunks: (id) => {
          // Vue + Vue Router + Pinia → single cacheable chunk
          if (
            id.includes("node_modules/vue") ||
            id.includes("node_modules/vue-router") ||
            id.includes("node_modules/@vue") ||
            id.includes("node_modules/pinia") ||
            id.includes("node_modules/@vueuse")
          ) {
            return "vue-vendor";
          }

          // ECharts 2D core — large but stable
          if (
            id.includes("node_modules/echarts") &&
            !id.includes("echarts-gl")
          ) {
            return "echarts-vendor";
          }

          // vue-echarts wrapper
          if (id.includes("node_modules/vue-echarts")) {
            return "echarts-vendor";
          }

          // Other heavy UI utilities
          if (
            id.includes("node_modules/grid-layout-plus") ||
            id.includes("node_modules/maska") ||
            id.includes("node_modules/swrv") ||
            id.includes("node_modules/axios")
          ) {
            return "ui-vendor";
          }
        },
      },
    },
  },
});
