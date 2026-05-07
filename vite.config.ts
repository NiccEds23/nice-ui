import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VueRouterAutoImports } from "unplugin-vue-router";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    VueRouter({
      // Each page becomes a separate async chunk — only downloaded when the route is visited.
      importMode: "async",
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

  // Strip console.* and debugger statements in production builds at the esbuild
  // transform stage — no source changes needed.
  esbuild: {
    drop: mode === "production" ? (["console", "debugger"] as const) : [],
  },

  build: {
    // Modern output — no IE11 polyfills
    target: "esnext",

    // Sourcemaps expose original source code on the server.
    // Only generate them during development / CI; never ship them to production.
    sourcemap: mode !== "production",

    // Warn when any single chunk exceeds 1 MB (gzipped it will be ~250 KB)
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        /**
         * Manual chunk splitting strategy:
         *  - vue-vendor    : Vue core (rarely changes — long cache TTL)
         *  - echarts-vendor: ECharts 2D (rarely changes — long cache TTL)
         *  - ui-vendor     : Other heavy UI libs (grid-layout-plus, maska)
         *  - page chunks   : One chunk per route via importMode:'async' (auto)
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
}));
