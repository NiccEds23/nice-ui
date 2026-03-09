<template>
  <header class="top-bar">
    <div class="spacer"></div>
    <DashboardNavbarActions />
  </header>
</template>

<script setup lang="ts">
import DashboardNavbarActions from '@/components/Layout/DashboardNavbarActions.vue';
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.top-bar {
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  
  .spacer { flex: 1; }
}
</style>
