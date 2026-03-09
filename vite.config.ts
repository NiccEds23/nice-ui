import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    VueRouter({
      /* options */
    }),
    vue(),
    AutoImport({
      imports: [
        'vue',
        VueRouterAutoImports,
        'pinia',
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables',
        'src/stores',
        'src/modules/*/stores',
        'src/utils'
      ],
      vueTemplate: true,
    }),
    Components({
      dirs: ['src/components', 'src/modules/*/components'],
      dts: 'src/components.d.ts',
    }),
  ],
})
