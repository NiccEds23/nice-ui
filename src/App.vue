<template>
  <component :is="layout">
    <RouterView />
  </component>
  <BaseLoader
    :show="uiStore.isLoading"
    :message="uiStore.loadingMessage"
    fullScreen
  />
  <BaseAlert />
  <BaseToast />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import BaseLoader from "@/components/Base/BaseLoader.vue";
import BaseAlert from "@/components/Base/BaseAlert.vue";
import BaseToast from "@/components/Base/BaseToast.vue";
import { useUIStore } from "@/stores/ui";

const route = useRoute();
const uiStore = useUIStore();

// Initialize Theme
import { useTheme } from "@/composables/useTheme";
const { theme } = useTheme();

const layout = computed(() => {
  return route.meta.layout === "auth" ? "div" : DashboardLayout;
});
</script>

<style>
/* Global styles can go here or in main.scss */
</style>
