<template>
  <div class="dashboard-layout">
    <div class="glass-orb orb-1"></div>
    <div class="glass-orb orb-2"></div>
    <div class="glass-orb orb-3"></div>

    <Sidebar />

    <div class="main-content">
      <DashboardNavbar />

      <main class="page-content" ref="pageContentRef">
        <BaseBreadcrumb />
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Layout/Sidebar.vue';
import DashboardNavbar from '@/components/Layout/DashboardNavbar.vue';
import { useUIStore } from '@/stores/ui';
import { nextTick, ref, watch } from 'vue';
import BaseBreadcrumb from '@/components/Base/BaseBreadcrumb.vue';


const uiStore = useUIStore();
const pageContentRef = ref<HTMLElement | null>(null);

// Watch for scroll requests from router via store
watch(
  () => uiStore.nextScrollPosition,
  async (newPos) => {
    if (newPos && pageContentRef.value) {
      await nextTick(); // Ensure DOM is ready (though route change usually mounts first)
      pageContentRef.value.scrollTop = newPos.top;
      // Reset after applying to avoid re-triggering
      uiStore.setNextScroll(null);
    }
  }
);
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.dashboard-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

// Background Orbs
.glass-orb {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: -10;
  
  &.orb-1 {
    top: -10%;
    left: -10%;
    width: 500px;
    height: 500px;
    background: rgba(191, 219, 254, 0.3); // blue-200/30
    filter: blur(100px);
  }
  
  &.orb-2 {
    bottom: -10%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: rgba(199, 210, 254, 0.3); // indigo-200/30
    filter: blur(120px);
  }
  
  &.orb-3 {
    top: 20%;
    right: 30%;
    width: 300px;
    height: 300px;
    background: rgba(207, 250, 254, 0.4); // cyan-100/40
    filter: blur(80px);
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10;
}



.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 2.5rem 2.5rem 2.5rem;
  
  // Custom scrollbar for page content?
  &::-webkit-scrollbar {
    display: none; // Hiding scrollbar for cleaner look as per design often, or keeping default
  }
}
</style>
